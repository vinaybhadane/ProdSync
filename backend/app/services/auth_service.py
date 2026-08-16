"""
Authentication & User Synchronization Service
"""

from datetime import datetime, timezone
from typing import Optional, Tuple
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.logging import logger
from app.core.security import CurrentUser
from app.db.models.user import Membership, Organization, User


class AuthService:
    @classmethod
    async def sync_firebase_user(
        cls, db: AsyncSession, firebase_user: CurrentUser
    ) -> Tuple[User, Organization]:
        """
        Synchronizes a verified Firebase user with the PostgreSQL database.
        Creates default Organization and Owner membership on first login.
        """
        # Find existing user
        stmt = select(User).where(User.firebase_uid == firebase_user.firebase_uid)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        if not user:
            user = User(
                firebase_uid=firebase_user.firebase_uid,
                email=firebase_user.email,
                display_name=firebase_user.display_name,
                email_verified=True,
                last_login_at=datetime.now(timezone.utc),
            )
            db.add(user)
            await db.flush()

            # Create default organization for new user
            company_name = (
                firebase_user.email.split("@")[1].split(".")[0].title()
                if "@" in firebase_user.email
                else "Industrial Corp"
            )
            org = Organization(
                name=f"{company_name} Industrial",
                slug=f"org-{user.id[:8]}",
                status="active",
                plan="enterprise",
            )
            db.add(org)
            await db.flush()

            # Assign Owner membership
            membership = Membership(
                organization_id=org.id,
                user_id=user.id,
                role="owner",
                status="active",
            )
            db.add(membership)
            await db.flush()
            logger.info(f"Created new user '{user.email}' and organization '{org.name}'")
        else:
            user.last_login_at = datetime.now(timezone.utc)
            if firebase_user.display_name:
                user.display_name = firebase_user.display_name
            await db.flush()

            # Get user's active organization
            m_stmt = (
                select(Organization)
                .join(Membership, Membership.organization_id == Organization.id)
                .where(Membership.user_id == user.id)
            )
            m_result = await db.execute(m_stmt)
            org = m_result.scalar_one_or_none()
            if not org:
                org = Organization(
                    name="Industrial Corp",
                    slug=f"org-{user.id[:8]}",
                    status="active",
                    plan="enterprise",
                )
                db.add(org)
                await db.flush()
                db.add(Membership(organization_id=org.id, user_id=user.id, role="owner"))
                await db.flush()

        return user, org


auth_service = AuthService()
