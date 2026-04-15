"""Import all models so SQLAlchemy discovers them for create_all."""
from app.models.employee import Employee, EmployeeStatus
from app.models.goal import Goal, GoalType, GoalStatus
from app.models.review import Review, ReviewType, ReviewStatus
from app.models.feedback import Feedback360, FeedbackType
from app.models.performance_metrics import PerformanceMetrics
from app.models.ai_summary import AISummary

__all__ = [
    "Employee", "EmployeeStatus",
    "Goal", "GoalType", "GoalStatus",
    "Review", "ReviewType", "ReviewStatus",
    "Feedback360", "FeedbackType",
    "PerformanceMetrics",
    "AISummary",
]
