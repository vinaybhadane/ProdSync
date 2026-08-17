"""
ProdSync Core Configuration
Managed using Pydantic Settings v2
"""

import json
from typing import List, Optional
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # Application
    APP_NAME: str = "ProdSync"
    APP_ENV: str = "development"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    SECRET_KEY: str = "prodsync-enterprise-secret-key-replace-in-production"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://prodsync.ai",
        "https://www.prodsync.ai"
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v):
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, str) and v.startswith("["):
            return json.loads(v)
        return v

    # Firebase Authentication
    FIREBASE_PROJECT_ID: str = "prodsync06"
    FIREBASE_SERVICE_ACCOUNT_JSON: Optional[str] = None
    FIREBASE_CREDENTIALS_PATH: Optional[str] = None

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./prodsync.db"
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 10
    DB_TIMEOUT: int = 30

    # Azure Blob Storage
    AZURE_STORAGE_ACCOUNT_NAME: Optional[str] = None
    AZURE_STORAGE_CONTAINER_RAW: str = "prod-sync-raw"
    AZURE_STORAGE_CONTAINER_PROCESSED: str = "prod-sync-processed"
    AZURE_STORAGE_CONTAINER_EXPORTS: str = "prod-sync-exports"
    AZURE_STORAGE_CONNECTION_STRING: Optional[str] = None

    # LLM Services (Groq, Gemini, Azure OpenAI, OpenAI)
    GROQ_API_KEY: Optional[str] = None
    GROQ_MODEL: str = "openai/gpt-oss-120b"
    GROQ_FAST_MODEL: str = "openai/gpt-oss-20b"
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-3.5-flash-lite"
    OPENAI_API_KEY: Optional[str] = None
    AZURE_OPENAI_ENDPOINT: Optional[str] = None
    AZURE_OPENAI_API_KEY: Optional[str] = None
    AZURE_OPENAI_DEPLOYMENT_NAME: str = "gpt-4o"
    AZURE_OPENAI_API_VERSION: str = "2024-08-01-preview"

    # Azure AI Document Intelligence
    AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT: Optional[str] = None
    AZURE_DOCUMENT_INTELLIGENCE_API_KEY: Optional[str] = None

    # Azure Service Bus
    AZURE_SERVICE_BUS_NAMESPACE: Optional[str] = None
    AZURE_SERVICE_BUS_CONNECTION_STRING: Optional[str] = None
    AZURE_SERVICE_BUS_QUEUE_PROCESSING: str = "document-processing"

    # Telemetry
    APPLICATIONINSIGHTS_CONNECTION_STRING: Optional[str] = None

    # Security Limits
    RATE_LIMIT_PER_MINUTE: int = 120
    MAX_UPLOAD_SIZE_MB: int = 25
    MAX_BULK_ITEMS: int = 500
    PAGINATION_DEFAULT_PAGE_SIZE: int = 20
    PAGINATION_MAX_PAGE_SIZE: int = 100


settings = Settings()
