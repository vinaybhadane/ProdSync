"""
Catalog, Product, ProductAttribute, ProductSource Models
"""

from typing import Any, Dict, List, Optional
from sqlalchemy import Boolean, Float, ForeignKey, Index, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin, UUIDMixin


class Catalog(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "catalogs"

    organization_id: Mapped[str] = mapped_column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="active")  # active, archived, processing
    processing_status: Mapped[str] = mapped_column(String(32), default="completed")  # pending, processing, completed, failed
    product_count: Mapped[int] = mapped_column(Integer, default=0)
    data_quality_score: Mapped[float] = mapped_column(Float, default=90.0)
    validation_rate: Mapped[float] = mapped_column(Float, default=85.0)
    enrichment_rate: Mapped[float] = mapped_column(Float, default=60.0)
    completeness_rate: Mapped[float] = mapped_column(Float, default=88.0)

    organization: Mapped["Organization"] = relationship("Organization", back_populates="catalogs")
    products: Mapped[List["Product"]] = relationship("Product", back_populates="catalog", cascade="all, delete-orphan")


class Product(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "products"

    organization_id: Mapped[str] = mapped_column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    catalog_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("catalogs.id", ondelete="SET NULL"), nullable=True, index=True)
    sku: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    manufacturer: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    manufacturer_part_number: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    category: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="draft", index=True)  # draft, processing, needs_review, validated, approved, exported
    validation_status: Mapped[str] = mapped_column(String(32), default="needs_review", index=True)  # verified, ai_validated, ai_suggested, needs_review, invalid, missing
    
    # Unilog Standards Content Tiers
    brand: Mapped[str] = mapped_column(String(255), default="Industrial Standard")
    series: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    classpath: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    unspsc: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    invoice_desc: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    mobile_desc: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    product_title: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    long_description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    bullet_features: Mapped[List[str]] = mapped_column(JSON, default=list)

    # Intelligence Scores (0.0 to 100.0)
    data_quality_score: Mapped[float] = mapped_column(Float, default=0.0)
    ai_confidence_score: Mapped[float] = mapped_column(Float, default=0.0)
    completeness_score: Mapped[float] = mapped_column(Float, default=0.0)
    
    # Flexible JSONB technical specification payload
    raw_attributes: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    
    # Soft deletion
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, index=True)

    organization: Mapped["Organization"] = relationship("Organization", back_populates="products")
    catalog: Mapped[Optional["Catalog"]] = relationship("Catalog", back_populates="products")
    attributes: Mapped[List["ProductAttribute"]] = relationship("ProductAttribute", back_populates="product", cascade="all, delete-orphan")
    sources: Mapped[List["ProductSource"]] = relationship("ProductSource", back_populates="product", cascade="all, delete-orphan")
    validation_issues: Mapped[List["ValidationIssue"]] = relationship("ValidationIssue", back_populates="product", cascade="all, delete-orphan")
    enrichment_suggestions: Mapped[List["EnrichmentSuggestion"]] = relationship("EnrichmentSuggestion", back_populates="product", cascade="all, delete-orphan")
    ai_insights: Mapped[List["AIInsight"]] = relationship("AIInsight", back_populates="product", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_org_catalog_product", "organization_id", "catalog_id"),
        Index("ix_org_sku_product", "organization_id", "sku"),
        Index("ix_org_status_product", "organization_id", "status"),
        Index("ix_org_deleted_cat", "organization_id", "is_deleted", "category"),
        Index("ix_org_deleted_mfg", "organization_id", "is_deleted", "manufacturer"),
        Index("ix_org_deleted_val", "organization_id", "is_deleted", "validation_status"),
        Index("ix_org_deleted_upd", "organization_id", "is_deleted", "updated_at"),
    )


class ProductAttribute(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "product_attributes"

    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    attribute_key: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    display_name: Mapped[str] = mapped_column(String(255), nullable=False)
    value: Mapped[str] = mapped_column(Text, nullable=False)
    normalized_value: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    unit: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    value_type: Mapped[str] = mapped_column(String(32), default="string")  # string, number, range, boolean, enum
    status: Mapped[str] = mapped_column(String(32), default="needs_review")  # verified, ai_validated, ai_suggested, needs_review, invalid, missing
    confidence: Mapped[float] = mapped_column(Float, default=0.0)
    source_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    source_type: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    ai_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_ai_generated: Mapped[bool] = mapped_column(Boolean, default=False)
    is_enriched: Mapped[bool] = mapped_column(Boolean, default=False)
    is_user_approved: Mapped[bool] = mapped_column(Boolean, default=False)

    product: Mapped["Product"] = relationship("Product", back_populates="attributes")


class ProductSource(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "product_sources"

    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    source_type: Mapped[str] = mapped_column(String(32), nullable=False)  # pdf, csv, xlsx, url, manual, datasheet, catalog, image
    source_url: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    filename: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    blob_path: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    page_number: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    section: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    attribute_count: Mapped[int] = mapped_column(Integer, default=0)
    confidence: Mapped[float] = mapped_column(Float, default=95.0)

    product: Mapped["Product"] = relationship("Product", back_populates="sources")
