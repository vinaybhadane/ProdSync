"""
ProdSync — Production-Ready Azure Backend
FastAPI Main Application Entrypoint with High-Throughput GZip Compression & Caching
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from app.api.router import api_v1_router
from app.core.cache import cache
from app.core.config import settings
from app.core.exceptions import ProdSyncException, prodsync_exception_handler
from app.core.firebase import initialize_firebase
from app.core.logging import logger
from app.core.middleware import (
    RateLimitMiddleware,
    RequestIDMiddleware,
    SecurityHeadersMiddleware,
)
from app.core.telemetry import init_telemetry
from app.db.session import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application Startup and Shutdown Lifecycle."""
    logger.info(f"Starting {settings.APP_NAME} Backend ({settings.APP_ENV})...")
    
    # 1. Initialize OpenTelemetry & Application Insights
    init_telemetry(app)
    
    # 2. Initialize Database Schema & Performance PRAGMAs
    try:
        await init_db()
    except Exception as e:
        logger.warning(f"Database initialization notice: {e}")
        
    # 3. Initialize Firebase Admin SDK
    initialize_firebase()
    
    logger.info(f"{settings.APP_NAME} Backend ready on port {settings.PORT}!")
    yield
    
    # 4. Graceful Shutdown
    logger.info(f"Clearing cache and shutting down {settings.APP_NAME} Backend...")
    await cache.clear()


app = FastAPI(
    title="ProdSync API",
    version="0.1.0",
    description="Production-Ready Azure Backend for ProdSync AI Product Intelligence Platform",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    openapi_url="/openapi.json" if settings.DEBUG else None,
    lifespan=lifespan,
)

# 1. Inner Middlewares
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitMiddleware, max_requests=settings.RATE_LIMIT_PER_MINUTE)
app.add_middleware(RequestIDMiddleware)

# 2. CORS Middleware (Outermost layer — intercepts and handles all OPTIONS preflights first)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_origin_regex=r"^https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# 4. Custom Exception Handlers
app.add_exception_handler(ProdSyncException, prodsync_exception_handler)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    request_id = getattr(request.state, "request_id", "req-unknown")
    logger.error(f"Unhandled error on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected server error occurred. Please try again later.",
                "request_id": request_id,
            }
        },
        headers={"X-Request-ID": request_id},
    )


# 5. Register API Routers
app.include_router(api_v1_router, prefix=settings.API_V1_STR)


# 6. Top-level Root & Health routes
@app.get("/", tags=["Root"])
async def root():
    cache_stats = await cache.get_stats()
    return {
        "service": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "version": "0.1.0",
        "docs": "/docs" if settings.DEBUG else "restricted",
        "cache": cache_stats,
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "prodsync-backend", "version": "0.1.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
