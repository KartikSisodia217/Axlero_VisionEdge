"""
test_pipeline.py — Role 4 standalone test

Uses fake stand-ins for Role 2 (decoder) and Role 3 (inference) so
this pipeline can be fully tested without either of them existing yet.
Both fakes match the exact interface contract documented at the top
of pipeline.py — when the real Role 2/Role 3 code lands, only these
two fake classes get swapped out, nothing else changes.
"""

import time
import numpy as np
import cupy as cp

from pipeline import PipelineManager
import logging
logging.basicConfig(level=logging.DEBUG, format="%(levelname)s %(name)s: %(message)s")

class FakeFrameSource:
    """Stands in for Role 2's decoder — returns a plain gray test
    frame instead of a real camera feed."""
    def get_frame(self, stream_id, timeout=1.0):
        return np.full((480, 640, 3), 100, dtype=np.uint8)


class FakeBox:
    def __init__(self, x1, y1, x2, y2, class_id, class_name, confidence):
        self.x1, self.y1, self.x2, self.y2 = x1, y1, x2, y2
        self.class_id = class_id
        self.class_name = class_name
        self.confidence = confidence


class FakeDetectionResult:
    def __init__(self, boxes, inference_time_ms):
        self.boxes = boxes
        self.inference_time_ms = inference_time_ms


class FakeInferenceEngine:
    """Stands in for Role 3's VisionEdgeInference. Matches the real
    contract: receives a CuPy (GPU-resident) frame, returns an object
    with .boxes and .inference_time_ms."""
    def predict(self, frame: cp.ndarray):
        assert isinstance(frame, cp.ndarray), (
            f"Expected a CuPy array (GPU-resident frame), got {type(frame)}"
        )
        time.sleep(0.02)  # pretend inference takes 20ms
        boxes = [
            FakeBox(50, 60, 200, 220, class_id=0, class_name="person", confidence=0.91),
            FakeBox(300, 100, 420, 260, class_id=2, class_name="car", confidence=0.87),
        ]
        return FakeDetectionResult(boxes=boxes, inference_time_ms=20.0)


print("Starting Role 4 standalone test (no Role 2 or Role 3 required)...")

engine = FakeInferenceEngine()
manager = PipelineManager(inference_engine=engine)
manager.add_stream("cam-01", frame_source=FakeFrameSource())

print("Pipeline running, waiting for a frame...")
for i in range(10):
    time.sleep(1)
    print(f"[{i+1}s]", manager.get_latest_stats("cam-01"))

stats = manager.get_latest_stats("cam-01")
frame = manager.get_latest_frame("cam-01")

print("Stats:", stats)
print("Got a frame back:", frame is not None)
if frame is not None:
    print("Frame shape:", frame.shape, "dtype:", frame.dtype)

manager.stop_all()
print("Test complete.")