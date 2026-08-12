import av
import numpy as np
from typing import Generator, Optional


class PyAVDecoder:
    """
    Video decoder using PyAV and FFmpeg.

    Responsibilities:
    - Open a video file or RTSP stream
    - Decode compressed video
    - Extract individual video frames
    - Convert frames to NumPy arrays
    - Close the video source safely
    """

    def __init__(self, source: str):
        self.source = source
        self.container: Optional[av.container.InputContainer] = None
        self.is_open = False

    def open(self) -> None:
        """
        Open the video source.

        The source can be:
        - A local video file
        - An RTSP URL
        - Another FFmpeg-supported video source
        """

        if self.is_open:
            return

        try:
            self.container = av.open(self.source)
            self.is_open = True

            print(f"Video source opened: {self.source}")

        except Exception as exc:
            self.container = None
            self.is_open = False

            raise RuntimeError(
                f"Failed to open video source: {self.source}"
            ) from exc

    def frames(self) -> Generator[np.ndarray, None, None]:
        """
        Decode the video and yield frames one at a time.

        Each frame is returned as a NumPy array in BGR format,
        which can be used by OpenCV and other computer vision modules.
        """

        if not self.is_open:
            self.open()

        if self.container is None:
            raise RuntimeError("Video container is not available")

        try:
            for frame in self.container.decode(video=0):

                # Convert PyAV frame to NumPy BGR image
                image = frame.to_ndarray(format="bgr24")

                yield image

        except Exception as exc:

            raise RuntimeError(
                f"Error while decoding video source: {self.source}"
            ) from exc

    def get_frames(self, max_frames: Optional[int] = None):
        """
        Read a limited number of frames.

        This is useful for testing and debugging.
        """

        count = 0

        for frame in self.frames():

            yield frame

            count += 1

            if max_frames is not None and count >= max_frames:
                break

    def close(self) -> None:
        """
        Close the video source and release resources.
        """

        if self.container is not None:

            try:
                self.container.close()

            finally:
                self.container = None
                self.is_open = False

    def __enter__(self):
        """
        Support usage with Python's 'with' statement.
        """

        self.open()
        return self

    def _exit_(self, exc_type, exc_value, traceback):
        """
        Automatically close the video source.
        """

        self.close()