"""
ProdSync API v1 Master Router
"""

from fastapi import APIRouter
from app.api.v1.auth import auth_router, orgs_router, users_router
from app.api.v1.catalogs import router as catalogs_router
from app.api.v1.processing import (
    activity_router,
    analytics_router,
    enrichment_router,
    exports_router,
    health_router,
    imports_router,
    notifications_router,
    processing_router,
    validation_router,
)
from app.api.v1.products import router as products_router
from app.api.v1.support import router as support_router

api_v1_router = APIRouter()

@api_v1_router.get("", tags=["Root"])
@api_v1_router.get("/", tags=["Root"])
async def api_v1_root():
    return {
        "status": "online",
        "api": "ProdSync AI v1",
        "endpoints": [
            "/products",
            "/catalogs",
            "/imports/file",
            "/imports/ocr-scan",
            "/processing",
            "/validation",
            "/enrichment",
            "/analytics",
            "/exports/unilog-delivery-format"
        ],
        "message": "ProdSync Enterprise API v1 is active and ready."
    }

# Register all v1 routes
api_v1_router.include_router(auth_router)
api_v1_router.include_router(users_router)
api_v1_router.include_router(orgs_router)
api_v1_router.include_router(catalogs_router)
api_v1_router.include_router(products_router)
api_v1_router.include_router(imports_router)
api_v1_router.include_router(processing_router)
api_v1_router.include_router(validation_router)
api_v1_router.include_router(enrichment_router)
api_v1_router.include_router(activity_router)
api_v1_router.include_router(analytics_router)
api_v1_router.include_router(notifications_router)
api_v1_router.include_router(exports_router)
api_v1_router.include_router(support_router)
api_v1_router.include_router(health_router)
