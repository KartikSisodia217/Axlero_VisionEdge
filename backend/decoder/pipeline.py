from .pyav_decoder import PyAVDecoder
from .frame_buffer import FrameBuffer


class VideoPipeline:
    """
    Connects video decoding with the frame buffer.
    """

    def _init_(self, video_source: str, buffer_size: int = 30):
        self.video_source = video_source
        self.decoder = PyAVDecoder(video_source)
        self.buffer = FrameBuffer(buffer_size)

    def start(self):
        """
        Decode frames and put them into the buffer.
        """

        for frame in self.decoder.frames():
            self.buffer.put(frame)

    def get_frame(self):
        """
        Get one frame from the buffer.
        """

        return self.buffer.get(timeout=1)

    def buffer_size(self):
        """
        Return current buffer size.
        """

        return self.buffer.size()

    def stop(self):
        """
        Stop the pipeline and close the decoder.
        """

        self.decoder.close()