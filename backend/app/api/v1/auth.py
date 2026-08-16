"""
Auth, Users, and Organizations API Endpoints
"""

from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.dependencies import CurrentUser, get_current_user, get_db, require_role
from app.schemas.common import ApiResponse
from app.schemas.user import (
    MemberCreate,
    MemberResponse,
    OrganizationResponse,
    OrganizationUpdate,
    UserResponse,
    UserUpdate,
)
from app.services.auth_service import auth_service

auth_router = APIRouter(prefix="/auth", tags=["Authentication"])
users_router = APIRouter(prefix="/users", tags=["Users"])
orgs_router = APIRouter(prefix="/organizations", tags=["Organizations"])


# ============================================================
# Auth Routes
# ============================================================
@auth_router.get("/me", response_model=ApiResponse[UserResponse])
async def get_my_auth_profile(
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    user, _ = await auth_service.sync_firebase_user(db, current_user)
    return ApiResponse(data=UserResponse.model_validate(user))


@auth_router.post("/sync", response_model=ApiResponse[UserResponse])
async def sync_auth_session(
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    user, _ = await auth_service.sync_firebase_user(db, current_user)
    return ApiResponse(data=UserResponse.model_validate(user))


@auth_router.post("/logout")
async def logout(current_user: CurrentUser = Depends(get_current_user)):
    return ApiResponse(data={"message": "Logged out successfully."})


# ============================================================
# Users Routes
# ============================================================
@users_router.get("/me", response_model=ApiResponse[UserResponse])
async def get_current_user_profile(
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    user, _ = await auth_service.sync_firebase_user(db, current_user)
    return ApiResponse(data=UserResponse.model_validate(user))


# ============================================================
# Organizations Routes
# ============================================================
@orgs_router.get("/current", response_model=ApiResponse[OrganizationResponse])
async def get_current_organization(
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _, org = await auth_service.sync_firebase_user(db, current_user)
    return ApiResponse(data=OrganizationResponse.model_validate(org))
