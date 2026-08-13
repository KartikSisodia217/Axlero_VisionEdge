"""
test_decoder.py — Role 2 standalone test

Generates a short synthetic test video locally (no real RTSP camera
needed) and runs it through the full decoder pipeline to verify
frames come out in the shape/dtype Role 4 expects: BGR uint8,
shape (H, W, 3).
"""

import os
import tempfile
import time

import cv2
import numpy as np

from __init__ import CameraManager


def make_test_video(path: str, width=640, height=480, fps=15, seconds=5):
    """Writes a short synthetic video: a colored frame with a moving
    white square, so we can visually confirm frames are actually
    changing (not just returning the same static frame)."""
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    writer = cv2.VideoWriter(path, fourcc, fps, (width, height))
    for i in range(fps * seconds):
        frame = np.full((height, width, 3), (40, 40, 40), dtype=np.uint8)
        x = (i * 5) % (width - 50)
        cv2.rectangle(frame, (x, 200), (x + 50, 250), (255, 255, 255), -1)
        writer.write(frame)
    writer.release()


print("Generating synthetic test video...")
tmp_dir = tempfile.mkdtemp()
video_path = os.path.join(tmp_dir, "test_video.mp4")
make_test_video(video_path)
print(f"Test video created at: {video_path}")

print("\nStarting CameraManager with the test video as source...")
manager = CameraManager()
manager.add_camera("cam-01", video_path)

print("Polling for frames...")
for i in range(8):
    time.sleep(1)
    frame = manager.get_frame("cam-01", timeout=1.0)
    live = manager.is_live("cam-01")
    if frame is not None:
        print(f"[{i+1}s] Got frame: shape={frame.shape}, dtype={frame.dtype}, is_live={live}")
    else:
        print(f"[{i+1}s] No frame yet, is_live={live}")

manager.stop_all()
os.remove(video_path)
print("\nTest complete.")