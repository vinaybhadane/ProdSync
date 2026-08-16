"""
Catalog Endpoints
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.dependencies import CurrentUser, get_current_user, get_db, require_role
from app.schemas.catalog import (
    CatalogCreate,
    CatalogResponse,
    CatalogStatsResponse,
    CatalogUpdate,
)
from app.schemas.common import ApiResponse, PaginatedMeta, PaginatedResponse
from app.services.catalog_service import catalog_service

router = APIRouter(prefix="/catalogs", tags=["Catalogs"])


@router.get("", response_model=PaginatedResponse[CatalogResponse])
async def list_catalogs(
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    catalogs, total = await catalog_service.get_catalogs(
        db=db,
        organization_id=current_user.organization_id,
        search=search,
        page=page,
        page_size=page_size,
    )
    return PaginatedResponse(
        data=[CatalogResponse.model_validate(c) for c in catalogs],
        meta=PaginatedMeta(
            page=page,
            page_size=page_size,
            total=total,
            total_pages=(total + page_size - 1) // page_size,
        ),
    )


@router.post("", response_model=ApiResponse[CatalogResponse], status_code=status.HTTP_201_CREATED)
async def create_catalog(
    data: CatalogCreate,
    current_user: CurrentUser = Depends(require_role(["owner", "admin", "manager"])),
    db: AsyncSession = Depends(get_db),
):
    catalog = await catalog_service.create_catalog(
        db=db, organization_id=current_user.organization_id, data=data
    )
    return ApiResponse(data=CatalogResponse.model_validate(catalog))


@router.get("/{catalog_id}", response_model=ApiResponse[CatalogResponse])
async def get_catalog_detail(
    catalog_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    catalog = await catalog_service.get_catalog(
        db=db, organization_id=current_user.organization_id, catalog_id=catalog_id
    )
    return ApiResponse(data=CatalogResponse.model_validate(catalog))


@router.patch("/{catalog_id}", response_model=ApiResponse[CatalogResponse])
async def update_catalog(
    catalog_id: str,
    data: CatalogUpdate,
    current_user: CurrentUser = Depends(require_role(["owner", "admin", "manager"])),
    db: AsyncSession = Depends(get_db),
):
    catalog = await catalog_service.update_catalog(
        db=db, organization_id=current_user.organization_id, catalog_id=catalog_id, data=data
    )
    return ApiResponse(data=CatalogResponse.model_validate(catalog))


@router.delete("/{catalog_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_catalog(
    catalog_id: str,
    current_user: CurrentUser = Depends(require_role(["owner", "admin"])),
    db: AsyncSession = Depends(get_db),
):
    await catalog_service.delete_catalog(
        db=db, organization_id=current_user.organization_id, catalog_id=catalog_id
    )
    return None
