"""
Product, ProductAttribute, and ProductSource Schemas
"""

from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field


class AttributeSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    attribute_key: str
    display_name: str
    value: str
    normalized_value: Optional[str] = None
    unit: Optional[str] = None
    value_type: str = "string"
    status: str = "needs_review"  # verified, ai_validated, ai_suggested, needs_review, invalid, missing
    confidence: float = 0.0
    source_name: Optional[str] = None
    source_type: Optional[str] = None
    ai_reason: Optional[str] = None
    is_ai_generated: bool = False
    is_enriched: bool = False
    is_user_approved: bool = False
    last_updated: Optional[datetime] = None


class ProductAttributeCreate(BaseModel):
    name: str
    value: str
    unit: Optional[str] = None
    status: Optional[str] = "verified"
    confidence: Optional[float] = 100.0
    source: Optional[str] = "Manual Entry"
    source_type: Optional[str] = "manual"


class ProductAttributeUpdate(BaseModel):
    name: Optional[str] = None
    value: Optional[str] = None
    unit: Optional[str] = None
    status: Optional[str] = None


class SourceSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    source_type: str
    source_url: Optional[str] = None
    filename: Optional[str] = None
    page_number: Optional[int] = None
    section: Optional[str] = None
    attribute_count: int = 0
    confidence: float = 95.0
    extracted_at: Optional[datetime] = None


class ValidationIssueSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    product_id: str
    attribute_name: str
    severity: str  # critical, warning, info
    title: str
    description: str
    source_a_value: Optional[str] = None
    source_b_value: Optional[str] = None
    source_a_label: Optional[str] = None
    source_b_label: Optional[str] = None
    recommended_action: Optional[str] = None
    status: str = "open"
    created_at: Optional[datetime] = None


class EnrichmentSuggestionSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    product_id: str
    attribute_name: str
    current_value: Optional[str] = None
    suggested_value: str
    confidence: float = 80.0
    reason: str
    source: Optional[str] = None
    source_type: Optional[str] = "catalog"
    status: str = "pending"
    edited_value: Optional[str] = None
    created_at: Optional[datetime] = None


class AIInsightSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    type: str  # enrichment, validation, extraction, suggestion
    title: str
    description: str
    confidence: float = 90.0
    attribute_names: List[str] = Field(default_factory=list)
    created_at: Optional[datetime] = None


class ProductBase(BaseModel):
    sku: str
    name: str
    description: Optional[str] = None
    manufacturer: str
    manufacturer_part_number: Optional[str] = None
    category: str
    catalog_id: Optional[str] = None
    brand: Optional[str] = "Industrial Standard"
    series: Optional[str] = None
    classpath: Optional[str] = None
    unspsc: Optional[str] = None
    invoice_desc: Optional[str] = None
    mobile_desc: Optional[str] = None
    product_title: Optional[str] = None
    long_description: Optional[str] = None
    bullet_features: List[str] = Field(default_factory=list)


class ProductCreate(ProductBase):
    raw_attributes: Optional[Dict[str, Any]] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    manufacturer: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    validation_status: Optional[str] = None
    brand: Optional[str] = None
    series: Optional[str] = None
    classpath: Optional[str] = None
    unspsc: Optional[str] = None
    invoice_desc: Optional[str] = None
    mobile_desc: Optional[str] = None
    product_title: Optional[str] = None
    long_description: Optional[str] = None
    bullet_features: Optional[List[str]] = None


class ProductResponse(ProductBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    organization_id: str
    status: str = "draft"
    validation_status: str = "needs_review"
    data_quality_score: float = 0.0
    ai_confidence_score: float = 0.0
    completeness_score: float = 0.0
    raw_attributes: Dict[str, Any] = Field(default_factory=dict)
    attributes: List[AttributeSchema] = Field(default_factory=list)
    sources: List[SourceSchema] = Field(default_factory=list)
    validation_issues: List[ValidationIssueSchema] = Field(default_factory=list)
    enrichment_suggestions: List[EnrichmentSuggestionSchema] = Field(default_factory=list)
    ai_insights: List[AIInsightSchema] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime


class BulkActionRequest(BaseModel):
    product_ids: List[str]
    action: str  # validate, enrich, approve, delete, export


class BulkActionResponse(BaseModel):
    successful_count: int
    failed_count: int
    message: str
    job_id: Optional[str] = None
