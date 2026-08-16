"""
FastAPI Dependencies for Database and Authentication
"""

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import CurrentUser, get_current_user, require_org_member, require_role
from app.db.session import get_db

# Re-export standard dependencies
__all__ = [
    "get_db",
    "CurrentUser",
    "get_current_user",
    "require_org_member",
    "require_role",
]
