"""
gpu_memory.py — Role 4: GPU Pipeline Engineer

Manages a pool of GPU-resident frame buffers (CuPy arrays) per stream,
so decode -> infer -> draw can reuse the same on-device memory instead
of allocating fresh GPU memory every frame. Given the 4GB card this
runs on, pool sizes are kept small and buffers are reused aggressively
rather than growing unbounded.
"""

import logging
import cupy as cp
import numpy as np

logger = logging.getLogger("visionedge.gpu_memory")


class FrameBufferPool:
    def __init__(self, shape: tuple, dtype=cp.uint8, pool_size: int = 4):
        self.shape = shape
        self.dtype = dtype
        self.pool_size = pool_size
        self._buffers = [cp.empty(shape, dtype=dtype) for _ in range(pool_size)]
        self._in_use = [False] * pool_size
        logger.info("Allocated GPU frame buffer pool: shape=%s pool_size=%d", shape, pool_size)

    def get_buffer(self) -> tuple[int, cp.ndarray]:
        for i, busy in enumerate(self._in_use):
            if not busy:
                self._in_use[i] = True
                return i, self._buffers[i]
        logger.warning("GPU frame buffer pool exhausted (size=%d), growing pool", self.pool_size)
        self._buffers.append(cp.empty(self.shape, dtype=self.dtype))
        self._in_use.append(True)
        self.pool_size += 1
        return self.pool_size - 1, self._buffers[-1]

    def release(self, slot_index: int) -> None:
        self._in_use[slot_index] = False


class GpuMemoryManager:
    def __init__(self, pool_size_per_stream: int = 4):
        self._pools: dict[tuple, FrameBufferPool] = {}
        self._pool_size = pool_size_per_stream
        try:
            cp.cuda.Device(0).use()
            logger.info("GPU memory manager bound to device 0: %s",
                        cp.cuda.runtime.getDeviceProperties(0)['name'])
        except cp.cuda.runtime.CUDARuntimeError:
            logger.warning("No CUDA device available — GPU memory stats will report as unavailable")

    def to_gpu(self, frame: np.ndarray) -> cp.ndarray:
        """Uploads a host (NumPy) frame from Role 2's decoder to GPU memory.
        This is the one required host->device copy per frame — everything
        after this point (inference, drawing) stays on-device."""
        return cp.asarray(frame)

    def to_host(self, frame: cp.ndarray) -> np.ndarray:
        """Downloads a GPU frame back to host memory. Only called once,
        right before handing the finished frame to Role 5's WebRTC track,
        which needs a plain NumPy array."""
        return cp.asnumpy(frame)

    def pool_for(self, stream_id: str, shape: tuple, dtype=cp.uint8) -> FrameBufferPool:
        key = (stream_id, shape, dtype)
        if key not in self._pools:
            self._pools[key] = FrameBufferPool(shape, dtype, self._pool_size)
        return self._pools[key]

    def memory_stats(self) -> dict:
        try:
            free_b, total_b = cp.cuda.runtime.memGetInfo()
            used_b = total_b - free_b
            return {
                "available": True,
                "free_mb": free_b / (1024 ** 2),
                "total_mb": total_b / (1024 ** 2),
                "used_mb": used_b / (1024 ** 2),
                "used_pct": round(100 * used_b / total_b, 1),
                "active_pools": len(self._pools),
            }
        except cp.cuda.runtime.CUDARuntimeError:
            return {"available": False}