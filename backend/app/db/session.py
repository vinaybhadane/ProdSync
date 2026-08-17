"""
Database Session Management & Engine Initialization — High-Throughput & Resilient
Supports PostgreSQL (asyncpg) with SQLite (aiosqlite + WAL + Memory-Mapped I/O)
"""

from typing import AsyncGenerator
from sqlalchemy import text
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from app.core.config import settings
from app.core.logging import logger
from app.db.base import Base

def normalize_database_url(raw_url: str) -> str:
    """Normalizes database URLs for Async SQLAlchemy compatibility across Render, Docker, and local."""
    if not raw_url:
        return "sqlite+aiosqlite:///./prodsync.db"
    url = raw_url.strip()
    # Render postgres default is 'postgres://...' or 'postgresql://...' without '+asyncpg'
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+asyncpg://", 1)
    elif url.startswith("postgresql://") and "+asyncpg" not in url:
        url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
    # Render / standard sqlite default is 'sqlite:///...' without '+aiosqlite'
    elif url.startswith("sqlite://") and "+aiosqlite" not in url:
        url = url.replace("sqlite://", "sqlite+aiosqlite://", 1)
    return url


normalized_db_url = normalize_database_url(settings.DATABASE_URL)

# Engine configuration
engine_kwargs = {
    "echo": False,
    "pool_pre_ping": True,
}

if "sqlite" in normalized_db_url:
    engine_kwargs["connect_args"] = {
        "check_same_thread": False,
        "timeout": 60,
    }
else:
    engine_kwargs["pool_size"] = settings.DB_POOL_SIZE
    engine_kwargs["max_overflow"] = settings.DB_MAX_OVERFLOW
    engine_kwargs["pool_timeout"] = settings.DB_TIMEOUT

engine: AsyncEngine = create_async_engine(normalized_db_url, **engine_kwargs)

async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI Dependency for database sessions with automatic commit/rollback."""
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    """Initializes tables and configures ultra-fast SQLite WAL & Memory-Mapped I/O."""
    async with engine.begin() as conn:
        if "sqlite" in normalized_db_url:
            # Enable WAL mode for non-blocking concurrent reads & writes
            await conn.exec_driver_sql("PRAGMA journal_mode = WAL;")
            # 60-second busy timeout to prevent transient locks
            await conn.exec_driver_sql("PRAGMA busy_timeout = 60000;")
            # Safe asynchronous disk syncing
            await conn.exec_driver_sql("PRAGMA synchronous = NORMAL;")
            # 256MB memory-mapped I/O for 10x read acceleration
            await conn.exec_driver_sql("PRAGMA mmap_size = 268435456;")
            # 64MB RAM page cache
            await conn.exec_driver_sql("PRAGMA cache_size = -64000;")
            # Store temporary tables and indices in RAM
            await conn.exec_driver_sql("PRAGMA temp_store = MEMORY;")
            # Enable foreign key constraint checking
            await conn.exec_driver_sql("PRAGMA foreign_keys = ON;")
            
        await conn.run_sync(Base.metadata.create_all)

        # Auto-migrate newly added columns for SQLite
        if "sqlite" in normalized_db_url:
            new_columns = [
                ("brand", "VARCHAR(255) DEFAULT 'Industrial Standard'"),
                ("series", "VARCHAR(128)"),
                ("classpath", "VARCHAR(512)"),
                ("unspsc", "VARCHAR(64)"),
                ("invoice_desc", "VARCHAR(64)"),
                ("mobile_desc", "VARCHAR(128)"),
                ("product_title", "VARCHAR(512)"),
                ("long_description", "TEXT"),
                ("bullet_features", "JSON DEFAULT '[]'"),
            ]
            for col_name, col_type in new_columns:
                try:
                    await conn.exec_driver_sql(f"ALTER TABLE products ADD COLUMN {col_name} {col_type};")
                except Exception:
                    pass  # Column already exists

        # Seed Default Organizations for Multi-Tenant Isolation
        try:
            await conn.exec_driver_sql("""
                INSERT OR IGNORE INTO organizations (id, name, slug, status, plan, created_at, updated_at)
                VALUES 
                ('org_unilog_enterprise', 'Unilog Industrial Hub', 'unilog-industrial-hub', 'active', 'enterprise', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
                ('org_industrial_corp_01', 'Industrial Corporation', 'industrial-corporation', 'active', 'enterprise', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
            """)
        except Exception:
            pass

    logger.info("Database schema initialized with SQLite WAL & 256MB Memory-Mapped I/O.")
