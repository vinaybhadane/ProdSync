"""
AI Enrichment & Human Review Service — Powered by Google Gemini
"""

import uuid
from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException
from app.core.logging import logger
from app.db.models.job import EnrichmentSuggestion
from app.db.models.product import Product, ProductAttribute


class EnrichmentService:
    @classmethod
    async def list_suggestions(
        cls,
        db: AsyncSession,
        organization_id: str,
        status: Optional[str] = "pending",
    ) -> List[EnrichmentSuggestion]:
        query = select(EnrichmentSuggestion).where(
            EnrichmentSuggestion.organization_id == organization_id
        )
        if status and status != "all":
            query = query.where(EnrichmentSuggestion.status == status)

        query = query.order_by(EnrichmentSuggestion.confidence.desc())
        results = (await db.execute(query)).scalars().all()
        return list(results)

    @classmethod
    async def run_gemini_enrichment(
        cls,
        db: AsyncSession,
        organization_id: str,
        product_id: str,
    ) -> List[EnrichmentSuggestion]:
        """
        Calls Google Gemini API to generate AI enrichment suggestions for a product's
        missing or low-confidence attributes. Saves results as EnrichmentSuggestion rows.
        """
        from app.azure.openai_client import openai_service
        from app.ai.prompts.product_extraction import ENRICHMENT_SYSTEM_PROMPT

        # 1. Load product + existing attributes
        prod_stmt = select(Product).where(
            Product.id == product_id,
            Product.organization_id == organization_id,
        )
        product = (await db.execute(prod_stmt)).scalar_one_or_none()
        if not product:
            raise NotFoundException("Product", product_id)

        attr_stmt = select(ProductAttribute).where(
            ProductAttribute.product_id == product_id,
        )
        existing_attrs = (await db.execute(attr_stmt)).scalars().all()

        # 2. Build context for Gemini
        existing_summary = [
            {
                "key": a.attribute_key,
                "display_name": a.display_name,
                "value": a.value,
                "unit": a.unit,
                "confidence": a.confidence,
            }
            for a in existing_attrs
        ]

        user_content = (
            f"Product Name: {product.name}\n"
            f"Brand: {product.brand or 'Unknown'}\n"
            f"Manufacturer: {product.manufacturer or 'Unknown'}\n"
            f"Category: {product.category}\n"
            f"Classpath: {product.classpath or product.category}\n"
            f"Current Description: {(product.description or '')[:500]}\n\n"
            f"Currently Known Attributes:\n{existing_summary}\n\n"
            "Please suggest important missing attributes that are typical for this product category. "
            "Focus on practical industrial specifications like temperature range, material, IP rating, "
            "dimensions, weight, certifications, connection types, and standards compliance."
        )

        # 3. Call Gemini
        logger.info(f"Running Gemini enrichment for product {product_id} (provider: {openai_service.provider})")
        ai_result = await openai_service.generate_structured_json(
            system_prompt=ENRICHMENT_SYSTEM_PROMPT,
            user_content=user_content,
            max_tokens=2000,
        )

        suggestions_data = ai_result.get("data", {}).get("suggestions", [])
        model_used = ai_result.get("model", "gemini")
        provider_used = ai_result.get("provider", "unknown")
        logger.info(f"Gemini returned {len(suggestions_data)} suggestions via {provider_used}/{model_used}")

        # 4. Remove old pending suggestions for this product to avoid duplicates
        old_stmt = select(EnrichmentSuggestion).where(
            EnrichmentSuggestion.product_id == product_id,
            EnrichmentSuggestion.organization_id == organization_id,
            EnrichmentSuggestion.status == "pending",
        )
        old_suggs = (await db.execute(old_stmt)).scalars().all()
        for old in old_suggs:
            await db.delete(old)
        await db.flush()

        # 5. Save new suggestions
        new_suggestions = []
        for sugg in suggestions_data:
            attr_name = sugg.get("attribute_name", "Specification")
            suggested_val = sugg.get("suggested_value", "")
            confidence = round(float(sugg.get("confidence", 0.75)) * 100.0, 1)
            reason = sugg.get("reason", "Inferred from product category standards")
            source_type = sugg.get("source_type", "industry_standard")

            if not suggested_val:
                continue

            new_sugg = EnrichmentSuggestion(
                id=str(uuid.uuid4()),
                product_id=product_id,
                organization_id=organization_id,
                attribute_name=attr_name,
                suggested_value=suggested_val,
                confidence=confidence,
                reason=reason,
                source_type=source_type,
                status="pending",
            )
            db.add(new_sugg)
            new_suggestions.append(new_sugg)

        # 6. Update product AI score
        if new_suggestions:
            product.ai_confidence_score = min(
                100.0,
                (product.ai_confidence_score or 50.0) + 5.0,
            )

        await db.commit()

        # 7. Refresh and return
        result = []
        for sugg in new_suggestions:
            await db.refresh(sugg)
            result.append(sugg)

        return result

    @classmethod
    async def approve_suggestion(
        cls,
        db: AsyncSession,
        organization_id: str,
        suggestion_id: str,
        custom_value: Optional[str] = None,
    ) -> EnrichmentSuggestion:
        stmt = select(EnrichmentSuggestion).where(
            EnrichmentSuggestion.id == suggestion_id,
            EnrichmentSuggestion.organization_id == organization_id,
        )
        sugg = (await db.execute(stmt)).scalar_one_or_none()
        if not sugg:
            raise NotFoundException("Enrichment Suggestion", suggestion_id)

        value_to_apply = custom_value or sugg.suggested_value
        sugg.status = "accepted" if not custom_value else "edited"
        if custom_value:
            sugg.edited_value = custom_value

        # Persist as user-approved attribute on the product
        attr_stmt = select(ProductAttribute).where(
            ProductAttribute.product_id == sugg.product_id,
            ProductAttribute.attribute_key == sugg.attribute_name.lower().replace(" ", "_"),
        )
        existing_attr = (await db.execute(attr_stmt)).scalar_one_or_none()

        if existing_attr:
            existing_attr.value = value_to_apply
            existing_attr.is_enriched = True
            existing_attr.is_user_approved = True
            existing_attr.confidence = 98.0
            existing_attr.status = "verified"
        else:
            new_attr = ProductAttribute(
                product_id=sugg.product_id,
                attribute_key=sugg.attribute_name.lower().replace(" ", "_"),
                display_name=sugg.attribute_name,
                value=value_to_apply,
                is_ai_generated=True,
                is_enriched=True,
                is_user_approved=True,
                confidence=98.0,
                status="verified",
                source_name="Gemini AI Enrichment",
                source_type="ai_suggestion",
                ai_reason=sugg.reason,
            )
            db.add(new_attr)

        # Update product quality scores
        prod_stmt = select(Product).where(Product.id == sugg.product_id)
        product = (await db.execute(prod_stmt)).scalar_one_or_none()
        if product:
            product.completeness_score = min(100.0, product.completeness_score + 5.0)
            product.data_quality_score = min(100.0, product.data_quality_score + 2.0)

        await db.commit()
        return sugg

    @classmethod
    async def reject_suggestion(
        cls, db: AsyncSession, organization_id: str, suggestion_id: str
    ) -> EnrichmentSuggestion:
        stmt = select(EnrichmentSuggestion).where(
            EnrichmentSuggestion.id == suggestion_id,
            EnrichmentSuggestion.organization_id == organization_id,
        )
        sugg = (await db.execute(stmt)).scalar_one_or_none()
        if not sugg:
            raise NotFoundException("Enrichment Suggestion", suggestion_id)

        sugg.status = "rejected"
        await db.commit()
        return sugg


enrichment_service = EnrichmentService()
