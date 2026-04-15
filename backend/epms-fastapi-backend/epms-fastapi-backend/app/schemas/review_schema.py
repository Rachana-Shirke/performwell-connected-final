"""Pydantic schemas for Review."""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date
from enum import Enum


class ReviewType(str, Enum):
    manager = "Manager"
    self_review = "Self"
    peer = "Peer"


class ReviewStatus(str, Enum):
    pending = "Pending"
    in_progress = "In Progress"
    completed = "Completed"


class ReviewCreate(BaseModel):
    employee_id: str
    reviewer_id: str
    type: ReviewType
    period: str
    rating: float = Field(..., ge=0, le=5)
    strengths: List[str] = []
    weaknesses: List[str] = []
    comments: Optional[str] = ""
    status: ReviewStatus = ReviewStatus.pending
    completed_at: Optional[date] = None


class ReviewUpdate(BaseModel):
    rating: Optional[float] = Field(None, ge=0, le=5)
    strengths: Optional[List[str]] = None
    weaknesses: Optional[List[str]] = None
    comments: Optional[str] = None
    status: Optional[ReviewStatus] = None
    completed_at: Optional[date] = None


class ReviewOut(BaseModel):
    id: str
    employeeId: str
    reviewerId: str
    type: str
    period: str
    rating: float
    strengths: List[str]
    weaknesses: List[str]
    comments: str
    status: str
    completedAt: Optional[str] = None

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_obj(cls, r) -> "ReviewOut":
        return cls(
            id=r.id,
            employeeId=r.employee_id,
            reviewerId=r.reviewer_id,
            type=r.type.value if hasattr(r.type, "value") else r.type,
            period=r.period,
            rating=r.rating,
            strengths=r.strengths or [],
            weaknesses=r.weaknesses or [],
            comments=r.comments or "",
            status=r.status.value if hasattr(r.status, "value") else r.status,
            completedAt=str(r.completed_at) if r.completed_at else None,
        )
