"""
Configuration settings for the Project Tracker application
"""
from pathlib import Path
import os


class Settings:
    """Application settings"""

    def __init__(self):
        # Application Info
        self.app_name: str = "Project Tracker"
        self.app_version: str = "2.0.0"

        # Server Settings
        self.host: str = os.getenv("HOST", "127.0.0.1")
        self.port: int = int(os.getenv("PORT", "8000"))

        # Database Settings
        self.database_url: str = os.getenv(
            "DATABASE_URL", "sqlite+aiosqlite:///./data/project_tracking.db"
        )
        self.database_path: Path = Path(
            os.getenv("DATABASE_PATH", "./data/project_tracking.db")
        )

        # Backup Settings
        self.backup_base_path: Path = Path(
            os.getenv("BACKUP_BASE_PATH", "./data/backups")
        )
        self.backup_daily_retention_days: int = int(
            os.getenv("BACKUP_DAILY_RETENTION_DAYS", "30")
        )
        self.backup_weekly_retention_weeks: int = int(
            os.getenv("BACKUP_WEEKLY_RETENTION_WEEKS", "12")
        )

        # Frontend Settings
        self.frontend_build_path: Path = Path(
            os.getenv("FRONTEND_BUILD_PATH", "./frontend/dist")
        )

        # CORS Settings
        self.cors_origins: list = [
            "http://localhost:8000",
            "http://127.0.0.1:8000",
            "http://localhost:5173",  # Vite dev server
        ]


# Create global settings instance
settings = Settings()
