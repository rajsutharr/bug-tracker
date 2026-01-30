from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # This will look for DATABASE_URL in your .env file
    # Defaulting to SQLite for now to get you running immediately
    DATABASE_URL: str = "sqlite:///./sql_app.db"
    SECRET_KEY: str = "79d094ba4c2079f40a1b643a6774966601"
    PROJECT_NAME: str = "Bug Tracker"

    class Config:
        case_sensitive = True
        env_file = ".env"

# This is the line your error is looking for!
settings = Settings()