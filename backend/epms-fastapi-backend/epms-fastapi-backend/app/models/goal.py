"""Goal ORM model."""

from sqlalchemy import Column, String, Integer, Date, Enum as SAEnum, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class GoalType(str, enum.Enum):
    KPI = "KPI"
    KRA = "KRA"
    OKR = "OKR"
    MBO = "MBO"


class GoalStatus(str, enum.Enum):
    on_track = "On Track"
    at_risk = "At Risk"
    behind = "Behind"
    completed = "Completed"


class Goal(Base):
    __tablename__ = "goals"

    id = Column(String(30), primary_key=True, index=True)
    employee_id = Column(String(10), ForeignKey("employees.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    type = Column(SAEnum(GoalType), nullable=False, default=GoalType.KPI)
    progress = Column(Integer, nullable=False, default=0)
    due_date = Column(Date, nullable=False)
    status = Column(SAEnum(GoalStatus), nullable=False, default=GoalStatus.on_track)
    created_at = Column(Date, nullable=True)

    employee = relationship("Employee", back_populates="goals")
