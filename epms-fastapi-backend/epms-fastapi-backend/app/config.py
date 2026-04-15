"""
config.py
Loads all environment variables via pydantic-settings.
Access anywhere: from app.config import settings
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://postgres:password@localhost:5432/epms_db"

    # OpenAI (optional)
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"

    # CORS
    frontend_url: str = "http://localhost:5173"

    # App metadata
    app_env: str = "development"
    app_title: str = "EPMS Backend API"
    app_version: str = "1.0.0"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
