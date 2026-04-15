"""Metrics and Analytics routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.services import performance_service, analytics_service

router = APIRouter(tags=["Metrics & Analytics"])


class MetricUpsertRequest(BaseModel):
    employee_id: str
    metric_id: str
    value: float
    month: str  # "YYYY-MM"


# ── Metrics ───────────────────────────────────────────────────────────────────

@router.get("/api/metrics/departments", summary="Department performance")
def get_department_performance(db: Session = Depends(get_db)):
    data = analytics_service.get_department_performance(db)
    return {"success": True, "data": data}


@router.get("/api/metrics/{employee_id}", summary="Enriched metrics for one employee")
def get_metrics(employee_id: str, db: Session = Depends(get_db)):
    data = performance_service.get_metrics_by_employee(employee_id, db)
    return {"success": True, "data": data}


@router.post("/api/metrics", summary="Upsert a metric value")
def upsert_metric(req: MetricUpsertRequest, db: Session = Depends(get_db)):
    result = performance_service.upsert_metric_value(
        req.employee_id, req.metric_id, req.value, req.month, db
    )
    return {"success": True, "data": result}


# ── Analytics ─────────────────────────────────────────────────────────────────

@router.get("/api/analytics/{employee_id}", summary="Full analytics payload for employee")
def get_analytics(employee_id: str, db: Session = Depends(get_db)):
    data = analytics_service.get_analytics(employee_id, db)
    return {"success": True, "data": data}
