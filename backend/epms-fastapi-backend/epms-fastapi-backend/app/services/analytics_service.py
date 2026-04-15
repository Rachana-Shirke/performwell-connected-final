"""
analytics_service.py
Derives analytics-layer data from the PostgreSQL tables.
Powers GET /api/analytics/{employee_id} and department-level charts.
"""

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.employee import Employee
from app.models.goal import Goal, GoalStatus
from app.models.review import Review, ReviewStatus
from app.models.feedback import Feedback360
from app.models.performance_metrics import PerformanceMetrics
from app.services.performance_service import get_metrics_by_employee


def get_analytics(employee_id: str, db: Session) -> dict:
    """
    Returns a rich analytics payload for the given employee.
    Used by the Analytics page and Dashboard trend charts.
    """
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp:
        return {}

    # Goals summary
    goals = db.query(Goal).filter(Goal.employee_id == employee_id).all()
    goals_summary = {
        "total":     len(goals),
        "completed": sum(1 for g in goals if g.status == GoalStatus.completed),
        "on_track":  sum(1 for g in goals if g.status.value == "On Track"),
        "at_risk":   sum(1 for g in goals if g.status.value == "At Risk"),
        "behind":    sum(1 for g in goals if g.status.value == "Behind"),
        "avg_progress": round(
            sum(g.progress for g in goals) / len(goals), 1
        ) if goals else 0,
    }

    # Reviews summary
    reviews = db.query(Review).filter(Review.employee_id == employee_id).all()
    completed_reviews = [r for r in reviews if r.status == ReviewStatus.completed]
    reviews_summary = {
        "total":     len(reviews),
        "completed": len(completed_reviews),
        "avg_rating": round(
            sum(r.rating for r in completed_reviews) / len(completed_reviews), 2
        ) if completed_reviews else None,
    }

    # Feedback summary
    feedback = db.query(Feedback360).filter(Feedback360.employee_id == employee_id).all()
    feedback_summary = {
        "total": len(feedback),
        "avg_rating": round(
            sum(f.rating for f in feedback) / len(feedback), 2
        ) if feedback else None,
        "by_type": {
            "Peer":          sum(1 for f in feedback if f.type.value == "Peer"),
            "Manager":       sum(1 for f in feedback if f.type.value == "Manager"),
            "Direct Report": sum(1 for f in feedback if f.type.value == "Direct Report"),
        },
    }

    # Metrics
    metrics_data = get_metrics_by_employee(employee_id, db)

    # Performance trend (derived from metric values)
    trend_data = _build_trend_data(metrics_data["metrics"])

    # Department comparison
    dept_data = get_department_performance(db)

    return {
        "employeeId":       employee_id,
        "employeeName":     emp.name,
        "department":       emp.department,
        "performanceScore": emp.performance_score,
        "goalsSummary":     goals_summary,
        "reviewsSummary":   reviews_summary,
        "feedbackSummary":  feedback_summary,
        "trendData":        trend_data,
        "departmentPerformance": dept_data,
        "metrics":          metrics_data["metrics"],
        "categoryMetrics":  metrics_data["categoryMetrics"],
    }


def get_department_performance(db: Session) -> list[dict]:
    """
    Aggregates live department-level performance from the employees table.
    Replaces the static departmentPerformance mock array.
    """
    rows = db.query(
        Employee.department,
        func.avg(Employee.performance_score).label("avg_score"),
        func.count(Employee.id).label("headcount"),
    ).filter(Employee.status == "active").group_by(Employee.department).all()

    result = []
    for row in rows:
        result.append({
            "department": row.department,
            "avgScore":   round(float(row.avg_score), 2) if row.avg_score else 0.0,
            "headcount":  row.headcount,
            # Retention is stored per-employee in a future extension;
            # we provide a sensible default until then.
            "retention": 90.0,
        })
    return sorted(result, key=lambda x: x["department"])


def _build_trend_data(metrics: list[dict]) -> list[dict]:
    """
    Builds a month-by-month trend table for the three key metrics
    the frontend charts use: task_completion_rate, mbo_achievement, engagement_score.
    """
    key_ids = ["task_completion_rate", "mbo_achievement", "engagement_score"]
    key_metrics = {m["id"]: m for m in metrics if m["id"] in key_ids}

    # Collect all months present
    all_months: set[str] = set()
    for m in key_metrics.values():
        for t in m.get("trend", []):
            all_months.add(t["month"])

    month_labels = {
        "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
        "05": "May", "06": "Jun", "07": "Jul", "08": "Aug",
        "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec",
    }

    rows = []
    for month in sorted(all_months):
        row = {"month": month_labels.get(month[-2:], month)}
        for mid in key_ids:
            m = key_metrics.get(mid)
            if m:
                entry = next((t for t in m.get("trend", []) if t["month"] == month), None)
                row[m["name"]] = entry["value"] if entry else 0
        rows.append(row)
    return rows
