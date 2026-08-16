"""
User, Organization, and Member Schemas
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserBase(BaseModel):
    email: EmailStr
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None


class UserCreate(UserBase):
    firebase_uid: str


class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None


class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    firebase_uid: str
    email_verified: bool = False
    status: str = "active"
    last_login_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime


class OrganizationBase(BaseModel):
    name: str
    slug: str


class OrganizationUpdate(BaseModel):
    name: Optional[str] = None


class OrganizationResponse(OrganizationBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    status: str = "active"
    plan: str = "enterprise"
    created_at: datetime
    updated_at: datetime


class MemberCreate(BaseModel):
    email: EmailStr
    role: str = "manager"  # owner, admin, manager, analyst, reviewer, viewer


class MemberResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    organization_id: str
    user_id: str
    role: str
    status: str
    user: Optional[UserResponse] = None
    created_at: datetime
