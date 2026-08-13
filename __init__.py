"""
Role 2: Video Processing Engineer — public interface.

CameraManager.get_frame(stream_id, timeout) matches Role 4's
FrameSource Protocol exactly (see pipeline.py's docstring in Role 4):
    - Returns a BGR uint8 NumPy array, shape (H, W, 3)
    - Returns None if no frame is ready within `timeout` seconds
"""

import logging
import time
from typing import Optional

import numpy as np

from frame_buffer import FrameBufferRegistry
from rtsp_reader import StreamReader

logger = logging.getLogger("visionedge.camera_manager")

__all__ = ["CameraManager"]


class CameraManager:
    def __init__(self):
        self._registry = FrameBufferRegistry()
        self._readers: dict[str, StreamReader] = {}

    def add_camera(self, stream_id: str, source: str) -> None:
        """source: RTSP URL, or a local file path for testing."""
        if stream_id in self._readers:
            logger.warning("Camera '%s' already added, ignoring", stream_id)
            return
        buffer = self._registry.get_or_create(stream_id)
        reader = StreamReader(stream_id, source, buffer)
        self._readers[stream_id] = reader
        reader.start()

    def remove_camera(self, stream_id: str) -> None:
        reader = self._readers.pop(stream_id, None)
        if reader:
            reader.stop()
        self._registry.remove(stream_id)

    def get_frame(self, stream_id: str, timeout: float = 1.0) -> Optional[np.ndarray]:
        """Matches Role 4's FrameSource Protocol. Polls briefly for a
        frame to appear (useful right after add_camera, before the
        first frame has decoded yet) rather than returning None
        immediately just because the camera is still connecting."""
        buffer = self._registry.get(stream_id)
        if buffer is None:
            logger.warning("get_frame called for unknown stream '%s'", stream_id)
            return None

        deadline = time.monotonic() + timeout
        while time.monotonic() < deadline:
            frame = buffer.read()
            if frame is not None:
                return frame
            time.sleep(0.02)
        return None

    def is_live(self, stream_id: str) -> bool:
        buffer = self._registry.get(stream_id)
        return buffer.is_live if buffer else False

    def stop_all(self) -> None:
        for stream_id in list(self._readers):
            self.remove_camera(stream_id)