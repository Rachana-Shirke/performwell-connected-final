"""Employee ORM model."""

from sqlalchemy import Column, String, Float, Integer, Date, Enum as SAEnum
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class EmployeeStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    on_leave = "on_leave"


class Employee(Base):
    __tablename__ = "employees"

    id = Column(String(10), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False, unique=True)
    role = Column(String(100), nullable=False)
    department = Column(String(100), nullable=False)
    avatar = Column(String(10), nullable=True)
    join_date = Column(Date, nullable=False)
    manager_id = Column(String(10), nullable=True)  # self-ref kept simple
    performance_score = Column(Float, nullable=False, default=0.0)
    nine_box_performance = Column(Integer, nullable=False, default=2)
    nine_box_potential = Column(Integer, nullable=False, default=2)
    status = Column(SAEnum(EmployeeStatus), default=EmployeeStatus.active, nullable=False)

    # Relationships
    goals = relationship("Goal", back_populates="employee", cascade="all, delete-orphan")
    reviews = relationship("Review", foreign_keys="[Review.employee_id]",
                           back_populates="employee", cascade="all, delete-orphan")
    received_feedback = relationship("Feedback360", foreign_keys="[Feedback360.employee_id]",
                                     back_populates="employee", cascade="all, delete-orphan")
    performance_metrics = relationship("PerformanceMetrics", back_populates="employee",
                                       uselist=False, cascade="all, delete-orphan")
    ai_summaries = relationship("AISummary", back_populates="employee",
                                cascade="all, delete-orphan")
