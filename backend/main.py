from fastapi import FastAPI

from backend.api.v1.health import router as health_router

app = FastAPI(
    title="VisionEdge API",
    description="Hardware Accelerated Video Pipeline Backend",
    version="1.0.0"
)

app.include_router(health_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to VisionEdge API"
    }