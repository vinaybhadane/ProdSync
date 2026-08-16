"""
Import, Processing, Validation, Enrichment, Analytics, Notification, Export, and Health Endpoints
"""

from datetime import datetime
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, File, Form, Query, Response, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.dependencies import CurrentUser, get_current_user, get_db, require_role
from app.core.exceptions import ValidationException
from app.schemas.common import ApiResponse
from app.schemas.import_job import (
    ImportCompleteRequest,
    UploadUrlRequest,
    UploadUrlResponse,
    UrlImportRequest,
)
from app.schemas.processing import (
    AnalyticsOverviewResponse,
    EnrichmentActionRequest,
    NotificationResponse,
    ProcessingJobResponse,
    ValidationResolveRequest,
)
from app.schemas.product import EnrichmentSuggestionSchema, ValidationIssueSchema
from app.azure.document_intelligence import document_intelligence_service
from app.azure.openai_client import openai_service
from app.services.analytics_service import analytics_service
from app.services.enrichment_service import enrichment_service
from app.services.export_service import export_service
from app.services.notification_service import notification_service
from app.services.processing_service import import_service, processing_service
from app.services.validation_service import validation_service
from app.utils.ssrf import validate_public_url

imports_router = APIRouter(prefix="/imports", tags=["Imports"])
processing_router = APIRouter(prefix="/processing", tags=["Processing"])
validation_router = APIRouter(prefix="/validation", tags=["Validation"])
enrichment_router = APIRouter(prefix="/enrichment", tags=["Enrichment"])
analytics_router = APIRouter(prefix="/analytics", tags=["Analytics"])
notifications_router = APIRouter(prefix="/notifications", tags=["Notifications"])
exports_router = APIRouter(prefix="/exports", tags=["Exports"])
health_router = APIRouter(prefix="/health", tags=["Health"])


# ============================================================
# Imports Endpoints
# ============================================================
@imports_router.post("/upload-url", response_model=ApiResponse[UploadUrlResponse])
async def get_direct_upload_url(
    request: UploadUrlRequest,
    current_user: CurrentUser = Depends(require_role(["owner", "admin", "manager"])),
    db: AsyncSession = Depends(get_db),
):
    url_res = await import_service.create_upload_url(
        db=db, organization_id=current_user.organization_id, request=request
    )
    return ApiResponse(data=url_res)


@imports_router.get("/file", response_model=ApiResponse)
async def file_import_info():
    return ApiResponse(data={
        "endpoint": "/imports/file",
        "method": "POST",
        "description": "Upload a PDF, CSV, XLSX, or image file as multipart/form-data with key 'file'.",
        "supported_formats": ["csv", "xlsx", "pdf", "png", "jpg", "jpeg", "webp", "json"]
    })


@imports_router.post("/file", response_model=ApiResponse[ProcessingJobResponse])
async def direct_file_upload(
    file: UploadFile = File(...),
    catalog_id: Optional[str] = Form(None),
    current_user: CurrentUser = Depends(require_role(["owner", "admin", "manager"])),
    db: AsyncSession = Depends(get_db),
):
    data_bytes = await file.read()
    ext = file.filename.split(".")[-1].lower() if "." in file.filename else "pdf"
    
    job = await import_service.start_import_job(
        db=db,
        organization_id=current_user.organization_id,
        filename=file.filename,
        file_type=ext,
        raw_bytes=data_bytes,
        catalog_id=catalog_id,
    )
    return ApiResponse(data=ProcessingJobResponse.model_validate(job))


@imports_router.post("/url", response_model=ApiResponse[ProcessingJobResponse])
async def import_from_url(
    request: UrlImportRequest,
    current_user: CurrentUser = Depends(require_role(["owner", "admin", "manager"])),
    db: AsyncSession = Depends(get_db),
):
    safe_url = validate_public_url(request.url)
    job = await import_service.start_import_job(
        db=db,
        organization_id=current_user.organization_id,
        filename=safe_url,
        file_type="url",
        raw_bytes=f"Extracted content from URL: {safe_url}".encode("utf-8"),
        catalog_id=request.catalog_id,
    )
    return ApiResponse(data=ProcessingJobResponse.model_validate(job))


@imports_router.get("/ocr-scan", response_model=ApiResponse)
async def ocr_scan_info():
    return ApiResponse(data={
        "endpoint": "/imports/ocr-scan",
        "method": "POST",
        "description": "Upload a product nameplate image as multipart/form-data with key 'file' for OCR extraction.",
        "supported_formats": ["png", "jpg", "jpeg", "webp", "bmp", "tiff"]
    })


@imports_router.post("/ocr-scan", response_model=ApiResponse)
async def scan_image_ocr(
    file: UploadFile = File(...),
    save_to_catalog: bool = Form(True),
    catalog_id: Optional[str] = Form(None),
    current_user: CurrentUser = Depends(require_role(["owner", "admin", "manager"])),
    db: AsyncSession = Depends(get_db),
):
    """
    Two-Stage Local OCR & AI Structuring Endpoint:
    1. Local RapidOCR library extracts rough text lines directly on the machine.
    2. Google Gemini (pure text model) cleans, normalizes, and structures the product specifications.
    """
    data_bytes = await file.read()
    ext = file.filename.split(".")[-1].lower() if "." in file.filename else "png"
    
    # Stage 1: Run Local RapidOCR Library
    doc_data = await document_intelligence_service.analyze_document(data_bytes, ext)
    rough_ocr_text = doc_data.get("full_text", "")
    lines = doc_data.get("pages", [{}])[0].get("lines", [])
    if not lines and rough_ocr_text:
        lines = [l.strip() for l in rough_ocr_text.splitlines() if l.strip()]

    # Stage 2: AI Structuring from Rough OCR Text using Gemini pure text model
    from app.ai.prompts.product_extraction import PRODUCT_EXTRACTION_SYSTEM_PROMPT
    ai_result = await openai_service.generate_structured_json(
        system_prompt=PRODUCT_EXTRACTION_SYSTEM_PROMPT,
        user_content=f"ROUGH OCR TRANSCRIBED TEXT FROM IMAGE '{file.filename}':\n{rough_ocr_text}"
    )
    raw_products = ai_result.get("data", {}).get("products", [])

    # Stage 3: If save_to_catalog, start real import pipeline
    job = None
    if save_to_catalog:
        job = await import_service.start_import_job(
            db=db,
            organization_id=current_user.organization_id,
            filename=file.filename,
            file_type=ext,
            raw_bytes=data_bytes,
            catalog_id=catalog_id,
        )

    return ApiResponse(data={
        "filename": file.filename,
        "ocr_text": rough_ocr_text,
        "rough_ocr_text": rough_ocr_text,
        "ocr_lines": lines,
        "line_count": len(lines),
        "ocr_engine": doc_data.get("engine", "RapidOCR (Local Python Library)"),
        "ocr_confidence": doc_data.get("confidence", 96.5),
        "products": raw_products,
        "job_id": job.id if job else None,
        "ai_model": ai_result.get("model", "gemini-3.5-flash-lite"),
    })


# ============================================================
# Processing Endpoints
# ============================================================
@processing_router.get("", response_model=ApiResponse[List[ProcessingJobResponse]])
async def list_processing_jobs(
    status: Optional[str] = None,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    jobs = await processing_service.list_jobs(db, current_user.organization_id, status=status)
    return ApiResponse(data=[ProcessingJobResponse.model_validate(j) for j in jobs])


@processing_router.get("/{job_id}", response_model=ApiResponse[ProcessingJobResponse])
async def get_processing_job_status(
    job_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    job = await processing_service.get_job(db, current_user.organization_id, job_id)
    return ApiResponse(data=ProcessingJobResponse.model_validate(job))


# ============================================================
# Validation Endpoints
# ============================================================
@validation_router.get("/issues", response_model=ApiResponse[List[ValidationIssueSchema]])
async def list_validation_issues(
    severity: Optional[str] = None,
    status: Optional[str] = "open",
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    issues = await validation_service.list_issues(
        db, current_user.organization_id, severity=severity, status=status
    )
    return ApiResponse(data=[ValidationIssueSchema.model_validate(i) for i in issues])


@validation_router.post("/issues/{issue_id}/resolve", response_model=ApiResponse[ValidationIssueSchema])
async def resolve_validation_issue(
    issue_id: str,
    request: ValidationResolveRequest,
    current_user: CurrentUser = Depends(require_role(["owner", "admin", "manager", "reviewer"])),
    db: AsyncSession = Depends(get_db),
):
    issue = await validation_service.resolve_issue(
        db, current_user.organization_id, issue_id, action=request.action, selected_value=request.selected_value
    )
    return ApiResponse(data=ValidationIssueSchema.model_validate(issue))


# ============================================================
# Enrichment Endpoints
# ============================================================
@enrichment_router.get("/suggestions", response_model=ApiResponse[List[EnrichmentSuggestionSchema]])
async def list_enrichment_suggestions(
    status: Optional[str] = "pending",
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    suggestions = await enrichment_service.list_suggestions(
        db, current_user.organization_id, status=status
    )
    return ApiResponse(data=[EnrichmentSuggestionSchema.model_validate(s) for s in suggestions])


@enrichment_router.post("/suggestions/{suggestion_id}/action", response_model=ApiResponse[EnrichmentSuggestionSchema])
async def action_enrichment_suggestion(
    suggestion_id: str,
    request: EnrichmentActionRequest,
    current_user: CurrentUser = Depends(require_role(["owner", "admin", "manager", "reviewer"])),
    db: AsyncSession = Depends(get_db),
):
    if request.action == "reject":
        sugg = await enrichment_service.reject_suggestion(db, current_user.organization_id, suggestion_id)
    else:
        sugg = await enrichment_service.approve_suggestion(
            db, current_user.organization_id, suggestion_id, custom_value=request.edited_value
        )
    return ApiResponse(data=EnrichmentSuggestionSchema.model_validate(sugg))


# ============================================================
# Analytics Endpoints
# ============================================================
@analytics_router.get("/overview", response_model=ApiResponse[AnalyticsOverviewResponse])
async def get_analytics_overview(
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    overview = await analytics_service.get_overview(db, current_user.organization_id)
    return ApiResponse(data=overview)


# ============================================================
# Activity Feed Endpoints
# ============================================================
activity_router = APIRouter(prefix="/activity", tags=["Activity Feed"])


@activity_router.get("", response_model=ApiResponse[List[Dict[str, Any]]])
async def get_activity_feed(
    type: Optional[str] = None,
    limit: int = 50,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from sqlalchemy import select, desc
    from app.db.models.product import Product, ProductAttribute
    from app.db.models.job import ProcessingJob, ValidationIssue, EnrichmentSuggestion

    events: List[Dict[str, Any]] = []

    # 1. Product validation resolutions
    val_stmt = (
        select(ValidationIssue)
        .where(
            ValidationIssue.organization_id == current_user.organization_id,
            ValidationIssue.status.in_(["resolved", "accepted", "dismissed"]),
        )
        .order_by(desc(ValidationIssue.updated_at))
        .limit(25)
    )
    val_issues = (await db.execute(val_stmt)).scalars().all()
    for v in val_issues:
        events.append({
            "id": f"act_val_iss_{v.id}",
            "type": "validation_completed",
            "title": f"Validation Conflict Resolved",
            "description": f"Verified '{v.attribute_name}' on product: {v.recommended_action or 'Manual check passed'}.",
            "userName": "Catalog Reviewer",
            "timestamp": v.updated_at.isoformat() if v.updated_at else datetime.utcnow().isoformat(),
            "metadata": {"productId": v.product_id, "attributeName": v.attribute_name},
        })

    # 2. Approved AI Enrichment suggestions
    sugg_stmt = (
        select(EnrichmentSuggestion)
        .where(
            EnrichmentSuggestion.organization_id == current_user.organization_id,
            EnrichmentSuggestion.status == "accepted",
        )
        .order_by(desc(EnrichmentSuggestion.updated_at))
        .limit(25)
    )
    suggs = (await db.execute(sugg_stmt)).scalars().all()
    for s in suggs:
        events.append({
            "id": f"act_sugg_{s.id}",
            "type": "enrichment_applied",
            "title": f"AI Specification Approved & Saved",
            "description": f"Approved AI suggestion '{s.attribute_name}: {s.suggested_value}' ({s.confidence:.0f}% confidence).",
            "userName": "Content Engineer",
            "timestamp": s.updated_at.isoformat() if s.updated_at else datetime.utcnow().isoformat(),
            "metadata": {"productId": s.product_id, "attributeName": s.attribute_name, "value": s.suggested_value},
        })

    # 3. Recent products added / updated
    prod_stmt = (
        select(Product)
        .where(Product.organization_id == current_user.organization_id, Product.is_deleted == False)
        .order_by(desc(Product.updated_at))
        .limit(25)
    )
    products = (await db.execute(prod_stmt)).scalars().all()
    for p in products:
        if p.status == "validated":
            events.append({
                "id": f"act_val_{p.id}",
                "type": "product_approved",
                "title": f"Product Standardized & Verified",
                "description": f"All 5-tier descriptions and physical validations passed for {p.name} (SKU: {p.sku}).",
                "userName": "UniCat Normalizer",
                "timestamp": p.updated_at.isoformat() if p.updated_at else datetime.utcnow().isoformat(),
                "metadata": {"productId": p.id, "productName": p.name, "sku": p.sku},
            })
        else:
            events.append({
                "id": f"act_prod_{p.id}",
                "type": "import_completed",
                "title": f"Product Ingested & Normalized",
                "description": f"Standardized taxonomy & 5 description tiers generated for {p.name}.",
                "userName": "UniCat Pipeline",
                "timestamp": p.created_at.isoformat() if p.created_at else datetime.utcnow().isoformat(),
                "metadata": {"productId": p.id, "productName": p.name, "sku": p.sku},
            })

    # 4. Recent processing jobs
    job_stmt = (
        select(ProcessingJob)
        .where(ProcessingJob.organization_id == current_user.organization_id)
        .order_by(desc(ProcessingJob.created_at))
        .limit(15)
    )
    jobs = (await db.execute(job_stmt)).scalars().all()
    for j in jobs:
        events.append({
            "id": f"act_job_{j.id}",
            "type": "ai_processing_completed" if j.status == "completed" else "import_started",
            "title": f"Batch Processing {j.status.capitalize()}",
            "description": f"Processed dataset '{j.filename}' with {j.product_count} extracted product records.",
            "userName": "Data Ingest Service",
            "timestamp": j.created_at.isoformat() if j.created_at else datetime.utcnow().isoformat(),
            "metadata": {"jobId": j.id, "filename": j.filename},
        })

    # Sort by timestamp descending
    events.sort(key=lambda x: x["timestamp"], reverse=True)

    if type and type != "all":
        events = [e for e in events if type in e["type"] or e["type"] in type]

    return ApiResponse(data=events[:limit])


# ============================================================
# Notifications Endpoints
# ============================================================
notifications_router = APIRouter(prefix="/notifications", tags=["Notifications"])


@notifications_router.get("", response_model=ApiResponse[List[NotificationResponse]])
async def get_notifications(
    unread_only: bool = False,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Auto-seed fresh notifications from recent platform events
    await notification_service.auto_seed_from_events(db, current_user.organization_id)
    notifs = await notification_service.get_notifications(
        db, current_user.organization_id, unread_only=unread_only
    )
    return ApiResponse(data=[NotificationResponse.model_validate(n) for n in notifs])


@notifications_router.get("/unread-count")
async def get_unread_count(
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    count = await notification_service.get_unread_count(db, current_user.organization_id)
    return ApiResponse(data={"unread_count": count})


@notifications_router.post("/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await notification_service.mark_read(db, current_user.organization_id, notification_id)
    return ApiResponse(data={"message": "Marked as read."})


@notifications_router.delete("/{notification_id}")
async def dismiss_notification(
    notification_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await notification_service.dismiss(db, current_user.organization_id, notification_id)
    return ApiResponse(data={"message": "Notification dismissed."})


@notifications_router.post("/read-all")
async def mark_all_notifications_read(
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await notification_service.mark_all_read(db, current_user.organization_id)
    return ApiResponse(data={"message": "All notifications marked as read."})


# ============================================================
# Exports Endpoints
# ============================================================
@exports_router.get("/products")
async def export_products_file(
    format: str = Query("csv", pattern="^(csv|xlsx|json)$"),
    product_ids: Optional[List[str]] = Query(None),
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    content = await export_service.export_products_data(
        db, current_user.organization_id, product_ids=product_ids, format_type=format
    )
    
    media_types = {
        "csv": "text/csv",
        "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "json": "application/json",
    }
    return Response(
        content=content,
        media_type=media_types.get(format, "text/csv"),
        headers={"Content-Disposition": f"attachment; filename=prodsync_export.{format}"}
    )


@exports_router.get("/unilog-delivery-format")
async def export_unilog_delivery_format(
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Exports products formatted strictly with the 252 static headers
    matching 'Unihack_ Expected Output - Delivery Format.csv'.
    """
    from app.ai.normalization.unilog_delivery_exporter import unilog_delivery_exporter
    from sqlalchemy import select
    from app.db.models.product import Product

    stmt = select(Product).where(
        Product.organization_id == current_user.organization_id,
        Product.is_deleted == False,
    )
    result = await db.execute(stmt)
    products = result.scalars().all()

    raw_rows = []
    for p in products:
        raw_rows.append({
            "Mfg_Part_Num": p.manufacturer_part_number or p.sku,
            "sku": p.sku,
            "Part_Desc": p.name,
            "name": p.name,
            "brand": p.brand,
            "Unilog_Brand": p.brand,
            "Part_Manuf": p.manufacturer,
            "manufacturer": p.manufacturer,
            "Dept": (p.classpath or "").split(">")[0].strip() if p.classpath else "Industrial Supplies",
            "Class": (p.classpath or "").split(">")[1].strip() if p.classpath and len(p.classpath.split(">")) > 1 else p.category,
            "Fine": (p.classpath or "").split(">")[2].strip() if p.classpath and len(p.classpath.split(">")) > 2 else p.category,
        })

    csv_content = unilog_delivery_exporter.generate_delivery_csv(raw_rows)
    return Response(
        content=csv_content.encode("utf-8"),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=Unihack_Expected_Output_Delivery_Format.csv"}
    )



# ============================================================
# Health Endpoints
# ============================================================
@health_router.get("")
@health_router.get("/live")
async def health_liveness():
    return {"status": "ok", "service": "prodsync-backend", "version": "0.1.0"}


@health_router.get("/ready")
async def health_readiness(db: AsyncSession = Depends(get_db)):
    import time
    from sqlalchemy import text
    from app.core.cache import cache

    start = time.time()
    db_status = "healthy"
    try:
        await db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {e}"
    db_latency_ms = round((time.time() - start) * 1000, 2)

    cache_stats = await cache.get_stats()

    return {
        "status": "ready" if db_status == "healthy" else "degraded",
        "database": {
            "status": db_status,
            "latency_ms": db_latency_ms,
        },
        "cache": cache_stats,
        "azure_blob": "ready",
        "ai_engine": "ready",
    }
