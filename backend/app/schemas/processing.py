"""
Import, Processing, Validation, Enrichment, Analytics, Notification, and Search Schemas
"""

from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field, HttpUrl


# ============================================================
# Import Schemas
# ============================================================
class UploadUrlRequest(BaseModel):
    filename: str
    file_type: str  # pdf, csv, xlsx
    file_size_bytes: int
    catalog_id: Optional[str] = None


class UploadUrlResponse(BaseModel):
    upload_url: str
    blob_path: str
    import_id: str
    expires_in_seconds: int = 3600


class ImportCompleteRequest(BaseModel):
    blob_path: str
    filename: str
    file_type: str
    catalog_id: Optional[str] = None


class UrlImportRequest(BaseModel):
    url: str
    catalog_id: Optional[str] = None


class QuickEnrichRequest(BaseModel):
    manufacturer: str
    mpn: str
    part_desc: Optional[str] = None
    catalog_id: Optional[str] = None


class BatchPreviewResponse(BaseModel):
    filename: str
    total_rows: int
    headers: List[str]
    sample_records: List[Dict[str, Any]]
    suggested_mappings: Dict[str, str]


class BatchProcessRequest(BaseModel):
    filename: str
    records: List[Dict[str, Any]]
    column_mapping: Optional[Dict[str, str]] = None
    catalog_id: Optional[str] = None


# ============================================================
# Processing Schemas
# ============================================================
class ProcessingStageSchema(BaseModel):
    id: str
    label: str
    status: str  # pending, active, completed, failed


class ProcessingJobResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    filename: str
    source_type: str
    status: str  # pending, processing, completed, failed, ready_for_review
    progress: int = 0
    current_stage: str = "Queued"
    product_count: int = 0
    total_products: int = 0
    processed_products: int = 0
    failed_products: int = 0
    attributes_extracted: int = 0
    validation_issues: int = 0
    stages: List[Dict[str, Any]] = Field(default_factory=list)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    created_at: datetime


# ============================================================
# Validation Schemas
# ============================================================
class ValidationResolveRequest(BaseModel):
    action: str  # accept, reject, resolve
    selected_value: Optional[str] = None
    resolution_notes: Optional[str] = None


# ============================================================
# Enrichment Schemas
# ============================================================
class EnrichmentActionRequest(BaseModel):
    action: str  # approve, reject, edit
    edited_value: Optional[str] = None


# ============================================================
# Analytics Schemas
# ============================================================
class TimeSeriesPoint(BaseModel):
    date: str
    value: float
    label: Optional[str] = None


class DistributionPoint(BaseModel):
    name: str
    value: float
    color: Optional[str] = None


class AnalyticsOverviewResponse(BaseModel):
    total_products: int
    ai_processed: int
    validated: int
    needs_review: int
    enrichment_opportunities: int
    data_quality_score: float
    processing_volume: List[TimeSeriesPoint] = Field(default_factory=list)
    quality_trend: List[TimeSeriesPoint] = Field(default_factory=list)
    validation_distribution: List[DistributionPoint] = Field(default_factory=list)
    completeness_distribution: List[DistributionPoint] = Field(default_factory=list)
    enrichment_rate: List[TimeSeriesPoint] = Field(default_factory=list)
    category_distribution: List[DistributionPoint] = Field(default_factory=list)


# ============================================================
# Notification Schemas
# ============================================================
class NotificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    type: str  # success, warning, error, info
    title: str
    description: str
    read: bool = False
    action_label: Optional[str] = None
    action_href: Optional[str] = None
    created_at: datetime


# ============================================================
# Search Schemas
# ============================================================
class SearchQuery(BaseModel):
    query: str
    category: Optional[str] = None
    manufacturer: Optional[str] = None
    status: Optional[str] = None
    min_quality_score: Optional[float] = None
    page: int = 1
    page_size: int = 20
