export const METRIC_CATEGORIES = {
  WORK_QUANTITY: 'Work Quantity',
  WORK_QUALITY: 'Work Quality',
  WORK_EFFICIENCY: 'Work Efficiency',
  ORGANIZATIONAL: 'Organizational',
  ENGAGEMENT_DEVELOPMENT: 'Engagement & Development',
} as const;

export const METRICS = [
  { id: 'task_completion_rate', name: 'Task Completion Rate', category: METRIC_CATEGORIES.WORK_QUANTITY, unit: '%', target: 95 },
  { id: 'units_produced', name: 'Units Produced', category: METRIC_CATEGORIES.WORK_QUANTITY, unit: 'units', target: 500 },
  { id: 'number_of_sales', name: 'Number of Sales', category: METRIC_CATEGORIES.WORK_QUANTITY, unit: 'sales', target: 50 },
  { id: 'customer_calls_handled', name: 'Customer Calls/Emails Handled', category: METRIC_CATEGORIES.WORK_QUANTITY, unit: 'calls', target: 200 },
  { id: 'issue_resolution_rate', name: 'Issue Resolution Rate', category: METRIC_CATEGORIES.WORK_QUANTITY, unit: '%', target: 90 },
  { id: 'conversion_rate', name: 'Conversion Rate', category: METRIC_CATEGORIES.WORK_QUANTITY, unit: '%', target: 25 },
  { id: 'mbo_achievement', name: 'MBO Achievement', category: METRIC_CATEGORIES.WORK_QUALITY, unit: '%', target: 85 },
  { id: 'feedback_360_score', name: '360° Feedback Score', category: METRIC_CATEGORIES.WORK_QUALITY, unit: '/5', target: 4.2 },
  { id: 'manager_appraisal_rating', name: 'Manager Appraisal Rating', category: METRIC_CATEGORIES.WORK_QUALITY, unit: '/5', target: 4.0 },
  { id: 'error_rate', name: 'Error Rate', category: METRIC_CATEGORIES.WORK_QUALITY, unit: '%', target: 2, inverse: true },
  { id: 'nps_score', name: 'NPS Score', category: METRIC_CATEGORIES.WORK_QUALITY, unit: '', target: 70 },
  { id: 'customer_return_rate', name: 'Customer Returns/Complaints', category: METRIC_CATEGORIES.WORK_QUALITY, unit: '%', target: 3, inverse: true },
  { id: 'task_completion_time', name: 'Task Completion Time', category: METRIC_CATEGORIES.WORK_EFFICIENCY, unit: 'hrs', target: 4, inverse: true },
  { id: 'absenteeism_rate', name: 'Absenteeism Rate', category: METRIC_CATEGORIES.WORK_EFFICIENCY, unit: '%', target: 3, inverse: true },
  { id: 'overtime_hours', name: 'Overtime Hours', category: METRIC_CATEGORIES.WORK_EFFICIENCY, unit: 'hrs', target: 10 },
  { id: 'cost_per_task', name: 'Cost Per Task', category: METRIC_CATEGORIES.WORK_EFFICIENCY, unit: '$', target: 50, inverse: true },
  { id: 'task_prioritization_score', name: 'Task Prioritization Score', category: METRIC_CATEGORIES.WORK_EFFICIENCY, unit: '/10', target: 8 },
  { id: 'revenue_per_employee', name: 'Revenue Per Employee', category: METRIC_CATEGORIES.WORK_EFFICIENCY, unit: '$', target: 150000 },
  { id: 'profit_per_fte', name: 'Profit Per Employee (FTE)', category: METRIC_CATEGORIES.ORGANIZATIONAL, unit: '$', target: 45000 },
  { id: 'human_capital_roi', name: 'Human Capital ROI', category: METRIC_CATEGORIES.ORGANIZATIONAL, unit: '%', target: 150 },
  { id: 'employee_retention_rate', name: 'Employee Retention Rate', category: METRIC_CATEGORIES.ORGANIZATIONAL, unit: '%', target: 92 },
  { id: 'time_since_last_promotion', name: 'Time Since Last Promotion', category: METRIC_CATEGORIES.ORGANIZATIONAL, unit: 'months', target: 18 },
  { id: 'engagement_score', name: 'Engagement Score', category: METRIC_CATEGORIES.ENGAGEMENT_DEVELOPMENT, unit: '/10', target: 8.0 },
  { id: 'team_collaboration_score', name: 'Team Collaboration Score', category: METRIC_CATEGORIES.ENGAGEMENT_DEVELOPMENT, unit: '/10', target: 8.5 },
  { id: 'ld_participation', name: 'L&D Participation', category: METRIC_CATEGORIES.ENGAGEMENT_DEVELOPMENT, unit: '%', target: 80 },
  { id: 'skill_gap_closure_rate', name: 'Skill Gap Closure Rate', category: METRIC_CATEGORIES.ENGAGEMENT_DEVELOPMENT, unit: '%', target: 75 },
] as const;

export const REVIEW_STATUSES = ['Pending', 'In Progress', 'Completed'] as const;
export const GOAL_TYPES = ['KPI', 'KRA', 'OKR', 'MBO'] as const;
export const RATING_LABELS = ['Needs Improvement', 'Below Expectations', 'Meets Expectations', 'Exceeds Expectations', 'Outstanding'] as const;
