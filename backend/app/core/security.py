"""
ProdSync Security, Authentication & Role-Based Authorization
"""

from dataclasses import dataclass
from typing import List, Optional
from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.core.config import settings
from app.core.exceptions import ForbiddenException, UnauthorizedException
from app.core.firebase import verify_firebase_id_token
from app.core.logging import logger

security_bearer = HTTPBearer(auto_error=False)


@dataclass
class CurrentUser:
    id: str
    firebase_uid: str
    email: str
    display_name: str
    organization_id: str
    role: str
    is_active: bool = True


async def get_current_user(
    auth_header: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer),
) -> CurrentUser:
    """
    Extracts and verifies the Firebase Bearer token from the Authorization header.
    Returns the validated CurrentUser with their active organization and role.
    """
    if not auth_header or not auth_header.credentials:
        # If in debug mode and no token provided, return default demo user for seamless local inspection
        if settings.DEBUG:
            return CurrentUser(
                id="usr_alex_chen_01",
                firebase_uid="firebase_alex_01",
                email="alex.chen@prodsync.ai",
                display_name="Alex Chen",
                organization_id="org_industrial_corp_01",
                role="owner",
                is_active=True,
            )
        raise UnauthorizedException("Authorization bearer token is missing")

    token = auth_header.credentials
    try:
        claims = verify_firebase_id_token(token)
    except ValueError as e:
        raise UnauthorizedException(str(e))

    uid = claims.get("uid") or claims.get("sub") or "usr_default"
    email = claims.get("email") or f"{uid}@prodsync.ai"
    display_name = claims.get("name") or email.split("@")[0].replace(".", " ").title()
    org_id = claims.get("organization_id") or "org_industrial_corp_01"
    role = claims.get("role") or "owner"

    return CurrentUser(
        id=f"usr_{uid[:16]}",
        firebase_uid=uid,
        email=email,
        display_name=display_name,
        organization_id=org_id,
        role=role.lower(),
        is_active=True,
    )


def require_role(allowed_roles: List[str]):
    """
    Factory dependency to enforce role-based access control.
    Allowed roles example: ["owner", "admin", "manager"]
    """
    async def role_checker(current_user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
        user_role = current_user.role.lower()
        # Owner and Admin have superuser privileges across organization
        if user_role in ["owner", "admin"]:
            return current_user
        if user_role not in [r.lower() for r in allowed_roles]:
            raise ForbiddenException(
                f"Role '{current_user.role}' is not authorized to perform this operation. Allowed: {allowed_roles}"
            )
        return current_user
    return role_checker


def require_org_member(current_user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
    """Verifies that the user belongs to an active organization."""
    if not current_user.organization_id:
        raise ForbiddenException("User does not belong to any active organization")
    return current_user
