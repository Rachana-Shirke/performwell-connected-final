"""PerformanceMetrics ORM model — stores per-employee metric values in JSON columns."""

from sqlalchemy import Column, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base


class PerformanceMetrics(Base):
    __tablename__ = "performance_metrics"

    employee_id = Column(String(10), ForeignKey("employees.id", ondelete="CASCADE"),
                         primary_key=True, index=True)

    # Each column stores a list of {metricId, value, month} objects
    quantity_metrics = Column(JSON, nullable=False, default=list)
    quality_metrics = Column(JSON, nullable=False, default=list)
    efficiency_metrics = Column(JSON, nullable=False, default=list)
    engagement_metrics = Column(JSON, nullable=False, default=list)
    organizational_metrics = Column(JSON, nullable=False, default=list)

    employee = relationship("Employee", back_populates="performance_metrics")
