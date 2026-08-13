"""
pyav_decoder.py — Role 2: Video Processing Engineer

Opens a video source (RTSP URL, or a local file for testing) using
PyAV and yields decoded frames as BGR uint8 NumPy arrays — matching
Role 4's FrameSource contract exactly (see pipeline.py's docstring
in Role 4 for the full spec).
"""

import logging
from typing import Iterator, Optional

import av
import numpy as np

logger = logging.getLogger("visionedge.pyav_decoder")


class PyAVDecoder:
    """Wraps a single video source (RTSP stream or file) and yields
    decoded frames one at a time as BGR uint8 arrays."""

    def __init__(self, source: str, stream_id: str, timeout: float = 5.0):
        """
        source: RTSP URL (e.g. 'rtsp://user:pass@192.168.1.10:554/stream1')
                or a local file path (used for testing without a real camera).
        stream_id: logical name for this camera, used only in log messages.
        timeout: connection timeout in seconds, passed to PyAV's RTSP options.
        """
        self.source = source
        self.stream_id = stream_id
        self.timeout = timeout
        self._container: Optional[av.container.InputContainer] = None

    def open(self) -> None:
        options = {}
        if self.source.startswith("rtsp://"):
            options = {
                "rtsp_transport": "tcp",   # more reliable than UDP for most cameras
                "stimeout": str(int(self.timeout * 1_000_000)),  # microseconds
            }
        logger.info("Opening video source for stream '%s': %s", self.stream_id, self.source)
        self._container = av.open(self.source, options=options)

    def close(self) -> None:
        if self._container is not None:
            self._container.close()
            self._container = None
            logger.info("Closed video source for stream '%s'", self.stream_id)

    def frames(self) -> Iterator[np.ndarray]:
        """Generator that yields decoded frames as BGR uint8 arrays.
        Stops (raises StopIteration via return) if the stream ends or errors."""
        if self._container is None:
            raise RuntimeError("Decoder not opened — call open() first")

        video_stream = self._container.streams.video[0]

        try:
            for frame in self._container.decode(video_stream):
                # PyAV decodes to RGB by default when we ask for it here;
                # Role 4's contract expects BGR (OpenCV convention).
                bgr_array = frame.to_ndarray(format="bgr24")
                yield bgr_array
        except av.error.EOFError:
            logger.info("Stream '%s' reached end of source", self.stream_id)
            return
        except Exception:
            logger.exception("Decode error on stream '%s'", self.stream_id)
            return

    def __enter__(self):
        self.open()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()