"""
frame_buffer.py — Role 2: Video Processing Engineer

Holds the single most recent decoded frame per camera stream, written
by the decode thread and read by whoever calls get_frame(). This is
intentionally NOT a queue — for a live video pipeline, an old buffered
frame is worse than no frame, so each new frame simply overwrites the
last one rather than piling up.
"""

import logging
import threading
import time
from typing import Optional

import numpy as np

logger = logging.getLogger("visionedge.frame_buffer")


class FrameBuffer:
    """Thread-safe single-slot buffer for one camera stream."""

    def __init__(self, stream_id: str):
        self.stream_id = stream_id
        self._lock = threading.Lock()
        self._frame: Optional[np.ndarray] = None
        self._last_updated: float = 0.0
        self._frame_count: int = 0

    def write(self, frame: np.ndarray) -> None:
        with self._lock:
            self._frame = frame
            self._last_updated = time.monotonic()
            self._frame_count += 1

    def read(self, max_age: float = 2.0) -> Optional[np.ndarray]:
        """Returns the latest frame, or None if there isn't one yet or
        it's older than max_age seconds (camera likely stalled)."""
        with self._lock:
            if self._frame is None:
                return None
            if time.monotonic() - self._last_updated > max_age:
                logger.warning(
                    "Stream '%s' frame is stale (%.1fs old), treating as no frame",
                    self.stream_id, time.monotonic() - self._last_updated,
                )
                return None
            return self._frame.copy()

    @property
    def frame_count(self) -> int:
        with self._lock:
            return self._frame_count

    @property
    def is_live(self) -> bool:
        with self._lock:
            return self._frame is not None and (time.monotonic() - self._last_updated) < 2.0


class FrameBufferRegistry:
    """Holds one FrameBuffer per stream_id, created on first use."""

    def __init__(self):
        self._buffers: dict[str, FrameBuffer] = {}
        self._lock = threading.Lock()

    def get_or_create(self, stream_id: str) -> FrameBuffer:
        with self._lock:
            if stream_id not in self._buffers:
                self._buffers[stream_id] = FrameBuffer(stream_id)
            return self._buffers[stream_id]

    def get(self, stream_id: str) -> Optional[FrameBuffer]:
        with self._lock:
            return self._buffers.get(stream_id)

    def remove(self, stream_id: str) -> None:
        with self._lock:
            self._buffers.pop(stream_id, None)