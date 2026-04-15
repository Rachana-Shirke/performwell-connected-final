"""Pydantic schemas for Feedback360."""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date
from enum import Enum


class FeedbackType(str, Enum):
    peer = "Peer"
    manager = "Manager"
    direct_report = "Direct Report"


class CategoryScore(BaseModel):
    name: str
    score: float = Field(..., ge=0, le=5)


class FeedbackCreate(BaseModel):
    employee_id: str
    from_id: str
    from_name: str
    type: FeedbackType
    rating: float = Field(..., ge=0, le=5)
    comment: Optional[str] = ""
    date: Optional[date] = None
    categories: List[CategoryScore] = []


class FeedbackOut(BaseModel):
    id: str
    employeeId: str
    fromId: str
    fromName: str
    type: str
    rating: float
    comment: str
    date: str
    categories: List[CategoryScore]

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_obj(cls, f) -> "FeedbackOut":
        cats = f.categories or []
        if cats and isinstance(cats[0], dict):
            cats = [CategoryScore(**c) for c in cats]
        return cls(
            id=f.id,
            employeeId=f.employee_id,
            fromId=f.from_id,
            fromName=f.from_name,
            type=f.type.value if hasattr(f.type, "value") else f.type,
            rating=f.rating,
            comment=f.comment or "",
            date=str(f.date),
            categories=cats,
        )
