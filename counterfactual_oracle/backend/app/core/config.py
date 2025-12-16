"""Application configuration from environment variables"""
from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # API Keys (optional - will fail at runtime if missing when needed)
    deepseek_api_key: str = ""
    gemini_api_key: str = ""
    landingai_api_key: str = ""
    
    # Database
    database_url: str = "sqlite:///./counterfactual.db"
    
    # Server
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000
    
    # CORS - read from environment or use defaults
    cors_origins: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://*.railway.app"
    ]
    
    # Optional: Redis for background jobs
    redis_url: str | None = None
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Get CORS origins, checking for environment override"""
        env_origins = os.getenv("CORS_ORIGINS", "")
        if env_origins:
            return [origin.strip() for origin in env_origins.split(",")]
        return self.cors_origins


settings = Settings()


