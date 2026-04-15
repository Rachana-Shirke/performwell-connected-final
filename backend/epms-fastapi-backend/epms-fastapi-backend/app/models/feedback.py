"""Feedback360 ORM model."""

from sqlalchemy import Column, String, Float, Date, Enum as SAEnum, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class FeedbackType(str, enum.Enum):
    peer = "Peer"
    manager = "Manager"
    direct_report = "Direct Report"


class Feedback360(Base):
    __tablename__ = "feedback360"

    id = Column(String(30), primary_key=True, index=True)
    employee_id = Column(String(10), ForeignKey("employees.id", ondelete="CASCADE"), nullable=False, index=True)
    from_id = Column(String(10), nullable=False)
    from_name = Column(String(100), nullable=False)
    type = Column(SAEnum(FeedbackType), nullable=False)
    rating = Column(Float, nullable=False)
    comment = Column(Text, nullable=True)
    date = Column(Date, nullable=False)
    categories = Column(JSON, nullable=False, default=list)  # [{"name": str, "score": float}]

    employee = relationship("Employee", foreign_keys=[employee_id], back_populates="received_feedback")
