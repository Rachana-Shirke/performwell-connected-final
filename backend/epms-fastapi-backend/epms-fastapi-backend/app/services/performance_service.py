"""
performance_service.py
Database operations for Goals, Reviews, Feedback360, and PerformanceMetrics.
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import date
import uuid

from app.models.goal import Goal
from app.models.review import Review
from app.models.feedback import Feedback360
from app.models.performance_metrics import PerformanceMetrics
from app.schemas.goal_schema import GoalCreate, GoalUpdate, GoalOut
from app.schemas.review_schema import ReviewCreate, ReviewUpdate, ReviewOut
from app.schemas.feedback_schema import FeedbackCreate, FeedbackOut
from app.config import settings
from app.utils.metrics_config import METRICS, METRIC_CATEGORIES


# ── Goals ─────────────────────────────────────────────────────────────────────

def get_goals_by_employee(employee_id: str, db: Session) -> list[GoalOut]:
    rows = db.query(Goal).filter(Goal.employee_id == employee_id)\
             .order_by(Goal.due_date).all()
    return [GoalOut.from_orm_obj(g) for g in rows]


def get_all_goals(db: Session) -> list[GoalOut]:
    rows = db.query(Goal).order_by(Goal.due_date).all()
    return [GoalOut.from_orm_obj(g) for g in rows]


def create_goal(data: GoalCreate, db: Session) -> GoalOut:
    goal = Goal(
        id=f"g_{uuid.uuid4().hex[:8]}",
        employee_id=data.employee_id,
        title=data.title,
        description=data.description or "",
        type=data.type,
        progress=data.progress,
        due_date=data.due_date,
        status=data.status,
        created_at=date.today(),
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return GoalOut.from_orm_obj(goal)


def update_goal(goal_id: str, data: GoalUpdate, db: Session) -> GoalOut:
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail=f"Goal '{goal_id}' not found")
    updates = data.model_dump(exclude_unset=True)
    # Auto-complete when progress hits 100
    if updates.get("progress") == 100 and "status" not in updates:
        from app.models.goal import GoalStatus
        updates["status"] = GoalStatus.completed
    for field, value in updates.items():
        setattr(goal, field, value)
    db.commit()
    db.refresh(goal)
    return GoalOut.from_orm_obj(goal)


def delete_goal(goal_id: str, db: Session) -> dict:
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail=f"Goal '{goal_id}' not found")
    db.delete(goal)
    db.commit()
    return {"message": "Goal deleted successfully"}


# ── Reviews ───────────────────────────────────────────────────────────────────

def get_reviews_by_employee(employee_id: str, db: Session) -> list[ReviewOut]:
    rows = db.query(Review).filter(Review.employee_id == employee_id)\
             .order_by(Review.created_at.desc().nullslast()).all()
    return [ReviewOut.from_orm_obj(r) for r in rows]


def get_all_reviews(db: Session) -> list[ReviewOut]:
    rows = db.query(Review).order_by(Review.created_at.desc().nullslast()).all()
    return [ReviewOut.from_orm_obj(r) for r in rows]


def create_review(data: ReviewCreate, db: Session) -> ReviewOut:
    review = Review(
        id=f"r_{uuid.uuid4().hex[:8]}",
        employee_id=data.employee_id,
        reviewer_id=data.reviewer_id,
        type=data.type,
        period=data.period,
        rating=data.rating,
        strengths=data.strengths,
        weaknesses=data.weaknesses,
        comments=data.comments or "",
        status=data.status,
        completed_at=data.completed_at,
        created_at=date.today(),
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return ReviewOut.from_orm_obj(review)


def update_review(review_id: str, data: ReviewUpdate, db: Session) -> ReviewOut:
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail=f"Review '{review_id}' not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(review, field, value)
    db.commit()
    db.refresh(review)
    return ReviewOut.from_orm_obj(review)


# ── Feedback ──────────────────────────────────────────────────────────────────

def get_feedback_by_employee(employee_id: str, db: Session) -> list[FeedbackOut]:
    rows = db.query(Feedback360).filter(Feedback360.employee_id == employee_id)\
             .order_by(Feedback360.date.desc()).all()
    return [FeedbackOut.from_orm_obj(f) for f in rows]


def get_all_feedback(db: Session) -> list[FeedbackOut]:
    rows = db.query(Feedback360).order_by(Feedback360.date.desc()).all()
    return [FeedbackOut.from_orm_obj(f) for f in rows]


def create_feedback(data: FeedbackCreate, db: Session) -> FeedbackOut:
    entry = Feedback360(
        id=f"f_{uuid.uuid4().hex[:8]}",
        employee_id=data.employee_id,
        from_id=data.from_id,
        from_name=data.from_name,
        type=data.type,
        rating=data.rating,
        comment=data.comment or "",
        date=data.date or date.today(),
        categories=[c.model_dump() for c in data.categories],
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return FeedbackOut.from_orm_obj(entry)


# ── Performance Metrics ───────────────────────────────────────────────────────

def get_metrics_by_employee(employee_id: str, db: Session) -> dict:
    """
    Returns enriched metrics matching the frontend's MetricCard / usePerformanceData shape:
    {
      metrics: [...enriched metric objects with currentValue, status, trend],
      categoryMetrics: { "Work Quantity": [...], ... }
    }
    """
    pm = db.query(PerformanceMetrics).filter(
        PerformanceMetrics.employee_id == employee_id
    ).first()

    # Flatten all stored rows into a lookup: {metricId: [{value, month}]}
    all_rows: list[dict] = []
    if pm:
        all_rows = (
            (pm.quantity_metrics or []) +
            (pm.quality_metrics or []) +
            (pm.efficiency_metrics or []) +
            (pm.engagement_metrics or []) +
            (pm.organizational_metrics or [])
        )

    by_metric: dict[str, list] = {}
    for row in all_rows:
        mid = row.get("metricId")
        if mid:
            if mid not in by_metric:
                by_metric[mid] = []
            by_metric[mid].append({"value": row["value"], "month": row["month"]})

    enriched = []
    for m in METRICS:
        series = sorted(by_metric.get(m["id"], []), key=lambda x: x["month"])
        latest = series[-1]["value"] if series else None
        enriched.append({
            **m,
            "currentValue": latest,
            "status": _compute_status(m, latest),
            "trend": series,
        })

    category_metrics: dict[str, list] = {}
    for m in enriched:
        cat = m["category"]
        if cat not in category_metrics:
            category_metrics[cat] = []
        category_metrics[cat].append(m)

    return {"metrics": enriched, "categoryMetrics": category_metrics}


def upsert_metric_value(employee_id: str, metric_id: str, value: float,
                        month: str, db: Session) -> dict:
    """Add or update a single metric data point for an employee."""
    pm = db.query(PerformanceMetrics).filter(
        PerformanceMetrics.employee_id == employee_id
    ).first()
    if not pm:
        pm = PerformanceMetrics(
            employee_id=employee_id,
            quantity_metrics=[], quality_metrics=[],
            efficiency_metrics=[], engagement_metrics=[],
            organizational_metrics=[],
        )
        db.add(pm)

    metric_def = next((m for m in METRICS if m["id"] == metric_id), None)
    if not metric_def:
        raise HTTPException(status_code=400, detail=f"Unknown metricId: {metric_id}")

    cat = metric_def["category"]
    col_map = {
        METRIC_CATEGORIES["WORK_QUANTITY"]:          "quantity_metrics",
        METRIC_CATEGORIES["WORK_QUALITY"]:           "quality_metrics",
        METRIC_CATEGORIES["WORK_EFFICIENCY"]:        "efficiency_metrics",
        METRIC_CATEGORIES["ENGAGEMENT_DEVELOPMENT"]: "engagement_metrics",
        METRIC_CATEGORIES["ORGANIZATIONAL"]:         "organizational_metrics",
    }
    col_name = col_map.get(cat, "quantity_metrics")
    current_list = list(getattr(pm, col_name) or [])

    existing_idx = next((i for i, r in enumerate(current_list)
                         if r.get("metricId") == metric_id and r.get("month") == month), None)
    new_row = {"metricId": metric_id, "value": value, "month": month}
    if existing_idx is not None:
        current_list[existing_idx] = new_row
    else:
        current_list.append(new_row)

    setattr(pm, col_name, current_list)
    db.commit()
    return {"metricId": metric_id, "value": value, "month": month}


# ── Internal helpers ──────────────────────────────────────────────────────────

def _compute_status(metric: dict, value) -> str:
    if value is None:
        return "warning"
    ratio = (metric["target"] / value) if metric.get("inverse") else (value / metric["target"])
    if ratio >= 0.95:
        return "good"
    if ratio >= 0.75:
        return "warning"
    return "poor"
