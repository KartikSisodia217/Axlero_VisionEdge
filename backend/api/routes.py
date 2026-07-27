from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def root():
    return {
        "message": "Welcome to VisionEdge API"
    }


@router.get("/health")
def health():
    return {
        "status": "healthy",
        "project": "VisionEdge",
        "version": "1.0.0"
    }