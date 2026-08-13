"""
postprocess.py — Role 4: GPU Pipeline Engineer

Draws detection boxes and the HUD directly on the GPU-resident frame
(a CuPy array) so the frame never has to round-trip to host memory
between inference and drawing. The only CPU touch-point is the final
.get() call in pipeline.py, right before handing the frame off to
Role 5's WebRTC track.
"""

import logging
import cupy as cp
import numpy as np

logger = logging.getLogger("visionedge.postprocess")

_BOX_COLORS = [
    (56, 56, 255), (151, 157, 255), (31, 112, 255), (29, 178, 255),
    (49, 210, 207), (10, 249, 72), (23, 204, 146), (140, 235, 60),
]


def _color_for(class_id: int) -> tuple:
    return _BOX_COLORS[class_id % len(_BOX_COLORS)]


def _draw_rect_gpu(frame: cp.ndarray, x1: int, y1: int, x2: int, y2: int,
                    color: tuple, thickness: int = 2):
    """Draws a filled or outlined rectangle directly on a CuPy array
    using array slicing — no CPU round-trip, no OpenCV call."""
    h, w = frame.shape[:2]
    x1, x2 = max(0, min(x1, w)), max(0, min(x2, w))
    y1, y2 = max(0, min(y1, h)), max(0, min(y2, h))
    color_arr = cp.array(color, dtype=frame.dtype)

    # top and bottom edges
    frame[y1:min(y1 + thickness, h), x1:x2] = color_arr
    frame[max(y2 - thickness, 0):y2, x1:x2] = color_arr
    # left and right edges
    frame[y1:y2, x1:min(x1 + thickness, w)] = color_arr
    frame[y1:y2, max(x2 - thickness, 0):x2] = color_arr


def _fill_rect_gpu(frame: cp.ndarray, x1: int, y1: int, x2: int, y2: int, color: tuple):
    h, w = frame.shape[:2]
    x1, x2 = max(0, min(x1, w)), max(0, min(x2, w))
    y1, y2 = max(0, min(y1, h)), max(0, min(y2, h))
    frame[y1:y2, x1:x2] = cp.array(color, dtype=frame.dtype)


def draw_detections(frame: cp.ndarray, detection_result) -> cp.ndarray:
    """Draws each detection box on the GPU frame. Label text still
    needs a CPU font rasterizer (no GPU text primitive in CuPy), so
    labels are composited via a small host-side patch — this is the
    one intentionally cheap CPU touch, boxes themselves stay on GPU."""
    import cv2

    for box in detection_result.boxes:
        color = _color_for(box.class_id)
        x1, y1, x2, y2 = int(box.x1), int(box.y1), int(box.x2), int(box.y2)
        _draw_rect_gpu(frame, x1, y1, x2, y2, color)

        label = f"{box.class_name} {box.confidence:.2f}"
        text_size, _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
        text_w, text_h = text_size
        label_y = max(y1 - text_h - 4, 0)
        _fill_rect_gpu(frame, x1, label_y, x1 + text_w + 4, label_y + text_h + 4, color)

        # Composite label text: render on a tiny host patch, upload, blend in.
        patch = np.zeros((text_h + 4, text_w + 4, 3), dtype=np.uint8)
        cv2.putText(patch, label, (2, text_h), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                    (0, 0, 0), 1, cv2.LINE_AA)
        patch_gpu = cp.asarray(patch)
        mask = cp.any(patch_gpu > 0, axis=-1, keepdims=True)
        region = frame[label_y:label_y + patch.shape[0], x1:x1 + patch.shape[1]]
        if region.shape[:2] == patch_gpu.shape[:2]:
            frame[label_y:label_y + patch.shape[0], x1:x1 + patch.shape[1]] = cp.where(
                mask, patch_gpu, region
            )

    return frame


def draw_hud(frame: cp.ndarray, fps: float, latency_ms: float, detection_count: int) -> cp.ndarray:
    import cv2

    text = f"{fps:.0f} FPS | {latency_ms:.0f}ms | {detection_count} objs"
    patch = np.zeros((20, 260, 3), dtype=np.uint8)
    cv2.putText(patch, text, (0, 15), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1, cv2.LINE_AA)
    patch_gpu = cp.asarray(patch)
    mask = cp.any(patch_gpu > 0, axis=-1, keepdims=True)
    region = frame[8:28, 8:268]
    if region.shape[:2] == patch_gpu.shape[:2]:
        frame[8:28, 8:268] = cp.where(mask, patch_gpu, region)

    return frame