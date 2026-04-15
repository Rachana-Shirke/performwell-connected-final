"""Pydantic schemas for Employee — exact shape the frontend expects."""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date
from enum import Enum


class EmployeeStatus(str, Enum):
    active = "active"
    inactive = "inactive"
    on_leave = "on_leave"


class NineBoxPosition(BaseModel):
    performance: int = Field(..., ge=1, le=3)
    potential: int = Field(..., ge=1, le=3)


# ── Request bodies ────────────────────────────────────────────────────────────

class EmployeeCreate(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str
    department: str
    avatar: Optional[str] = None
    join_date: date
    manager_id: Optional[str] = None
    performance_score: float = 0.0
    nine_box_performance: int = Field(2, ge=1, le=3)
    nine_box_potential: int = Field(2, ge=1, le=3)
    status: EmployeeStatus = EmployeeStatus.active


class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    department: Optional[str] = None
    avatar: Optional[str] = None
    join_date: Optional[date] = None
    manager_id: Optional[str] = None
    performance_score: Optional[float] = None
    nine_box_performance: Optional[int] = Field(None, ge=1, le=3)
    nine_box_potential: Optional[int] = Field(None, ge=1, le=3)
    status: Optional[EmployeeStatus] = None


# ── Response ──────────────────────────────────────────────────────────────────

class EmployeeOut(BaseModel):
    id: str
    name: str
    email: str
    role: str
    department: str
    avatar: Optional[str] = None
    joinDate: str                      # frontend expects camelCase joinDate
    managerId: Optional[str] = None
    performanceScore: float
    status: str
    nineBoxPosition: NineBoxPosition

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_obj(cls, emp) -> "EmployeeOut":
        return cls(
            id=emp.id,
            name=emp.name,
            email=emp.email,
            role=emp.role,
            department=emp.department,
            avatar=emp.avatar,
            joinDate=str(emp.join_date),
            managerId=emp.manager_id,
            performanceScore=emp.performance_score,
            status=emp.status.value if hasattr(emp.status, "value") else emp.status,
            nineBoxPosition=NineBoxPosition(
                performance=emp.nine_box_performance,
                potential=emp.nine_box_potential,
            ),
        )
