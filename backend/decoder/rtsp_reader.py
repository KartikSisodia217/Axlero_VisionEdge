import av
import time
from typing import Optional


class RTSPReader:
    """
    RTSP video stream reader.

    Responsibilities:
    - Connect to an RTSP stream
    - Read video frames
    - Handle connection errors
    - Retry connection when the stream is unavailable
    - Close the stream safely
    """

    def __init__(
        self,
        rtsp_url: str,
        reconnect_delay: float = 2.0,
        max_retries: int = 5,
    ):
        self.rtsp_url = rtsp_url
        self.reconnect_delay = reconnect_delay
        self.max_retries = max_retries

        self.container: Optional[av.container.InputContainer] = None
        self.connected = False

    def connect(self) -> bool:
        """
        Connect to the RTSP stream.
        """

        try:
            self.container = av.open(
                self.rtsp_url,
                options={
                    "rtsp_transport": "tcp",
                },
            )

            self.connected = True

            print("RTSP stream connected")

            return True

        except Exception as exc:

            self.container = None
            self.connected = False

            print(f"RTSP connection failed: {exc}")

            return False

    def read_frames(self):
        """
        Read frames continuously from the RTSP stream.
        """

        retry_count = 0

        while retry_count < self.max_retries:

            if not self.connected:

                if not self.connect():

                    retry_count += 1

                    print(
                        f"Retrying RTSP connection "
                        f"({retry_count}/{self.max_retries})"
                    )

                    time.sleep(self.reconnect_delay)

                    continue

            try:

                for frame in self.container.decode(video=0):

                    yield frame

                retry_count += 1
                self.connected = False

            except Exception as exc:

                print(f"RTSP read error: {exc}")

                self.connected = False
                retry_count += 1

                self.close()

                time.sleep(self.reconnect_delay)

    def close(self):
        """
        Close the RTSP connection.
        """

        if self.container is not None:

            try:
                self.container.close()

            except Exception:
                pass

            finally:
                self.container = None
                self.connected = False

    def is_connected(self) -> bool:
        """
        Return the current connection status.
        """

        return self.connected