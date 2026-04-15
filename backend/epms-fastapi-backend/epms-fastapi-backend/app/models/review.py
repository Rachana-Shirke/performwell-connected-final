"""Review ORM model."""

from sqlalchemy import Column, String, Float, Date, Enum as SAEnum, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class ReviewType(str, enum.Enum):
    manager = "Manager"
    self_review = "Self"
    peer = "Peer"


class ReviewStatus(str, enum.Enum):
    pending = "Pending"
    in_progress = "In Progress"
    completed = "Completed"


class Review(Base):
    __tablename__ = "reviews"

    id = Column(String(30), primary_key=True, index=True)
    employee_id = Column(String(10), ForeignKey("employees.id", ondelete="CASCADE"), nullable=False, index=True)
    reviewer_id = Column(String(10), ForeignKey("employees.id"), nullable=False)
    type = Column(SAEnum(ReviewType), nullable=False)
    period = Column(String(20), nullable=False)
    rating = Column(Float, nullable=False)
    strengths = Column(JSON, nullable=False, default=list)
    weaknesses = Column(JSON, nullable=False, default=list)
    comments = Column(Text, nullable=True)
    status = Column(SAEnum(ReviewStatus), nullable=False, default=ReviewStatus.pending)
    completed_at = Column(Date, nullable=True)
    created_at = Column(Date, nullable=True)

    employee = relationship("Employee", foreign_keys=[employee_id], back_populates="reviews")
    reviewer = relationship("Employee", foreign_keys=[reviewer_id])
