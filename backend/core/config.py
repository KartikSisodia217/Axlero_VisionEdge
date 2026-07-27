from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    project_name: str = "VisionEdge"
    project_version: str = "1.0.0"
    api_version: str = "v1"


settings = Settings()