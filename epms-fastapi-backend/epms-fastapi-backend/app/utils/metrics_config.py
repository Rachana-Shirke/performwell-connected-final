"""
metrics_config.py
Mirrors src/utils/constants.ts from the React frontend exactly.
Used by performance_service and the AI agent.
"""

METRIC_CATEGORIES = {
    "WORK_QUANTITY":          "Work Quantity",
    "WORK_QUALITY":           "Work Quality",
    "WORK_EFFICIENCY":        "Work Efficiency",
    "ORGANIZATIONAL":         "Organizational",
    "ENGAGEMENT_DEVELOPMENT": "Engagement & Development",
}

METRICS: list[dict] = [
    # Work Quantity
    {"id": "task_completion_rate",      "name": "Task Completion Rate",           "category": "Work Quantity",          "unit": "%",     "target": 95},
    {"id": "units_produced",            "name": "Units Produced",                 "category": "Work Quantity",          "unit": "units", "target": 500},
    {"id": "number_of_sales",           "name": "Number of Sales",                "category": "Work Quantity",          "unit": "sales", "target": 50},
    {"id": "customer_calls_handled",    "name": "Customer Calls/Emails Handled",  "category": "Work Quantity",          "unit": "calls", "target": 200},
    {"id": "issue_resolution_rate",     "name": "Issue Resolution Rate",          "category": "Work Quantity",          "unit": "%",     "target": 90},
    {"id": "conversion_rate",           "name": "Conversion Rate",                "category": "Work Quantity",          "unit": "%",     "target": 25},
    # Work Quality
    {"id": "mbo_achievement",           "name": "MBO Achievement",                "category": "Work Quality",           "unit": "%",     "target": 85},
    {"id": "feedback_360_score",        "name": "360° Feedback Score",            "category": "Work Quality",           "unit": "/5",    "target": 4.2},
    {"id": "manager_appraisal_rating",  "name": "Manager Appraisal Rating",       "category": "Work Quality",           "unit": "/5",    "target": 4.0},
    {"id": "error_rate",                "name": "Error Rate",                     "category": "Work Quality",           "unit": "%",     "target": 2,   "inverse": True},
    {"id": "nps_score",                 "name": "NPS Score",                      "category": "Work Quality",           "unit": "",      "target": 70},
    {"id": "customer_return_rate",      "name": "Customer Returns/Complaints",    "category": "Work Quality",           "unit": "%",     "target": 3,   "inverse": True},
    # Work Efficiency
    {"id": "task_completion_time",      "name": "Task Completion Time",           "category": "Work Efficiency",        "unit": "hrs",   "target": 4,   "inverse": True},
    {"id": "absenteeism_rate",          "name": "Absenteeism Rate",               "category": "Work Efficiency",        "unit": "%",     "target": 3,   "inverse": True},
    {"id": "overtime_hours",            "name": "Overtime Hours",                 "category": "Work Efficiency",        "unit": "hrs",   "target": 10},
    {"id": "cost_per_task",             "name": "Cost Per Task",                  "category": "Work Efficiency",        "unit": "$",     "target": 50,  "inverse": True},
    {"id": "task_prioritization_score", "name": "Task Prioritization Score",      "category": "Work Efficiency",        "unit": "/10",   "target": 8},
    {"id": "revenue_per_employee",      "name": "Revenue Per Employee",           "category": "Work Efficiency",        "unit": "$",     "target": 150000},
    # Organizational
    {"id": "profit_per_fte",            "name": "Profit Per Employee (FTE)",      "category": "Organizational",         "unit": "$",     "target": 45000},
    {"id": "human_capital_roi",         "name": "Human Capital ROI",              "category": "Organizational",         "unit": "%",     "target": 150},
    {"id": "employee_retention_rate",   "name": "Employee Retention Rate",        "category": "Organizational",         "unit": "%",     "target": 92},
    {"id": "time_since_last_promotion", "name": "Time Since Last Promotion",      "category": "Organizational",         "unit": "months","target": 18},
    # Engagement & Development
    {"id": "engagement_score",          "name": "Engagement Score",               "category": "Engagement & Development","unit": "/10",  "target": 8.0},
    {"id": "team_collaboration_score",  "name": "Team Collaboration Score",       "category": "Engagement & Development","unit": "/10",  "target": 8.5},
    {"id": "ld_participation",          "name": "L&D Participation",              "category": "Engagement & Development","unit": "%",    "target": 80},
    {"id": "skill_gap_closure_rate",    "name": "Skill Gap Closure Rate",         "category": "Engagement & Development","unit": "%",    "target": 75},
]
