"""Pydantic schemas for Goal."""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from enum import Enum


class GoalType(str, Enum):
    KPI = "KPI"
    KRA = "KRA"
    OKR = "OKR"
    MBO = "MBO"


class GoalStatus(str, Enum):
    on_track = "On Track"
    at_risk = "At Risk"
    behind = "Behind"
    completed = "Completed"


class GoalCreate(BaseModel):
    employee_id: str
    title: str
    description: Optional[str] = ""
    type: GoalType = GoalType.KPI
    progress: int = Field(0, ge=0, le=100)
    due_date: date
    status: GoalStatus = GoalStatus.on_track


class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[GoalType] = None
    progress: Optional[int] = Field(None, ge=0, le=100)
    due_date: Optional[date] = None
    status: Optional[GoalStatus] = None


class GoalOut(BaseModel):
    id: str
    employeeId: str
    title: str
    description: str
    type: str
    progress: int
    dueDate: str
    status: str
    createdAt: Optional[str] = None

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_obj(cls, g) -> "GoalOut":
        return cls(
            id=g.id,
            employeeId=g.employee_id,
            title=g.title,
            description=g.description or "",
            type=g.type.value if hasattr(g.type, "value") else g.type,
            progress=g.progress,
            dueDate=str(g.due_date),
            status=g.status.value if hasattr(g.status, "value") else g.status,
            createdAt=str(g.created_at) if g.created_at else None,
        )
