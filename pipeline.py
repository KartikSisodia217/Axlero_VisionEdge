"""
pipeline.py — Role 4: GPU Pipeline Engineer

======================================================================
INTERFACE CONTRACT — for Role 2 (decoder) and Role 3 (inference)
======================================================================

Role 2's FrameSource.get_frame(stream_id, timeout) must return:
    - A NumPy array (host memory), BGR uint8, shape (H, W, 3)
    - Or None if no frame is ready within `timeout` seconds

Role 3's InferenceEngine.predict(frame) receives:
    - frame: a CuPy array (GPU-resident), BGR, shape (H, W, 3)
      NOTE: this is a CuPy array, not a NumPy array. This is different
      from the earlier version of this contract — as part of the
      zero-copy rework, the frame is uploaded to GPU exactly once,
      right after Role 2 hands it off, and never leaves GPU memory
      again until the very end of the pipeline.
      If your model is PyTorch-based, convert with zero extra copy
      via DLPack:
          import torch
          tensor = torch.as_tensor(cupy_frame, device="cuda")
      predict() must still do its own letterbox resize, BGR->RGB,
      HWC->CHW, and normalization internally — just do it on-GPU now.

Role 3's predict() must return an object with:
    - .inference_time_ms (float)
    - .boxes (iterable, len() supported), each box needing:
        .x1, .y1, .x2, .y2   (pixel coords in the ORIGINAL frame)
        .class_id   (int)
        .class_name (str)
        .confidence (float)

Thread-safety: one InferenceEngine instance is shared across all
camera streams, each on its own thread. predict() WILL be called
concurrently — make it thread-safe internally.
======================================================================
"""

import logging
import threading
import time
from typing import Optional, Protocol

import numpy as np
import cupy as cp

from gpu_memory import GpuMemoryManager
from preprocess import validate_frame
from postprocess import draw_detections, draw_hud

logger = logging.getLogger("visionedge.pipeline")


class FrameSource(Protocol):
    def get_frame(self, stream_id: str, timeout: float = 1.0) -> Optional[np.ndarray]:
        ...


class InferenceEngine(Protocol):
    def predict(self, frame: cp.ndarray):
        ...


class _NullFrameSource:
    def get_frame(self, stream_id: str, timeout: float = 1.0):
        time.sleep(min(timeout, 0.1))
        return None


class StreamPipeline:
    def __init__(self, stream_id: str, frame_source: FrameSource,
                 inference_engine: InferenceEngine, gpu_manager: GpuMemoryManager,
                 show_hud: bool = True):
        self.stream_id = stream_id
        self.frame_source = frame_source
        self.inference_engine = inference_engine
        self.gpu_manager = gpu_manager
        self.show_hud = show_hud

        self._stop_event = threading.Event()
        self._thread: Optional[threading.Thread] = None
        self._lock = threading.Lock()
        self._latest_frame: Optional[np.ndarray] = None
        self._latest_stats: dict = {"status": "connecting", "fps": 0, "latency_ms": 0, "detection_count": 0}
        self._fps_ema: Optional[float] = None

    def start(self):
        self._thread = threading.Thread(target=self._run, name=f"pipeline-{self.stream_id}", daemon=True)
        self._thread.start()
        logger.info("Started pipeline for stream '%s'", self.stream_id)

    def stop(self):
        self._stop_event.set()
        if self._thread:
            self._thread.join(timeout=5)
        logger.info("Stopped pipeline for stream '%s'", self.stream_id)

    def get_latest_frame(self) -> Optional[np.ndarray]:
        with self._lock:
            return None if self._latest_frame is None else self._latest_frame.copy()

    def get_latest_stats(self) -> dict:
        with self._lock:
            return dict(self._latest_stats)

    def _run(self):
        while not self._stop_event.is_set():
            frame = self.frame_source.get_frame(self.stream_id, timeout=1.0)
            if frame is None:
                with self._lock:
                    self._latest_stats["status"] = "connecting"
                continue
            if not validate_frame(frame):
                continue
            try:
                self._process_one(frame)
            except Exception:
                logger.exception("Pipeline error on stream '%s'", self.stream_id)

    def _process_one(self, frame: np.ndarray):
        t_start = time.monotonic()

        # Single host->device upload. Everything after this stays on GPU.
        gpu_frame = self.gpu_manager.to_gpu(frame)

        result = self.inference_engine.predict(gpu_frame)
        annotated_gpu = draw_detections(gpu_frame, result)

        elapsed_ms = (time.monotonic() - t_start) * 1000
        instant_fps = 1000.0 / elapsed_ms if elapsed_ms > 0 else 0.0
        self._fps_ema = instant_fps if self._fps_ema is None else (0.9 * self._fps_ema + 0.1 * instant_fps)

        if self.show_hud:
            annotated_gpu = draw_hud(annotated_gpu, self._fps_ema, result.inference_time_ms, len(result.boxes))

        # Single device->host download, right before handing off to Role 5's WebRTC track.
        annotated = self.gpu_manager.to_host(annotated_gpu)

        with self._lock:
            self._latest_frame = annotated
            self._latest_stats = {
                "status": "live",
                "fps": round(self._fps_ema, 1),
                "latency_ms": round(result.inference_time_ms, 1),
                "detection_count": len(result.boxes),
            }


class PipelineManager:
    def __init__(self, inference_engine: InferenceEngine, pool_size_per_stream: int = 4):
        self.inference_engine = inference_engine
        self.gpu_manager = GpuMemoryManager(pool_size_per_stream)
        self._pipelines: dict[str, StreamPipeline] = {}

    def add_stream(self, stream_id: str, frame_source: Optional[FrameSource] = None):
        if stream_id in self._pipelines:
            logger.warning("Stream '%s' already running, ignoring add_stream", stream_id)
            return
        pipeline = StreamPipeline(
            stream_id=stream_id,
            frame_source=frame_source or _NullFrameSource(),
            inference_engine=self.inference_engine,
            gpu_manager=self.gpu_manager,
        )
        self._pipelines[stream_id] = pipeline
        pipeline.start()

    def remove_stream(self, stream_id: str):
        pipeline = self._pipelines.pop(stream_id, None)
        if pipeline:
            pipeline.stop()

    def stop_all(self):
        for stream_id in list(self._pipelines):
            self.remove_stream(stream_id)

    def get_latest_frame(self, stream_id: str) -> Optional[np.ndarray]:
        pipeline = self._pipelines.get(stream_id)
        return pipeline.get_latest_frame() if pipeline else None

    def get_latest_stats(self, stream_id: str) -> dict:
        pipeline = self._pipelines.get(stream_id)
        if pipeline:
            return pipeline.get_latest_stats()
        return {"status": "lost", "fps": 0, "latency_ms": 0, "detection_count": 0}