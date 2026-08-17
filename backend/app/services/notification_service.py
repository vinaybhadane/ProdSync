import csv
import io
import json
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

import pandas as pd
from sqlalchemy import delete, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.ai.normalization.unilog_delivery_exporter import (
    UNILOG_DELIVERY_HEADERS,
    unilog_delivery_exporter,
)
from app.db.models.job import Notification
from app.db.models.product import Product


class NotificationService:
    @classmethod
    async def get_notifications(
        cls, db: AsyncSession, organization_id: str, unread_only: bool = False
    ) -> List[Notification]:
        query = select(Notification).where(Notification.organization_id == organization_id)
        if unread_only:
            query = query.where(Notification.read == False)
        query = query.order_by(Notification.created_at.desc()).limit(50)
        return list((await db.execute(query)).scalars().all())

    @classmethod
    async def get_unread_count(cls, db: AsyncSession, organization_id: str) -> int:
        from sqlalchemy import func
        result = await db.execute(
            select(func.count()).where(
                Notification.organization_id == organization_id,
                Notification.read == False,
            )
        )
        return result.scalar_one() or 0

    @classmethod
    async def mark_read(cls, db: AsyncSession, organization_id: str, notification_id: str):
        stmt = (
            update(Notification)
            .where(
                Notification.id == notification_id,
                Notification.organization_id == organization_id,
            )
            .values(read=True)
        )
        await db.execute(stmt)
        await db.commit()

    @classmethod
    async def mark_all_read(cls, db: AsyncSession, organization_id: str):
        stmt = (
            update(Notification)
            .where(Notification.organization_id == organization_id)
            .values(read=True)
        )
        await db.execute(stmt)
        await db.commit()

    @classmethod
    async def dismiss(cls, db: AsyncSession, organization_id: str, notification_id: str):
        stmt = delete(Notification).where(
            Notification.id == notification_id,
            Notification.organization_id == organization_id,
        )
        await db.execute(stmt)
        await db.commit()

    @classmethod
    async def create(
        cls,
        db: AsyncSession,
        organization_id: str,
        *,
        type: str,
        title: str,
        description: str,
        action_label: Optional[str] = None,
        action_href: Optional[str] = None,
    ) -> Notification:
        notif = Notification(
            id=str(uuid.uuid4()),
            organization_id=organization_id,
            type=type,
            title=title,
            description=description,
            action_label=action_label,
            action_href=action_href,
            read=False,
        )
        db.add(notif)
        await db.commit()
        await db.refresh(notif)
        return notif

    @classmethod
    async def auto_seed_from_events(cls, db: AsyncSession, organization_id: str):
        """
        Checks recent platform events (enrichments approved, validations resolved,
        batch jobs) and creates Notification rows if they don't already exist.
        Keeps notifications fresh without duplicates.
        """
        from sqlalchemy import desc
        from app.db.models.job import ProcessingJob, EnrichmentSuggestion, ValidationIssue

        # Seed from completed batch jobs
        job_stmt = (
            select(ProcessingJob)
            .where(
                ProcessingJob.organization_id == organization_id,
                ProcessingJob.status == "completed",
            )
            .order_by(desc(ProcessingJob.created_at))
            .limit(5)
        )
        jobs = (await db.execute(job_stmt)).scalars().all()
        for j in jobs:
            existing_check = await db.execute(
                select(Notification).where(
                    Notification.organization_id == organization_id,
                    Notification.description.contains(j.id[:8]),
                ).limit(1)
            )
            if not existing_check.scalar_one_or_none():
                db.add(Notification(
                    id=str(uuid.uuid4()),
                    organization_id=organization_id,
                    type="success",
                    title="Batch Processing Completed",
                    description=f"Dataset '{j.filename}' processed successfully — {j.product_count} products extracted. Job #{j.id[:8]}",
                    action_label="View Jobs",
                    action_href="/app/processing",
                    read=False,
                ))

        # Seed from accepted enrichment suggestions
        sugg_stmt = (
            select(EnrichmentSuggestion)
            .where(
                EnrichmentSuggestion.organization_id == organization_id,
                EnrichmentSuggestion.status == "accepted",
            )
            .order_by(desc(EnrichmentSuggestion.updated_at))
            .limit(5)
        )
        suggs = (await db.execute(sugg_stmt)).scalars().all()
        for s in suggs:
            existing_check = await db.execute(
                select(Notification).where(
                    Notification.organization_id == organization_id,
                    Notification.description.contains(s.id[:8]),
                ).limit(1)
            )
            if not existing_check.scalar_one_or_none():
                db.add(Notification(
                    id=str(uuid.uuid4()),
                    organization_id=organization_id,
                    type="info",
                    title="AI Suggestion Approved & Saved",
                    description=f"'{s.attribute_name}: {s.suggested_value}' saved to database ({s.confidence:.0f}% AI confidence). ID #{s.id[:8]}",
                    action_label="View Products",
                    action_href="/app/products",
                    read=False,
                ))

        # Seed from resolved validation issues
        val_stmt = (
            select(ValidationIssue)
            .where(
                ValidationIssue.organization_id == organization_id,
                ValidationIssue.status.in_(["resolved", "accepted"]),
            )
            .order_by(desc(ValidationIssue.updated_at))
            .limit(5)
        )
        val_issues = (await db.execute(val_stmt)).scalars().all()
        for v in val_issues:
            existing_check = await db.execute(
                select(Notification).where(
                    Notification.organization_id == organization_id,
                    Notification.description.contains(v.id[:8]),
                ).limit(1)
            )
            if not existing_check.scalar_one_or_none():
                db.add(Notification(
                    id=str(uuid.uuid4()),
                    organization_id=organization_id,
                    type="warning",
                    title="Validation Issue Resolved",
                    description=f"Attribute '{v.attribute_name}' conflict resolved — data quality check passed. ID #{v.id[:8]}",
                    action_label="View Validation",
                    action_href="/app/validation",
                    read=False,
                ))

        await db.commit()


from sqlalchemy.orm import selectinload
from app.ai.normalization.unilog_delivery_exporter import unilog_delivery_exporter, UNILOG_DELIVERY_HEADERS


class ExportService:
    @classmethod
    async def export_products_data(
        cls, db: AsyncSession, organization_id: str, product_ids: Optional[List[str]] = None, format_type: str = "csv"
    ) -> bytes:
        """
        Exports commerce-ready product intelligence in CSV, XLSX, or JSON format.
        """
        query = select(Product).options(
            selectinload(Product.attributes),
            selectinload(Product.sources),
        ).where(
            Product.organization_id == organization_id, Product.is_deleted == False
        )
        if product_ids:
            query = query.where(Product.id.in_(product_ids))

        products = (await db.execute(query)).scalars().all()
        
        records = []
        for p in products:
            row = {
                "ID": p.id,
                "SKU": p.sku,
                "Name": p.name,
                "Brand": p.brand or p.manufacturer,
                "Manufacturer": p.manufacturer,
                "MPN": p.manufacturer_part_number or p.sku,
                "Category": p.category,
                "Classpath": p.classpath,
                "UNSPSC": p.unspsc or "40151500",
                "Status": p.status,
                "Validation Status": p.validation_status,
                "Data Quality Score": p.data_quality_score,
                "AI Confidence Score": p.ai_confidence_score,
                "Completeness Score": p.completeness_score,
                "Short Description": p.product_title or p.name,
                "Mobile Description": p.mobile_desc,
                "Invoice Description": p.invoice_desc,
                "Long Description": p.long_description or p.description,
            }
            # Add all individual technical attributes
            for a in p.attributes:
                k = a.display_name or a.attribute_key
                row[f"Attr_{k}"] = f"{a.normalized_value or a.value}{(' ' + a.unit) if a.unit else ''}"
            records.append(row)

        df = pd.DataFrame(records)

        if format_type.lower() == "xlsx":
            buffer = io.BytesIO()
            with pd.ExcelWriter(buffer, engine="openpyxl") as writer:
                df.to_excel(writer, index=False, sheet_name="Products")
            return buffer.getvalue()
        elif format_type.lower() == "json":
            return json.dumps(records, indent=2, default=str).encode("utf-8")
        else:
            # Default CSV
            return df.to_csv(index=False).encode("utf-8")

    @classmethod
    async def export_unilog_delivery(
        cls, db: AsyncSession, organization_id: str, product_ids: Optional[List[str]] = None, format_type: str = "csv"
    ) -> bytes:
        """
        Exports products in the exact 252-column Unilog delivery format.
        """
        query = select(Product).options(
            selectinload(Product.attributes),
            selectinload(Product.sources),
        ).where(
            Product.organization_id == organization_id, Product.is_deleted == False
        )
        if product_ids:
            query = query.where(Product.id.in_(product_ids))

        products = (await db.execute(query)).scalars().all()
        
        delivery_records = [
            unilog_delivery_exporter.process_product_to_delivery(p)
            for p in products
        ]

        if format_type.lower() == "xlsx":
            df = pd.DataFrame(delivery_records)
            buffer = io.BytesIO()
            with pd.ExcelWriter(buffer, engine="openpyxl") as writer:
                df.to_excel(writer, index=False, sheet_name="Unilog Delivery")
            return buffer.getvalue()
        elif format_type.lower() == "json":
            return json.dumps(delivery_records, indent=2, default=str).encode("utf-8")
        else:
            # Default CSV with 252 columns
            output = io.StringIO()
            writer = csv.DictWriter(output, fieldnames=UNILOG_DELIVERY_HEADERS, lineterminator="\n")
            writer.writeheader()
            for r in delivery_records:
                writer.writerow(r)
            return output.getvalue().encode("utf-8")


notification_service = NotificationService()
export_service = ExportService()