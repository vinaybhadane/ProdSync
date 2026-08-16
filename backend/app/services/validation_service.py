"""
Validation Queue & Conflict Resolution Service
"""

from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import NotFoundException
from app.db.models.job import ValidationIssue
from app.db.models.product import Product


class ValidationService:
    @classmethod
    async def list_issues(
        cls,
        db: AsyncSession,
        organization_id: str,
        severity: Optional[str] = None,
        status: Optional[str] = "open",
    ) -> List[ValidationIssue]:
        query = select(ValidationIssue).where(
            ValidationIssue.organization_id == organization_id
        )
        if severity and severity != "all":
            query = query.where(ValidationIssue.severity == severity)
        if status and status != "all":
            query = query.where(ValidationIssue.status == status)

        query = query.order_by(ValidationIssue.created_at.desc())
        results = (await db.execute(query)).scalars().all()
        return list(results)

    @classmethod
    async def resolve_issue(
        cls,
        db: AsyncSession,
        organization_id: str,
        issue_id: str,
        action: str = "resolve",  # accept, reject, resolve
        selected_value: Optional[str] = None,
    ) -> ValidationIssue:
        stmt = select(ValidationIssue).where(
            ValidationIssue.id == issue_id,
            ValidationIssue.organization_id == organization_id,
        )
        issue = (await db.execute(stmt)).scalar_one_or_none()
        if not issue:
            raise NotFoundException("Validation Issue", issue_id)

        issue.status = "resolved" if action == "resolve" else "accepted" if action == "accept" else "rejected"

        # Update product validation status if all issues resolved
        remaining_stmt = select(ValidationIssue).where(
            ValidationIssue.product_id == issue.product_id,
            ValidationIssue.status == "open",
            ValidationIssue.id != issue.id,
        )
        remaining = (await db.execute(remaining_stmt)).scalars().all()
        prod_stmt = select(Product).where(Product.id == issue.product_id)
        product = (await db.execute(prod_stmt)).scalar_one_or_none()
        if product:
            product.data_quality_score = min(100.0, product.data_quality_score + 5.0)
            if len(remaining) == 0:
                product.validation_status = "verified"
                product.status = "validated"

        await db.commit()
        return issue

    @classmethod
    async def dismiss_issue(
        cls, db: AsyncSession, organization_id: str, issue_id: str
    ) -> ValidationIssue:
        return await cls.resolve_issue(db, organization_id, issue_id, action="reject")


validation_service = ValidationService()
