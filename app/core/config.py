from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Expense Tracker"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://127.0.0.1:5173",
        "http://localhost:5173"
    ]
    DATABASE_URL: str
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int


    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()