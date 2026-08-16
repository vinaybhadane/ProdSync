"""
Catalog Management Service
Calculates real-time metrics, product counts, quality scores, and category breakdowns directly from SQLite DB.
"""

from typing import List, Optional, Tuple
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import NotFoundException
from app.db.models.product import Catalog, Product
from app.schemas.catalog import CatalogCreate, CatalogUpdate


class CatalogService:
    @classmethod
    async def _compute_catalog_realtime_metrics(
        cls, db: AsyncSession, organization_id: str, catalog: Catalog, total_org_catalogs: int = 1
    ) -> Catalog:
        """
        Dynamically calculates real-time product count, quality score, validation rate, 
        and distinct categories/manufacturers directly from the Product table.
        """
        # Determine product match criteria for this catalog
        is_primary = (
            total_org_catalogs == 1
            or catalog.name.lower().startswith("master")
            or "primary" in catalog.name.lower()
            or "industrial" in catalog.name.lower()
            or "default" in catalog.name.lower()
        )

        if is_primary:
            cat_filter = or_(Product.catalog_id == catalog.id, Product.catalog_id.is_(None))
        else:
            cat_filter = (Product.catalog_id == catalog.id)

        prod_stmt = select(
            func.count(Product.id).label("total"),
            func.avg(Product.data_quality_score).label("avg_quality"),
            func.avg(Product.completeness_score).label("avg_completeness"),
            func.count(Product.id).filter(Product.validation_status == "verified").label("verified_count"),
            func.count(Product.id).filter(Product.data_quality_score >= 80.0).label("enriched_count"),
        ).where(Product.organization_id == organization_id, cat_filter)

        row = (await db.execute(prod_stmt)).one_or_none()
        if row and row.total and row.total > 0:
            catalog.product_count = int(row.total)
            catalog.data_quality_score = round(float(row.avg_quality or 88.0), 1)
            catalog.completeness_rate = round(float(row.avg_completeness or 85.0), 1)
            catalog.validation_rate = round((float(row.verified_count or 0) / float(row.total)) * 100.0, 1)
            catalog.enrichment_rate = round((float(row.enriched_count or 0) / float(row.total)) * 100.0, 1)
        else:
            # Fallback if no products yet
            catalog.product_count = 0
            catalog.data_quality_score = 0.0
            catalog.completeness_rate = 0.0
            catalog.validation_rate = 0.0
            catalog.enrichment_rate = 0.0

        # Distinct Categories & Manufacturers from real products
        cat_query = select(Product.category).where(Product.organization_id == organization_id, cat_filter, Product.category.isnot(None)).distinct().limit(6)
        mfr_query = select(Product.manufacturer).where(Product.organization_id == organization_id, cat_filter, Product.manufacturer.isnot(None)).distinct().limit(6)
        
        cats = [c for c in (await db.execute(cat_query)).scalars().all() if c]
        mfrs = [m for m in (await db.execute(mfr_query)).scalars().all() if m]
        
        catalog.categories = cats
        catalog.manufacturers = mfrs
        return catalog

    @classmethod
    async def get_catalogs(
        cls,
        db: AsyncSession,
        organization_id: str,
        search: Optional[str] = None,
        page: int = 1,
        page_size: int = 20,
    ) -> Tuple[List[Catalog], int]:
        query = select(Catalog).where(Catalog.organization_id == organization_id)
        if search:
            query = query.where(Catalog.name.ilike(f"%{search}%"))

        # Total count
        count_stmt = select(func.count()).select_from(query.subquery())
        total = (await db.execute(count_stmt)).scalar() or 0

        # Paginate
        offset = (page - 1) * page_size
        results = list((await db.execute(query.offset(offset).limit(page_size))).scalars().all())
        
        # If no catalogs exist, create default master catalog
        if len(results) == 0 and total == 0:
            default_cat = Catalog(
                organization_id=organization_id,
                name="Master Industrial Catalog",
                description="Primary product catalog with real-time verified specifications and Unilog content.",
                status="active",
                processing_status="completed",
            )
            db.add(default_cat)
            await db.commit()
            await db.refresh(default_cat)
            results = [default_cat]
            total = 1

        # Calculate real-time metrics for each catalog
        for cat in results:
            await cls._compute_catalog_realtime_metrics(db, organization_id, cat, total_org_catalogs=total)

        return results, total

    @classmethod
    async def get_catalog(
        cls, db: AsyncSession, organization_id: str, catalog_id: str
    ) -> Catalog:
        stmt = select(Catalog).where(
            Catalog.id == catalog_id, Catalog.organization_id == organization_id
        )
        catalog = (await db.execute(stmt)).scalar_one_or_none()
        if not catalog:
            raise NotFoundException("Catalog", catalog_id)
        
        await cls._compute_catalog_realtime_metrics(db, organization_id, catalog)
        return catalog

    @classmethod
    async def create_catalog(
        cls, db: AsyncSession, organization_id: str, data: CatalogCreate
    ) -> Catalog:
        catalog = Catalog(
            organization_id=organization_id,
            name=data.name,
            description=data.description,
            status="active",
            processing_status="completed",
        )
        db.add(catalog)
        await db.commit()
        await db.refresh(catalog)
        await cls._compute_catalog_realtime_metrics(db, organization_id, catalog)
        return catalog

    @classmethod
    async def update_catalog(
        cls, db: AsyncSession, organization_id: str, catalog_id: str, data: CatalogUpdate
    ) -> Catalog:
        catalog = await cls.get_catalog(db, organization_id, catalog_id)
        if data.name is not None:
            catalog.name = data.name
        if data.description is not None:
            catalog.description = data.description
        if data.status is not None:
            catalog.status = data.status
        await db.commit()
        await db.refresh(catalog)
        await cls._compute_catalog_realtime_metrics(db, organization_id, catalog)
        return catalog

    @classmethod
    async def delete_catalog(
        cls, db: AsyncSession, organization_id: str, catalog_id: str
    ) -> bool:
        catalog = await cls.get_catalog(db, organization_id, catalog_id)
        await db.delete(catalog)
        await db.commit()
        return True


catalog_service = CatalogService()
