from queue import Queue, Full, Empty
from typing import Any, Optional


class FrameBuffer:
    """
    Thread-safe buffer for storing video frames.
    """

    def __init__(self, max_size: int = 30):
        self.queue = Queue(maxsize=max_size)

    def put(self, frame: Any) -> bool:
        """
        Add a frame to the buffer.

        If the buffer is full, remove the oldest frame
        and add the newest frame.
        """
        try:
            self.queue.put_nowait(frame)
            return True

        except Full:
            try:
                self.queue.get_nowait()
                self.queue.put_nowait(frame)
                return True

            except Empty:
                return False

    def get(self, timeout: Optional[float] = None):
        """
        Get the next frame from the buffer.
        """
        try:
            return self.queue.get(timeout=timeout)

        except Empty:
            return None

    def size(self) -> int:
        """
        Return the current number of frames.
        """
        return self.queue.qsize()

    def clear(self):
        """
        Remove all frames from the buffer.
        """
        while not self.queue.empty():
            try:
                self.queue.get_nowait()
            except Empty:
                break