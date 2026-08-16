"""
Catalog Management Service
"""

from typing import List, Optional, Tuple
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import NotFoundException
from app.db.models.product import Catalog, Product
from app.schemas.catalog import CatalogCreate, CatalogUpdate


class CatalogService:
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
        results = (await db.execute(query.offset(offset).limit(page_size))).scalars().all()
        
        # If no catalogs exist, create default master catalog
        if len(results) == 0 and total == 0:
            default_cat = Catalog(
                organization_id=organization_id,
                name="Master Industrial Catalog",
                description="Primary product master catalog with verified 5-tier descriptions and technical specifications.",
                status="active",
                processing_status="completed",
            )
            db.add(default_cat)
            await db.commit()
            results = [default_cat]
            total = 1

        return list(results), total

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
