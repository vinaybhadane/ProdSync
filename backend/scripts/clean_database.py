"""
Reset / Clean Products in Database
Allows clearing all products to start completely fresh with file extractions.
"""

import asyncio
from sqlalchemy import delete
from app.db.models.job import AIInsight, EnrichmentSuggestion, ProcessingJob, ValidationIssue
from app.db.models.product import Product, ProductAttribute, ProductSource
from app.db.session import async_session_factory


async def clean_products():
    async with async_session_factory() as db:
        print("Cleaning all product attributes, sources, issues, and products...")
        await db.execute(delete(ProductAttribute))
        await db.execute(delete(ProductSource))
        await db.execute(delete(ValidationIssue))
        await db.execute(delete(EnrichmentSuggestion))
        await db.execute(delete(AIInsight))
        await db.execute(delete(Product))
        await db.execute(delete(ProcessingJob))
        await db.commit()
        print("Database products cleaned successfully! (0 products in database)")


if __name__ == "__main__":
    asyncio.run(clean_products())
