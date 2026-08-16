"""
Product Management & Catalog Operations Service — Cached & Optimized
"""

from typing import Any, Dict, List, Optional, Tuple
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.ai.confidence.confidence_scorer import ConfidenceScorer
from app.core.cache import cache
from app.core.exceptions import NotFoundException
from app.db.models.product import Product, ProductAttribute, ProductSource
from app.schemas.product import ProductAttributeCreate, ProductAttributeUpdate, ProductCreate, ProductUpdate


class ProductService:
    @classmethod
    async def get_products(
        cls,
        db: AsyncSession,
        organization_id: str,
        catalog_id: Optional[str] = None,
        search: Optional[str] = None,
        category: Optional[str] = None,
        manufacturer: Optional[str] = None,
        status: Optional[str] = None,
        validation_status: Optional[str] = None,
        page: int = 1,
        page_size: int = 20,
    ) -> Tuple[List[Product], int]:
        # Fast query construction with indexed filters
        query = select(Product).where(
            Product.organization_id == organization_id,
            Product.is_deleted == False,
        ).options(
            selectinload(Product.attributes),
            selectinload(Product.sources),
            selectinload(Product.validation_issues),
            selectinload(Product.enrichment_suggestions),
            selectinload(Product.ai_insights),
        )

        if catalog_id:
            query = query.where(Product.catalog_id == catalog_id)
        if category:
            query = query.where(Product.category == category)
        if manufacturer:
            query = query.where(Product.manufacturer == manufacturer)
        if status:
            query = query.where(Product.status == status)
        if validation_status:
            query = query.where(Product.validation_status == validation_status)
        if search:
            q = f"%{search}%"
            query = query.where(
                or_(
                    Product.name.ilike(q),
                    Product.sku.ilike(q),
                    Product.manufacturer.ilike(q),
                    Product.category.ilike(q),
                )
            )

        # Count total
        count_stmt = select(func.count()).select_from(query.subquery())
        total = (await db.execute(count_stmt)).scalar() or 0

        # Paginate
        offset = (page - 1) * page_size
        results = (
            await db.execute(query.order_by(Product.updated_at.desc()).offset(offset).limit(page_size))
        ).scalars().all()

        return list(results), total

    @classmethod
    async def get_product(
        cls, db: AsyncSession, organization_id: str, product_id: str
    ) -> Product:
        stmt = (
            select(Product)
            .where(
                Product.id == product_id,
                Product.organization_id == organization_id,
                Product.is_deleted == False,
            )
            .options(
                selectinload(Product.attributes),
                selectinload(Product.sources),
                selectinload(Product.validation_issues),
                selectinload(Product.enrichment_suggestions),
                selectinload(Product.ai_insights),
            )
        )
        product = (await db.execute(stmt)).scalar_one_or_none()
        if not product:
            raise NotFoundException("Product", product_id)
        return product

    @classmethod
    async def create_product(
        cls, db: AsyncSession, organization_id: str, data: ProductCreate
    ) -> Product:
        # Avoid exact duplicate: check if SKU already exists for this organization
        if data.sku:
            dup_stmt = select(Product).where(
                Product.organization_id == organization_id,
                Product.is_deleted == False,
                func.lower(Product.sku) == func.lower(data.sku.strip())
            )
            existing = (await db.execute(dup_stmt)).scalars().first()
            if existing:
                existing.name = data.name or existing.name
                existing.description = data.description or existing.description
                existing.manufacturer = data.manufacturer or existing.manufacturer
                existing.category = data.category or existing.category
                existing.raw_attributes = data.raw_attributes or existing.raw_attributes
                await db.commit()
                await cache.invalidate_tags(["products", "analytics"])
                return existing

        scores = ConfidenceScorer.calculate_product_scores(
            attributes=[], expected_attribute_count=8
        )
        product = Product(
            organization_id=organization_id,
            catalog_id=data.catalog_id,
            sku=data.sku,
            name=data.name,
            description=data.description,
            manufacturer=data.manufacturer,
            manufacturer_part_number=data.manufacturer_part_number,
            category=data.category,
            status="draft",
            validation_status="needs_review",
            data_quality_score=scores["data_quality_score"],
            ai_confidence_score=scores["ai_confidence_score"],
            completeness_score=scores["completeness_score"],
            raw_attributes=data.raw_attributes or {},
        )
        db.add(product)
        await db.flush()
        await cache.invalidate_tags(["products", "analytics"])
        return product

    @classmethod
    async def update_product(
        cls, db: AsyncSession, organization_id: str, product_id: str, data: ProductUpdate
    ) -> Product:
        product = await cls.get_product(db, organization_id, product_id)
        if data.name is not None:
            product.name = data.name
        if data.description is not None:
            product.description = data.description
        if data.manufacturer is not None:
            product.manufacturer = data.manufacturer
        if data.category is not None:
            product.category = data.category
        if data.status is not None:
            product.status = data.status
        if data.validation_status is not None:
            product.validation_status = data.validation_status
        if data.brand is not None:
            product.brand = data.brand
        if data.series is not None:
            product.series = data.series
        if data.classpath is not None:
            product.classpath = data.classpath
        if data.unspsc is not None:
            product.unspsc = data.unspsc
        if data.invoice_desc is not None:
            product.invoice_desc = data.invoice_desc
        if data.mobile_desc is not None:
            product.mobile_desc = data.mobile_desc
        if data.product_title is not None:
            product.product_title = data.product_title
        if data.long_description is not None:
            product.long_description = data.long_description
        if data.bullet_features is not None:
            product.bullet_features = data.bullet_features
        await db.commit()
        await cache.invalidate_tags(["products", "analytics"])
        return product

    @classmethod
    async def add_attribute(
        cls, db: AsyncSession, organization_id: str, product_id: str, data: ProductAttributeCreate
    ) -> ProductAttribute:
        product = await cls.get_product(db, organization_id, product_id)
        from app.db.models.product import ProductAttribute
        attr_key = data.name.lower().replace(" ", "_")
        attr = ProductAttribute(
            product_id=product.id,
            attribute_key=attr_key,
            display_name=data.name,
            value=data.value,
            normalized_value=data.value,
            unit=data.unit,
            status=data.status or "verified",
            confidence=data.confidence or 100.0,
            source_name=data.source or "Manual Entry",
            source_type=data.source_type or "manual",
            is_ai_generated=False,
            is_enriched=False,
            is_user_approved=True,
        )
        db.add(attr)
        # Update completeness
        product.completeness_score = min(100.0, product.completeness_score + 3.0)
        await db.commit()
        await cache.invalidate_tags(["products", "analytics"])
        return attr

    @classmethod
    async def update_attribute(
        cls, db: AsyncSession, organization_id: str, product_id: str, attribute_id: str, data: ProductAttributeUpdate
    ) -> ProductAttribute:
        product = await cls.get_product(db, organization_id, product_id)
        from app.db.models.product import ProductAttribute
        stmt = select(ProductAttribute).where(
            ProductAttribute.id == attribute_id,
            ProductAttribute.product_id == product.id,
        )
        attr = (await db.execute(stmt)).scalar_one_or_none()
        if not attr:
            raise NotFoundException("ProductAttribute", attribute_id)
        if data.name is not None:
            attr.display_name = data.name
            attr.attribute_key = data.name.lower().replace(" ", "_")
        if data.value is not None:
            attr.value = data.value
            attr.normalized_value = data.value
        if data.unit is not None:
            attr.unit = data.unit
        if data.status is not None:
            attr.status = data.status
        attr.is_user_approved = True
        await db.commit()
        await cache.invalidate_tags(["products", "analytics"])
        return attr

    @classmethod
    async def delete_attribute(
        cls, db: AsyncSession, organization_id: str, product_id: str, attribute_id: str
    ) -> bool:
        product = await cls.get_product(db, organization_id, product_id)
        from app.db.models.product import ProductAttribute
        stmt = select(ProductAttribute).where(
            ProductAttribute.id == attribute_id,
            ProductAttribute.product_id == product.id,
        )
        attr = (await db.execute(stmt)).scalar_one_or_none()
        if not attr:
            raise NotFoundException("ProductAttribute", attribute_id)
        await db.delete(attr)
        await db.commit()
        await cache.invalidate_tags(["products", "analytics"])
        return True

    @classmethod
    async def accept_suggestion(
        cls, db: AsyncSession, organization_id: str, suggestion_id: str
    ) -> Product:
        from app.db.models.job import EnrichmentSuggestion
        from app.db.models.product import ProductAttribute
        stmt = select(EnrichmentSuggestion).where(
            EnrichmentSuggestion.id == suggestion_id,
            EnrichmentSuggestion.organization_id == organization_id,
        )
        sugg = (await db.execute(stmt)).scalar_one_or_none()
        if not sugg:
            raise NotFoundException("EnrichmentSuggestion", suggestion_id)
        
        sugg.status = "accepted"

        # Check if attribute already exists on product
        product = await cls.get_product(db, organization_id, sugg.product_id)
        attr_key = sugg.attribute_name.lower().replace(" ", "_")
        stmt_attr = select(ProductAttribute).where(
            ProductAttribute.product_id == product.id,
            ProductAttribute.attribute_key == attr_key,
        )
        existing_attr = (await db.execute(stmt_attr)).scalar_one_or_none()
        if existing_attr:
            existing_attr.value = sugg.suggested_value
            existing_attr.normalized_value = sugg.suggested_value
            existing_attr.status = "verified"
            existing_attr.confidence = 98.0
            existing_attr.is_enriched = True
            existing_attr.is_user_approved = True
        else:
            new_attr = ProductAttribute(
                product_id=product.id,
                attribute_key=attr_key,
                display_name=sugg.attribute_name,
                value=sugg.suggested_value,
                normalized_value=sugg.suggested_value,
                status="verified",
                confidence=sugg.confidence,
                source_name="AI Suggestion Accepted",
                source_type="ai",
                is_ai_generated=True,
                is_enriched=True,
                is_user_approved=True,
            )
            db.add(new_attr)

        product.completeness_score = min(100.0, product.completeness_score + 5.0)
        product.data_quality_score = min(100.0, product.data_quality_score + 2.0)
        await db.commit()
        await cache.invalidate_tags(["products", "analytics"])
        return product

    @classmethod
    async def reject_suggestion(
        cls, db: AsyncSession, organization_id: str, suggestion_id: str
    ) -> bool:
        from app.db.models.job import EnrichmentSuggestion
        stmt = select(EnrichmentSuggestion).where(
            EnrichmentSuggestion.id == suggestion_id,
            EnrichmentSuggestion.organization_id == organization_id,
        )
        sugg = (await db.execute(stmt)).scalar_one_or_none()
        if not sugg:
            raise NotFoundException("EnrichmentSuggestion", suggestion_id)
        sugg.status = "rejected"
        await db.commit()
        await cache.invalidate_tags(["products", "analytics"])
        return True

    @classmethod
    async def resolve_issue(
        cls, db: AsyncSession, organization_id: str, issue_id: str
    ) -> Product:
        from app.db.models.job import ValidationIssue
        stmt = select(ValidationIssue).where(
            ValidationIssue.id == issue_id,
            ValidationIssue.organization_id == organization_id,
        )
        issue = (await db.execute(stmt)).scalar_one_or_none()
        if not issue:
            raise NotFoundException("ValidationIssue", issue_id)
        issue.status = "resolved"

        product = await cls.get_product(db, organization_id, issue.product_id)
        product.data_quality_score = min(100.0, product.data_quality_score + 5.0)
        await db.commit()
        await cache.invalidate_tags(["products", "analytics"])
        return product

    @classmethod
    async def dismiss_issue(
        cls, db: AsyncSession, organization_id: str, issue_id: str
    ) -> bool:
        from app.db.models.job import ValidationIssue
        stmt = select(ValidationIssue).where(
            ValidationIssue.id == issue_id,
            ValidationIssue.organization_id == organization_id,
        )
        issue = (await db.execute(stmt)).scalar_one_or_none()
        if not issue:
            raise NotFoundException("ValidationIssue", issue_id)
        issue.status = "dismissed"
        await db.commit()
        await cache.invalidate_tags(["products", "analytics"])
        return True

    @classmethod
    async def delete_product(
        cls, db: AsyncSession, organization_id: str, product_id: str, permanent: bool = True
    ) -> bool:
        from sqlalchemy import delete
        from app.db.models.job import ValidationIssue, EnrichmentSuggestion, AIInsight
        from app.db.models.product import ProductAttribute, ProductSource

        product = await cls.get_product(db, organization_id, product_id)
        if permanent:
            await db.execute(delete(ProductAttribute).where(ProductAttribute.product_id == product_id))
            await db.execute(delete(ProductSource).where(ProductSource.product_id == product_id))
            await db.execute(delete(ValidationIssue).where(ValidationIssue.product_id == product_id))
            await db.execute(delete(EnrichmentSuggestion).where(EnrichmentSuggestion.product_id == product_id))
            await db.execute(delete(AIInsight).where(AIInsight.product_id == product_id))
            await db.delete(product)
        else:
            product.is_deleted = True
            
        await db.commit()
        await cache.invalidate_tags(["products", "catalogs", "analytics"])
        return True

    @classmethod
    async def bulk_delete_products(
        cls, db: AsyncSession, organization_id: str, product_ids: List[str], permanent: bool = True
    ) -> int:
        from sqlalchemy import delete, update
        from app.db.models.job import ValidationIssue, EnrichmentSuggestion, AIInsight
        from app.db.models.product import ProductAttribute, ProductSource

        if not product_ids:
            return 0

        if permanent:
            await db.execute(delete(ProductAttribute).where(ProductAttribute.product_id.in_(product_ids)))
            await db.execute(delete(ProductSource).where(ProductSource.product_id.in_(product_ids)))
            await db.execute(delete(ValidationIssue).where(ValidationIssue.product_id.in_(product_ids)))
            await db.execute(delete(EnrichmentSuggestion).where(EnrichmentSuggestion.product_id.in_(product_ids)))
            await db.execute(delete(AIInsight).where(AIInsight.product_id.in_(product_ids)))
            res = await db.execute(
                delete(Product).where(
                    Product.organization_id == organization_id,
                    Product.id.in_(product_ids)
                )
            )
            deleted_count = res.rowcount
        else:
            res = await db.execute(
                update(Product)
                .where(
                    Product.organization_id == organization_id,
                    Product.id.in_(product_ids)
                )
                .values(is_deleted=True)
            )
            deleted_count = res.rowcount

        await db.commit()
        await cache.invalidate_tags(["products", "catalogs", "analytics"])
        return deleted_count

    @classmethod
    async def delete_all_products(
        cls, db: AsyncSession, organization_id: str, catalog_id: Optional[str] = None
    ) -> int:
        query = select(Product.id).where(Product.organization_id == organization_id)
        if catalog_id:
            query = query.where(Product.catalog_id == catalog_id)
        ids = (await db.execute(query)).scalars().all()
        if ids:
            return await cls.bulk_delete_products(db, organization_id, list(ids), permanent=True)
        return 0

    @classmethod
    async def get_categories(cls, db: AsyncSession, organization_id: str) -> List[str]:
        cache_key = f"categories_{organization_id}"
        cached = await cache.get(cache_key)
        if cached is not None:
            return cached

        stmt = (
            select(Product.category)
            .where(Product.organization_id == organization_id, Product.is_deleted == False)
            .distinct()
        )
        results = (await db.execute(stmt)).scalars().all()
        categories = sorted([c for c in results if c])
        await cache.set(cache_key, categories, ttl_seconds=120.0, tags=["products"])
        return categories

    @classmethod
    async def get_manufacturers(cls, db: AsyncSession, organization_id: str) -> List[str]:
        cache_key = f"manufacturers_{organization_id}"
        cached = await cache.get(cache_key)
        if cached is not None:
            return cached

        stmt = (
            select(Product.manufacturer)
            .where(Product.organization_id == organization_id, Product.is_deleted == False)
            .distinct()
        )
        results = (await db.execute(stmt)).scalars().all()
        manufacturers = sorted([m for m in results if m])
        await cache.set(cache_key, manufacturers, ttl_seconds=120.0, tags=["products"])
        return manufacturers


product_service = ProductService()
