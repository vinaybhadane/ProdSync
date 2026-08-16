"""
Catalog Schemas
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class CatalogBase(BaseModel):
    name: str
    description: Optional[str] = None


class CatalogCreate(CatalogBase):
    pass


class CatalogUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


class CatalogResponse(CatalogBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    organization_id: str
    status: str = "active"
    processing_status: str = "completed"
    product_count: int = 0
    data_quality_score: float = 90.0
    validation_rate: float = 85.0
    enrichment_rate: float = 60.0
    completeness_rate: float = 88.0
    categories: List[str] = Field(default_factory=list)
    manufacturers: List[str] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime


class CatalogStatsResponse(BaseModel):
    total_products: int
    data_quality_score: float
    validation_rate: float
    enrichment_rate: float
    completeness_rate: float
    missing_fields_count: int = 0
    conflicts_count: int = 0
    ai_enriched_count: int = 0
