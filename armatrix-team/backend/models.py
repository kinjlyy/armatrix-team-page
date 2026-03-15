from pydantic import BaseModel, HttpUrl
from typing import Optional


class TeamMemberBase(BaseModel):
    name: str
    role: str
    bio: str
    photo_url: str
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    twitter_url: Optional[str] = None


class TeamMemberCreate(TeamMemberBase):
    pass


class TeamMemberUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    twitter_url: Optional[str] = None


class TeamMember(TeamMemberBase):
    id: int

    class Config:
        from_attributes = True
