"""
seed.py — Populates PostgreSQL with the exact same data from the frontend's
          src/utils/mockData.ts so the UI works immediately after switching.

Run:  python seed.py
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from datetime import date
from app.database import SessionLocal, create_all_tables
from app.models.employee import Employee, EmployeeStatus
from app.models.goal import Goal, GoalType, GoalStatus
from app.models.review import Review, ReviewType, ReviewStatus
from app.models.feedback import Feedback360, FeedbackType
from app.models.performance_metrics import PerformanceMetrics
from app.models.ai_summary import AISummary

# ── Seed data (mirrors mockData.ts exactly) ────────────────────────────────────

EMPLOYEES = [
    dict(id="e1", name="Sarah Chen",      email="sarah.chen@acme.co",   role="Senior Engineer",
         department="Engineering", avatar="SC", join_date=date(2021, 3, 15),
         manager_id=None, performance_score=4.3, nine_box_performance=3, nine_box_potential=3),
    dict(id="e2", name="James Wilson",    email="james.wilson@acme.co",  role="Product Manager",
         department="Product",     avatar="JW", join_date=date(2020, 8, 1),
         manager_id="e1", performance_score=3.8, nine_box_performance=2, nine_box_potential=3),
    dict(id="e3", name="Priya Patel",     email="priya.patel@acme.co",   role="UX Designer",
         department="Design",      avatar="PP", join_date=date(2022, 1, 10),
         manager_id="e1", performance_score=4.5, nine_box_performance=3, nine_box_potential=2),
    dict(id="e4", name="Marcus Johnson",  email="marcus.j@acme.co",      role="Data Analyst",
         department="Analytics",   avatar="MJ", join_date=date(2021, 11, 20),
         manager_id="e2", performance_score=3.2, nine_box_performance=2, nine_box_potential=2),
    dict(id="e5", name="Elena Rodriguez", email="elena.r@acme.co",       role="HR Manager",
         department="HR",          avatar="ER", join_date=date(2019, 6, 5),
         manager_id=None, performance_score=4.1, nine_box_performance=3, nine_box_potential=2),
    dict(id="e6", name="David Kim",       email="david.kim@acme.co",     role="Frontend Developer",
         department="Engineering", avatar="DK", join_date=date(2022, 7, 12),
         manager_id="e1", performance_score=3.6, nine_box_performance=2, nine_box_potential=3),
]

GOALS = [
    dict(id="g1", employee_id="e1", title="Increase system uptime to 99.9%",
         description="Improve infrastructure reliability and monitoring",
         type=GoalType.KPI, progress=78,  due_date=date(2026, 6, 30),
         status=GoalStatus.on_track,  created_at=date(2026, 1, 1)),
    dict(id="g2", employee_id="e1", title="Lead Q2 architecture review",
         description="Conduct comprehensive review of microservices architecture",
         type=GoalType.OKR, progress=45,  due_date=date(2026, 4, 30),
         status=GoalStatus.at_risk,   created_at=date(2026, 1, 15)),
    dict(id="g3", employee_id="e2", title="Launch v2.0 product features",
         description="Ship 5 major features for Q2 release",
         type=GoalType.KRA, progress=60,  due_date=date(2026, 5, 31),
         status=GoalStatus.on_track,  created_at=date(2026, 1, 1)),
    dict(id="g4", employee_id="e3", title="Redesign onboarding flow",
         description="Improve user onboarding conversion by 20%",
         type=GoalType.MBO, progress=92,  due_date=date(2026, 4, 15),
         status=GoalStatus.on_track,  created_at=date(2025, 12, 1)),
    dict(id="g5", employee_id="e4", title="Build predictive analytics dashboard",
         description="Create ML-powered insights for sales team",
         type=GoalType.KPI, progress=30,  due_date=date(2026, 7, 31),
         status=GoalStatus.behind,    created_at=date(2026, 2, 1)),
    dict(id="g6", employee_id="e1", title="Mentor 3 junior developers",
         description="Provide weekly 1:1s and code reviews",
         type=GoalType.KRA, progress=65,  due_date=date(2026, 12, 31),
         status=GoalStatus.on_track,  created_at=date(2026, 1, 1)),
    dict(id="g7", employee_id="e5", title="Reduce time-to-hire by 15%",
         description="Streamline recruitment process",
         type=GoalType.MBO, progress=100, due_date=date(2026, 3, 31),
         status=GoalStatus.completed, created_at=date(2025, 10, 1)),
    dict(id="g8", employee_id="e6", title="Achieve 90% test coverage",
         description="Write unit and integration tests for all components",
         type=GoalType.KPI, progress=55,  due_date=date(2026, 6, 30),
         status=GoalStatus.at_risk,   created_at=date(2026, 1, 15)),
]

REVIEWS = [
    dict(id="r1", employee_id="e1", reviewer_id="e5", type=ReviewType.manager,
         period="Q1 2026", rating=4.3,
         strengths=["Technical leadership", "Mentorship", "Problem solving"],
         weaknesses=["Delegation", "Documentation"],
         comments="Sarah continues to exceed expectations in technical delivery. "
                  "Should focus on delegating more to grow the team.",
         status=ReviewStatus.completed, completed_at=date(2026, 3, 20), created_at=date(2026, 3, 20)),
    dict(id="r2", employee_id="e1", reviewer_id="e1", type=ReviewType.self_review,
         period="Q1 2026", rating=4.0,
         strengths=["System design", "Code quality"],
         weaknesses=["Work-life balance", "Saying no"],
         comments="I feel I have contributed strongly to architecture decisions "
                  "but need to improve on setting boundaries.",
         status=ReviewStatus.completed, completed_at=date(2026, 3, 18), created_at=date(2026, 3, 18)),
    dict(id="r3", employee_id="e2", reviewer_id="e1", type=ReviewType.manager,
         period="Q1 2026", rating=3.8,
         strengths=["Stakeholder management", "Strategic thinking"],
         weaknesses=["Data-driven decisions", "Sprint planning"],
         comments="James has improved significantly in stakeholder communication. "
                  "Data analysis skills need development.",
         status=ReviewStatus.completed, completed_at=date(2026, 3, 22), created_at=date(2026, 3, 22)),
    dict(id="r4", employee_id="e3", reviewer_id="e1", type=ReviewType.manager,
         period="Q1 2026", rating=4.5,
         strengths=["Design systems", "User research", "Prototyping"],
         weaknesses=["Presenting to executives"],
         comments="Priya is one of our strongest designers. Her onboarding redesign "
                  "showed exceptional user empathy.",
         status=ReviewStatus.completed, completed_at=date(2026, 3, 21), created_at=date(2026, 3, 21)),
    dict(id="r5", employee_id="e4", reviewer_id="e2", type=ReviewType.manager,
         period="Q1 2026", rating=3.2,
         strengths=["SQL proficiency", "Attention to detail"],
         weaknesses=["Communication", "Proactiveness", "Deadline management"],
         comments="Marcus produces accurate work but needs to communicate blockers "
                  "earlier and take more initiative.",
         status=ReviewStatus.in_progress, completed_at=None, created_at=date(2026, 3, 1)),
    dict(id="r6", employee_id="e6", reviewer_id="e1", type=ReviewType.manager,
         period="Q1 2026", rating=3.6,
         strengths=["React expertise", "Learning speed"],
         weaknesses=["Testing", "Code reviews"],
         comments="David shows great potential. Focus areas: testing practices "
                  "and providing more thorough code reviews.",
         status=ReviewStatus.pending, completed_at=None, created_at=date(2026, 3, 1)),
]

FEEDBACK = [
    dict(id="f1", employee_id="e1", from_id="e2", from_name="James Wilson",
         type=FeedbackType.peer, rating=4.5, date=date(2026, 3, 15),
         comment="Sarah is an exceptional technical leader. Always available to help "
                 "and provides clear direction.",
         categories=[{"name": "Leadership", "score": 5}, {"name": "Communication", "score": 4},
                     {"name": "Technical Skills", "score": 5}, {"name": "Collaboration", "score": 4}]),
    dict(id="f2", employee_id="e1", from_id="e3", from_name="Priya Patel",
         type=FeedbackType.peer, rating=4.2, date=date(2026, 3, 14),
         comment="Great at breaking down complex problems. Sometimes moves too fast for the team.",
         categories=[{"name": "Leadership", "score": 4}, {"name": "Communication", "score": 4},
                     {"name": "Technical Skills", "score": 5}, {"name": "Collaboration", "score": 4}]),
    dict(id="f3", employee_id="e1", from_id="e6", from_name="David Kim",
         type=FeedbackType.direct_report, rating=4.6, date=date(2026, 3, 16),
         comment="Best manager I have had. Invests in my growth and provides constructive feedback.",
         categories=[{"name": "Leadership", "score": 5}, {"name": "Communication", "score": 5},
                     {"name": "Technical Skills", "score": 4}, {"name": "Collaboration", "score": 5}]),
    dict(id="f4", employee_id="e1", from_id="e5", from_name="Elena Rodriguez",
         type=FeedbackType.manager, rating=4.3, date=date(2026, 3, 20),
         comment="Sarah demonstrates strong leadership and technical acumen. "
                 "Continue to develop cross-functional influence.",
         categories=[{"name": "Leadership", "score": 4}, {"name": "Communication", "score": 4},
                     {"name": "Technical Skills", "score": 5}, {"name": "Collaboration", "score": 4}]),
    dict(id="f5", employee_id="e2", from_id="e1", from_name="Sarah Chen",
         type=FeedbackType.manager, rating=3.8, date=date(2026, 3, 18),
         comment="James has good product instincts. Needs to strengthen analytical rigor.",
         categories=[{"name": "Leadership", "score": 3}, {"name": "Communication", "score": 4},
                     {"name": "Technical Skills", "score": 3}, {"name": "Collaboration", "score": 5}]),
    dict(id="f6", employee_id="e3", from_id="e2", from_name="James Wilson",
         type=FeedbackType.peer, rating=4.7, date=date(2026, 3, 17),
         comment="Priya brings incredible design thinking. Her prototypes always exceed expectations.",
         categories=[{"name": "Leadership", "score": 4}, {"name": "Communication", "score": 5},
                     {"name": "Technical Skills", "score": 5}, {"name": "Collaboration", "score": 5}]),
]

# Metric values for Sarah Chen (e1) — full dataset from mockData.ts
E1_METRICS = {
    "quantity_metrics": [
        {"metricId": "task_completion_rate",    "value": 94,  "month": "2026-01"},
        {"metricId": "task_completion_rate",    "value": 96,  "month": "2026-02"},
        {"metricId": "task_completion_rate",    "value": 97,  "month": "2026-03"},
        {"metricId": "units_produced",          "value": 480, "month": "2026-01"},
        {"metricId": "units_produced",          "value": 510, "month": "2026-02"},
        {"metricId": "units_produced",          "value": 525, "month": "2026-03"},
        {"metricId": "number_of_sales",         "value": 42,  "month": "2026-01"},
        {"metricId": "number_of_sales",         "value": 48,  "month": "2026-02"},
        {"metricId": "number_of_sales",         "value": 53,  "month": "2026-03"},
        {"metricId": "customer_calls_handled",  "value": 185, "month": "2026-01"},
        {"metricId": "customer_calls_handled",  "value": 210, "month": "2026-02"},
        {"metricId": "customer_calls_handled",  "value": 198, "month": "2026-03"},
        {"metricId": "issue_resolution_rate",   "value": 88,  "month": "2026-01"},
        {"metricId": "issue_resolution_rate",   "value": 91,  "month": "2026-02"},
        {"metricId": "issue_resolution_rate",   "value": 93,  "month": "2026-03"},
        {"metricId": "conversion_rate",         "value": 22,  "month": "2026-01"},
        {"metricId": "conversion_rate",         "value": 24,  "month": "2026-02"},
        {"metricId": "conversion_rate",         "value": 26,  "month": "2026-03"},
    ],
    "quality_metrics": [
        {"metricId": "mbo_achievement",          "value": 80,  "month": "2026-01"},
        {"metricId": "mbo_achievement",          "value": 83,  "month": "2026-02"},
        {"metricId": "mbo_achievement",          "value": 87,  "month": "2026-03"},
        {"metricId": "feedback_360_score",       "value": 4.1, "month": "2026-01"},
        {"metricId": "feedback_360_score",       "value": 4.2, "month": "2026-02"},
        {"metricId": "feedback_360_score",       "value": 4.4, "month": "2026-03"},
        {"metricId": "manager_appraisal_rating", "value": 4.0, "month": "2026-01"},
        {"metricId": "manager_appraisal_rating", "value": 4.1, "month": "2026-02"},
        {"metricId": "manager_appraisal_rating", "value": 4.3, "month": "2026-03"},
        {"metricId": "error_rate",               "value": 3.2, "month": "2026-01"},
        {"metricId": "error_rate",               "value": 2.8, "month": "2026-02"},
        {"metricId": "error_rate",               "value": 2.1, "month": "2026-03"},
        {"metricId": "nps_score",                "value": 62,  "month": "2026-01"},
        {"metricId": "nps_score",                "value": 68,  "month": "2026-02"},
        {"metricId": "nps_score",                "value": 72,  "month": "2026-03"},
        {"metricId": "customer_return_rate",     "value": 4.1, "month": "2026-01"},
        {"metricId": "customer_return_rate",     "value": 3.5, "month": "2026-02"},
        {"metricId": "customer_return_rate",     "value": 2.8, "month": "2026-03"},
    ],
    "efficiency_metrics": [
        {"metricId": "task_completion_time",      "value": 5.2,   "month": "2026-01"},
        {"metricId": "task_completion_time",      "value": 4.8,   "month": "2026-02"},
        {"metricId": "task_completion_time",      "value": 4.1,   "month": "2026-03"},
        {"metricId": "absenteeism_rate",          "value": 3.5,   "month": "2026-01"},
        {"metricId": "absenteeism_rate",          "value": 2.8,   "month": "2026-02"},
        {"metricId": "absenteeism_rate",          "value": 2.2,   "month": "2026-03"},
        {"metricId": "overtime_hours",            "value": 12,    "month": "2026-01"},
        {"metricId": "overtime_hours",            "value": 8,     "month": "2026-02"},
        {"metricId": "overtime_hours",            "value": 10,    "month": "2026-03"},
        {"metricId": "cost_per_task",             "value": 62,    "month": "2026-01"},
        {"metricId": "cost_per_task",             "value": 55,    "month": "2026-02"},
        {"metricId": "cost_per_task",             "value": 48,    "month": "2026-03"},
        {"metricId": "task_prioritization_score", "value": 7.5,   "month": "2026-01"},
        {"metricId": "task_prioritization_score", "value": 8.0,   "month": "2026-02"},
        {"metricId": "task_prioritization_score", "value": 8.3,   "month": "2026-03"},
        {"metricId": "revenue_per_employee",      "value": 135000,"month": "2026-01"},
        {"metricId": "revenue_per_employee",      "value": 142000,"month": "2026-02"},
        {"metricId": "revenue_per_employee",      "value": 155000,"month": "2026-03"},
    ],
    "organizational_metrics": [
        {"metricId": "profit_per_fte",            "value": 38000, "month": "2026-01"},
        {"metricId": "profit_per_fte",            "value": 42000, "month": "2026-02"},
        {"metricId": "profit_per_fte",            "value": 47000, "month": "2026-03"},
        {"metricId": "human_capital_roi",         "value": 135,   "month": "2026-01"},
        {"metricId": "human_capital_roi",         "value": 142,   "month": "2026-02"},
        {"metricId": "human_capital_roi",         "value": 155,   "month": "2026-03"},
        {"metricId": "employee_retention_rate",   "value": 90,    "month": "2026-01"},
        {"metricId": "employee_retention_rate",   "value": 91,    "month": "2026-02"},
        {"metricId": "employee_retention_rate",   "value": 93,    "month": "2026-03"},
        {"metricId": "time_since_last_promotion", "value": 14,    "month": "2026-01"},
        {"metricId": "time_since_last_promotion", "value": 15,    "month": "2026-02"},
        {"metricId": "time_since_last_promotion", "value": 16,    "month": "2026-03"},
    ],
    "engagement_metrics": [
        {"metricId": "engagement_score",          "value": 7.6, "month": "2026-01"},
        {"metricId": "engagement_score",          "value": 7.9, "month": "2026-02"},
        {"metricId": "engagement_score",          "value": 8.2, "month": "2026-03"},
        {"metricId": "team_collaboration_score",  "value": 8.0, "month": "2026-01"},
        {"metricId": "team_collaboration_score",  "value": 8.2, "month": "2026-02"},
        {"metricId": "team_collaboration_score",  "value": 8.6, "month": "2026-03"},
        {"metricId": "ld_participation",          "value": 72,  "month": "2026-01"},
        {"metricId": "ld_participation",          "value": 78,  "month": "2026-02"},
        {"metricId": "ld_participation",          "value": 82,  "month": "2026-03"},
        {"metricId": "skill_gap_closure_rate",    "value": 65,  "month": "2026-01"},
        {"metricId": "skill_gap_closure_rate",    "value": 70,  "month": "2026-02"},
        {"metricId": "skill_gap_closure_rate",    "value": 76,  "month": "2026-03"},
    ],
}


def seed():
    print("[Seed] Connecting to database…")
    create_all_tables()
    db = SessionLocal()

    try:
        # Employees
        print("[Seed] Seeding employees…")
        for data in EMPLOYEES:
            if not db.query(Employee).filter(Employee.id == data["id"]).first():
                db.add(Employee(**data, status=EmployeeStatus.active))
        db.commit()

        # Goals
        print("[Seed] Seeding goals…")
        for data in GOALS:
            if not db.query(Goal).filter(Goal.id == data["id"]).first():
                db.add(Goal(**data))
        db.commit()

        # Reviews
        print("[Seed] Seeding reviews…")
        for data in REVIEWS:
            if not db.query(Review).filter(Review.id == data["id"]).first():
                db.add(Review(**data))
        db.commit()

        # Feedback
        print("[Seed] Seeding feedback…")
        for data in FEEDBACK:
            if not db.query(Feedback360).filter(Feedback360.id == data["id"]).first():
                db.add(Feedback360(**data))
        db.commit()

        # Performance metrics for e1
        print("[Seed] Seeding performance metrics for Sarah Chen (e1)…")
        if not db.query(PerformanceMetrics).filter(
            PerformanceMetrics.employee_id == "e1"
        ).first():
            db.add(PerformanceMetrics(employee_id="e1", **E1_METRICS))
            db.commit()

        print("\n[Seed] ✅ Database seeded successfully!")
        print("       You can now start the server:  uvicorn app.main:app --reload")

    except Exception as e:
        db.rollback()
        print(f"[Seed] ❌ Error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
