"""
rtsp_reader.py — Role 2: Video Processing Engineer

Runs a PyAVDecoder on a background thread for one camera stream,
continuously writing decoded frames into a FrameBuffer. Automatically
reconnects with backoff if the source drops or fails to open — real
RTSP cameras disconnect often (network blips, camera reboots), so
this is not an edge case, it's expected steady-state behavior.
"""

import logging
import threading
import time

from frame_buffer import FrameBuffer
from pyav_decoder import PyAVDecoder

logger = logging.getLogger("visionedge.rtsp_reader")


class StreamReader:
    def __init__(self, stream_id: str, source: str, buffer: FrameBuffer,
                 reconnect_delay: float = 2.0, max_reconnect_delay: float = 30.0):
        self.stream_id = stream_id
        self.source = source
        self.buffer = buffer
        self.reconnect_delay = reconnect_delay
        self.max_reconnect_delay = max_reconnect_delay

        self._stop_event = threading.Event()
        self._thread: threading.Thread | None = None

    def start(self) -> None:
        self._thread = threading.Thread(target=self._run, name=f"reader-{self.stream_id}", daemon=True)
        self._thread.start()
        logger.info("Started reader thread for stream '%s'", self.stream_id)

    def stop(self) -> None:
        self._stop_event.set()
        if self._thread:
            self._thread.join(timeout=5)
        logger.info("Stopped reader thread for stream '%s'", self.stream_id)

    def _run(self) -> None:
        delay = self.reconnect_delay
        while not self._stop_event.is_set():
            try:
                with PyAVDecoder(self.source, self.stream_id) as decoder:
                    delay = self.reconnect_delay  # reset backoff after a successful connect
                    for frame in decoder.frames():
                        if self._stop_event.is_set():
                            break
                        self.buffer.write(frame)
            except Exception:
                logger.exception(
                    "Stream '%s' failed, reconnecting in %.1fs", self.stream_id, delay
                )

            if self._stop_event.is_set():
                break

            time.sleep(delay)
            delay = min(delay * 1.5, self.max_reconnect_delay)  # exponential backoff, capped