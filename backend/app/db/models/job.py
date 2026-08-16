"""
ProcessingJob, ValidationIssue, EnrichmentSuggestion, AIInsight, AuditLog, Notification, ProductSchema, and APIUsage Models
"""

from datetime import datetime
from typing import Any, Dict, List, Optional
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Index, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin, UUIDMixin


class ProcessingJob(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "processing_jobs"

    organization_id: Mapped[str] = mapped_column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    catalog_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    source_type: Mapped[str] = mapped_column(String(32), default="pdf")
    status: Mapped[str] = mapped_column(String(32), default="pending", index=True)  # pending, processing, completed, failed, ready_for_review
    progress: Mapped[int] = mapped_column(Integer, default=0)
    current_stage: Mapped[str] = mapped_column(String(64), default="Queued")
    product_count: Mapped[int] = mapped_column(Integer, default=0)
    total_products: Mapped[int] = mapped_column(Integer, default=0)
    processed_products: Mapped[int] = mapped_column(Integer, default=0)
    failed_products: Mapped[int] = mapped_column(Integer, default=0)
    attributes_extracted: Mapped[int] = mapped_column(Integer, default=0)
    validation_issues: Mapped[int] = mapped_column(Integer, default=0)
    stages: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    __table_args__ = (
        Index("ix_org_status_job", "organization_id", "status"),
    )


class ValidationIssue(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "validation_issues"

    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    organization_id: Mapped[str] = mapped_column(String(36), index=True, nullable=False)
    attribute_name: Mapped[str] = mapped_column(String(128), nullable=False)
    severity: Mapped[str] = mapped_column(String(32), default="warning")  # critical, warning, info
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    source_a_value: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    source_b_value: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    source_a_label: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    source_b_label: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    recommended_action: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="open", index=True)  # open, accepted, rejected, resolved

    product: Mapped["Product"] = relationship("Product", back_populates="validation_issues")

    __table_args__ = (
        Index("ix_org_status_issue", "organization_id", "status"),
        Index("ix_org_sev_issue", "organization_id", "severity"),
    )


class EnrichmentSuggestion(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "enrichment_suggestions"

    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    organization_id: Mapped[str] = mapped_column(String(36), index=True, nullable=False)
    attribute_name: Mapped[str] = mapped_column(String(128), nullable=False)
    current_value: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    suggested_value: Mapped[str] = mapped_column(String(255), nullable=False)
    confidence: Mapped[float] = mapped_column(Float, default=80.0)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    source: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    source_type: Mapped[Optional[str]] = mapped_column(String(32), default="catalog")
    status: Mapped[str] = mapped_column(String(32), default="pending", index=True)  # pending, accepted, rejected, edited
    edited_value: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    product: Mapped["Product"] = relationship("Product", back_populates="enrichment_suggestions")

    __table_args__ = (
        Index("ix_org_status_sugg", "organization_id", "status"),
    )


class AIInsight(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "ai_insights"

    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    type: Mapped[str] = mapped_column(String(32), default="enrichment")  # enrichment, validation, extraction, suggestion
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    confidence: Mapped[float] = mapped_column(Float, default=90.0)
    attribute_names: Mapped[List[str]] = mapped_column(JSON, default=list)

    product: Mapped["Product"] = relationship("Product", back_populates="ai_insights")


class Notification(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "notifications"

    organization_id: Mapped[str] = mapped_column(String(36), index=True, nullable=False)
    user_id: Mapped[Optional[str]] = mapped_column(String(36), index=True, nullable=True)
    type: Mapped[str] = mapped_column(String(32), default="info")  # success, warning, error, info
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    read: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    action_label: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    action_href: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    __table_args__ = (
        Index("ix_org_read_notif", "organization_id", "read"),
    )


class AuditLog(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "audit_logs"

    organization_id: Mapped[str] = mapped_column(String(36), index=True, nullable=False)
    user_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    user_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    action: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    entity_type: Mapped[str] = mapped_column(String(32), nullable=False)  # product, catalog, import, validation, enrichment
    entity_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    entity_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    details: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)


class ProductSchema(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "product_schemas"

    category_name: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    required_attributes: Mapped[List[str]] = mapped_column(JSON, default=list)
    recommended_attributes: Mapped[List[str]] = mapped_column(JSON, default=list)
    attribute_types: Mapped[Dict[str, str]] = mapped_column(JSON, default=dict)
    attribute_units: Mapped[Dict[str, List[str]]] = mapped_column(JSON, default=dict)


class APIUsage(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "api_usage"

    organization_id: Mapped[str] = mapped_column(String(36), index=True, nullable=False)
    job_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    operation: Mapped[str] = mapped_column(String(64), nullable=False)
    model: Mapped[str] = mapped_column(String(64), nullable=False)
    input_tokens: Mapped[int] = mapped_column(Integer, default=0)
    output_tokens: Mapped[int] = mapped_column(Integer, default=0)
    estimated_cost_usd: Mapped[float] = mapped_column(Float, default=0.0)
