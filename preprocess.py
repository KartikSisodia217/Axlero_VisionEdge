"""
preprocess.py — Role 4: GPU Pipeline Engineer

NOTE: Role 3's VisionEdgeInference.predict() does its own letterbox
resize, BGR->RGB, HWC->CHW, and normalization internally as part of a
single predict() call. This file does NOT duplicate that — doing so
would letterbox every frame twice for no benefit.

What this file actually does: a lightweight sanity check on frames
coming from Role 2's decoder before they're handed to Role 3, so a
malformed or corrupted frame fails fast with a clear error instead
of crashing deep inside TensorRT.
"""

import logging
import numpy as np

logger = logging.getLogger("visionedge.preprocess")


def validate_frame(frame: np.ndarray) -> bool:
    """
    Returns True if `frame` is a well-formed BGR uint8 frame Role 3's
    predict() can safely accept. Returns False (and logs why) otherwise.
    """
    if frame is None:
        logger.warning("Received None frame")
        return False
    if not isinstance(frame, np.ndarray):
        logger.warning("Frame is not a numpy array (got %s)", type(frame))
        return False
    if frame.ndim != 3 or frame.shape[2] != 3:
        logger.warning("Frame has unexpected shape %s, expected (H, W, 3)", frame.shape)
        return False
    if frame.dtype != np.uint8:
        logger.warning("Frame has unexpected dtype %s, expected uint8", frame.dtype)
        return False
    if frame.size == 0:
        logger.warning("Received empty frame")
        return False
    return True