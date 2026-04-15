export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar: string;
  joinDate: string;
  managerId?: string;
  performanceScore: number;
  nineBoxPosition: { performance: number; potential: number };
}

export interface Goal {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  type: 'KPI' | 'KRA' | 'OKR' | 'MBO';
  progress: number;
  dueDate: string;
  status: 'On Track' | 'At Risk' | 'Behind' | 'Completed';
  createdAt: string;
}

export interface Review {
  id: string;
  employeeId: string;
  reviewerId: string;
  type: 'Manager' | 'Self' | 'Peer';
  period: string;
  rating: number;
  strengths: string[];
  weaknesses: string[];
  comments: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  completedAt?: string;
}

export interface FeedbackEntry {
  id: string;
  employeeId: string;
  fromId: string;
  fromName: string;
  type: 'Peer' | 'Manager' | 'Direct Report';
  rating: number;
  comment: string;
  date: string;
  categories: { name: string; score: number }[];
}

export interface MetricValue {
  metricId: string;
  value: number;
  month: string;
}

export const employees: Employee[] = [
  { id: 'e1', name: 'Sarah Chen', email: 'sarah.chen@acme.co', role: 'Senior Engineer', department: 'Engineering', avatar: 'SC', joinDate: '2021-03-15', performanceScore: 4.3, nineBoxPosition: { performance: 3, potential: 3 } },
  { id: 'e2', name: 'James Wilson', email: 'james.wilson@acme.co', role: 'Product Manager', department: 'Product', avatar: 'JW', joinDate: '2020-08-01', managerId: 'e1', performanceScore: 3.8, nineBoxPosition: { performance: 2, potential: 3 } },
  { id: 'e3', name: 'Priya Patel', email: 'priya.patel@acme.co', role: 'UX Designer', department: 'Design', avatar: 'PP', joinDate: '2022-01-10', managerId: 'e1', performanceScore: 4.5, nineBoxPosition: { performance: 3, potential: 2 } },
  { id: 'e4', name: 'Marcus Johnson', email: 'marcus.j@acme.co', role: 'Data Analyst', department: 'Analytics', avatar: 'MJ', joinDate: '2021-11-20', managerId: 'e2', performanceScore: 3.2, nineBoxPosition: { performance: 2, potential: 2 } },
  { id: 'e5', name: 'Elena Rodriguez', email: 'elena.r@acme.co', role: 'HR Manager', department: 'HR', avatar: 'ER', joinDate: '2019-06-05', performanceScore: 4.1, nineBoxPosition: { performance: 3, potential: 2 } },
  { id: 'e6', name: 'David Kim', email: 'david.kim@acme.co', role: 'Frontend Developer', department: 'Engineering', avatar: 'DK', joinDate: '2022-07-12', managerId: 'e1', performanceScore: 3.6, nineBoxPosition: { performance: 2, potential: 3 } },
];

export const goals: Goal[] = [
  { id: 'g1', employeeId: 'e1', title: 'Increase system uptime to 99.9%', description: 'Improve infrastructure reliability and monitoring', type: 'KPI', progress: 78, dueDate: '2026-06-30', status: 'On Track', createdAt: '2026-01-01' },
  { id: 'g2', employeeId: 'e1', title: 'Lead Q2 architecture review', description: 'Conduct comprehensive review of microservices architecture', type: 'OKR', progress: 45, dueDate: '2026-04-30', status: 'At Risk', createdAt: '2026-01-15' },
  { id: 'g3', employeeId: 'e2', title: 'Launch v2.0 product features', description: 'Ship 5 major features for Q2 release', type: 'KRA', progress: 60, dueDate: '2026-05-31', status: 'On Track', createdAt: '2026-01-01' },
  { id: 'g4', employeeId: 'e3', title: 'Redesign onboarding flow', description: 'Improve user onboarding conversion by 20%', type: 'MBO', progress: 92, dueDate: '2026-04-15', status: 'On Track', createdAt: '2025-12-01' },
  { id: 'g5', employeeId: 'e4', title: 'Build predictive analytics dashboard', description: 'Create ML-powered insights for sales team', type: 'KPI', progress: 30, dueDate: '2026-07-31', status: 'Behind', createdAt: '2026-02-01' },
  { id: 'g6', employeeId: 'e1', title: 'Mentor 3 junior developers', description: 'Provide weekly 1:1s and code reviews', type: 'KRA', progress: 65, dueDate: '2026-12-31', status: 'On Track', createdAt: '2026-01-01' },
  { id: 'g7', employeeId: 'e5', title: 'Reduce time-to-hire by 15%', description: 'Streamline recruitment process', type: 'MBO', progress: 100, dueDate: '2026-03-31', status: 'Completed', createdAt: '2025-10-01' },
  { id: 'g8', employeeId: 'e6', title: 'Achieve 90% test coverage', description: 'Write unit and integration tests for all components', type: 'KPI', progress: 55, dueDate: '2026-06-30', status: 'At Risk', createdAt: '2026-01-15' },
];

export const reviews: Review[] = [
  { id: 'r1', employeeId: 'e1', reviewerId: 'e5', type: 'Manager', period: 'Q1 2026', rating: 4.3, strengths: ['Technical leadership', 'Mentorship', 'Problem solving'], weaknesses: ['Delegation', 'Documentation'], comments: 'Sarah continues to exceed expectations in technical delivery. Should focus on delegating more to grow the team.', status: 'Completed', completedAt: '2026-03-20' },
  { id: 'r2', employeeId: 'e1', reviewerId: 'e1', type: 'Self', period: 'Q1 2026', rating: 4.0, strengths: ['System design', 'Code quality'], weaknesses: ['Work-life balance', 'Saying no'], comments: 'I feel I have contributed strongly to architecture decisions but need to improve on setting boundaries.', status: 'Completed', completedAt: '2026-03-18' },
  { id: 'r3', employeeId: 'e2', reviewerId: 'e1', type: 'Manager', period: 'Q1 2026', rating: 3.8, strengths: ['Stakeholder management', 'Strategic thinking'], weaknesses: ['Data-driven decisions', 'Sprint planning'], comments: 'James has improved significantly in stakeholder communication. Data analysis skills need development.', status: 'Completed', completedAt: '2026-03-22' },
  { id: 'r4', employeeId: 'e3', reviewerId: 'e1', type: 'Manager', period: 'Q1 2026', rating: 4.5, strengths: ['Design systems', 'User research', 'Prototyping'], weaknesses: ['Presenting to executives'], comments: 'Priya is one of our strongest designers. Her onboarding redesign showed exceptional user empathy.', status: 'Completed', completedAt: '2026-03-21' },
  { id: 'r5', employeeId: 'e4', reviewerId: 'e2', type: 'Manager', period: 'Q1 2026', rating: 3.2, strengths: ['SQL proficiency', 'Attention to detail'], weaknesses: ['Communication', 'Proactiveness', 'Deadline management'], comments: 'Marcus produces accurate work but needs to communicate blockers earlier and take more initiative.', status: 'In Progress' },
  { id: 'r6', employeeId: 'e6', reviewerId: 'e1', type: 'Manager', period: 'Q1 2026', rating: 3.6, strengths: ['React expertise', 'Learning speed'], weaknesses: ['Testing', 'Code reviews'], comments: 'David shows great potential. Focus areas: testing practices and providing more thorough code reviews.', status: 'Pending' },
];

export const feedbackEntries: FeedbackEntry[] = [
  { id: 'f1', employeeId: 'e1', fromId: 'e2', fromName: 'James Wilson', type: 'Peer', rating: 4.5, comment: 'Sarah is an exceptional technical leader. Always available to help and provides clear direction.', date: '2026-03-15', categories: [{ name: 'Leadership', score: 5 }, { name: 'Communication', score: 4 }, { name: 'Technical Skills', score: 5 }, { name: 'Collaboration', score: 4 }] },
  { id: 'f2', employeeId: 'e1', fromId: 'e3', fromName: 'Priya Patel', type: 'Peer', rating: 4.2, comment: 'Great at breaking down complex problems. Sometimes moves too fast for the team to keep up.', date: '2026-03-14', categories: [{ name: 'Leadership', score: 4 }, { name: 'Communication', score: 4 }, { name: 'Technical Skills', score: 5 }, { name: 'Collaboration', score: 4 }] },
  { id: 'f3', employeeId: 'e1', fromId: 'e6', fromName: 'David Kim', type: 'Direct Report', rating: 4.6, comment: 'Best manager I have had. Invests in my growth and provides constructive feedback.', date: '2026-03-16', categories: [{ name: 'Leadership', score: 5 }, { name: 'Communication', score: 5 }, { name: 'Technical Skills', score: 4 }, { name: 'Collaboration', score: 5 }] },
  { id: 'f4', employeeId: 'e1', fromId: 'e5', fromName: 'Elena Rodriguez', type: 'Manager', rating: 4.3, comment: 'Sarah demonstrates strong leadership and technical acumen. Continue to develop cross-functional influence.', date: '2026-03-20', categories: [{ name: 'Leadership', score: 4 }, { name: 'Communication', score: 4 }, { name: 'Technical Skills', score: 5 }, { name: 'Collaboration', score: 4 }] },
  { id: 'f5', employeeId: 'e2', fromId: 'e1', fromName: 'Sarah Chen', type: 'Manager', rating: 3.8, comment: 'James has good product instincts. Needs to strengthen analytical rigor in decision-making.', date: '2026-03-18', categories: [{ name: 'Leadership', score: 3 }, { name: 'Communication', score: 4 }, { name: 'Technical Skills', score: 3 }, { name: 'Collaboration', score: 5 }] },
  { id: 'f6', employeeId: 'e3', fromId: 'e2', fromName: 'James Wilson', type: 'Peer', rating: 4.7, comment: 'Priya brings incredible design thinking. Her prototypes always exceed expectations.', date: '2026-03-17', categories: [{ name: 'Leadership', score: 4 }, { name: 'Communication', score: 5 }, { name: 'Technical Skills', score: 5 }, { name: 'Collaboration', score: 5 }] },
];

export const metricValues: MetricValue[] = [
  // Sarah Chen metrics across months
  { metricId: 'task_completion_rate', value: 94, month: '2026-01' },
  { metricId: 'task_completion_rate', value: 96, month: '2026-02' },
  { metricId: 'task_completion_rate', value: 97, month: '2026-03' },
  { metricId: 'units_produced', value: 480, month: '2026-01' },
  { metricId: 'units_produced', value: 510, month: '2026-02' },
  { metricId: 'units_produced', value: 525, month: '2026-03' },
  { metricId: 'number_of_sales', value: 42, month: '2026-01' },
  { metricId: 'number_of_sales', value: 48, month: '2026-02' },
  { metricId: 'number_of_sales', value: 53, month: '2026-03' },
  { metricId: 'customer_calls_handled', value: 185, month: '2026-01' },
  { metricId: 'customer_calls_handled', value: 210, month: '2026-02' },
  { metricId: 'customer_calls_handled', value: 198, month: '2026-03' },
  { metricId: 'issue_resolution_rate', value: 88, month: '2026-01' },
  { metricId: 'issue_resolution_rate', value: 91, month: '2026-02' },
  { metricId: 'issue_resolution_rate', value: 93, month: '2026-03' },
  { metricId: 'conversion_rate', value: 22, month: '2026-01' },
  { metricId: 'conversion_rate', value: 24, month: '2026-02' },
  { metricId: 'conversion_rate', value: 26, month: '2026-03' },
  { metricId: 'mbo_achievement', value: 80, month: '2026-01' },
  { metricId: 'mbo_achievement', value: 83, month: '2026-02' },
  { metricId: 'mbo_achievement', value: 87, month: '2026-03' },
  { metricId: 'feedback_360_score', value: 4.1, month: '2026-01' },
  { metricId: 'feedback_360_score', value: 4.2, month: '2026-02' },
  { metricId: 'feedback_360_score', value: 4.4, month: '2026-03' },
  { metricId: 'manager_appraisal_rating', value: 4.0, month: '2026-01' },
  { metricId: 'manager_appraisal_rating', value: 4.1, month: '2026-02' },
  { metricId: 'manager_appraisal_rating', value: 4.3, month: '2026-03' },
  { metricId: 'error_rate', value: 3.2, month: '2026-01' },
  { metricId: 'error_rate', value: 2.8, month: '2026-02' },
  { metricId: 'error_rate', value: 2.1, month: '2026-03' },
  { metricId: 'nps_score', value: 62, month: '2026-01' },
  { metricId: 'nps_score', value: 68, month: '2026-02' },
  { metricId: 'nps_score', value: 72, month: '2026-03' },
  { metricId: 'customer_return_rate', value: 4.1, month: '2026-01' },
  { metricId: 'customer_return_rate', value: 3.5, month: '2026-02' },
  { metricId: 'customer_return_rate', value: 2.8, month: '2026-03' },
  { metricId: 'task_completion_time', value: 5.2, month: '2026-01' },
  { metricId: 'task_completion_time', value: 4.8, month: '2026-02' },
  { metricId: 'task_completion_time', value: 4.1, month: '2026-03' },
  { metricId: 'absenteeism_rate', value: 3.5, month: '2026-01' },
  { metricId: 'absenteeism_rate', value: 2.8, month: '2026-02' },
  { metricId: 'absenteeism_rate', value: 2.2, month: '2026-03' },
  { metricId: 'overtime_hours', value: 12, month: '2026-01' },
  { metricId: 'overtime_hours', value: 8, month: '2026-02' },
  { metricId: 'overtime_hours', value: 10, month: '2026-03' },
  { metricId: 'cost_per_task', value: 62, month: '2026-01' },
  { metricId: 'cost_per_task', value: 55, month: '2026-02' },
  { metricId: 'cost_per_task', value: 48, month: '2026-03' },
  { metricId: 'task_prioritization_score', value: 7.5, month: '2026-01' },
  { metricId: 'task_prioritization_score', value: 8.0, month: '2026-02' },
  { metricId: 'task_prioritization_score', value: 8.3, month: '2026-03' },
  { metricId: 'revenue_per_employee', value: 135000, month: '2026-01' },
  { metricId: 'revenue_per_employee', value: 142000, month: '2026-02' },
  { metricId: 'revenue_per_employee', value: 155000, month: '2026-03' },
  { metricId: 'profit_per_fte', value: 38000, month: '2026-01' },
  { metricId: 'profit_per_fte', value: 42000, month: '2026-02' },
  { metricId: 'profit_per_fte', value: 47000, month: '2026-03' },
  { metricId: 'human_capital_roi', value: 135, month: '2026-01' },
  { metricId: 'human_capital_roi', value: 142, month: '2026-02' },
  { metricId: 'human_capital_roi', value: 155, month: '2026-03' },
  { metricId: 'employee_retention_rate', value: 90, month: '2026-01' },
  { metricId: 'employee_retention_rate', value: 91, month: '2026-02' },
  { metricId: 'employee_retention_rate', value: 93, month: '2026-03' },
  { metricId: 'time_since_last_promotion', value: 14, month: '2026-01' },
  { metricId: 'time_since_last_promotion', value: 15, month: '2026-02' },
  { metricId: 'time_since_last_promotion', value: 16, month: '2026-03' },
  { metricId: 'engagement_score', value: 7.6, month: '2026-01' },
  { metricId: 'engagement_score', value: 7.9, month: '2026-02' },
  { metricId: 'engagement_score', value: 8.2, month: '2026-03' },
  { metricId: 'team_collaboration_score', value: 8.0, month: '2026-01' },
  { metricId: 'team_collaboration_score', value: 8.2, month: '2026-02' },
  { metricId: 'team_collaboration_score', value: 8.6, month: '2026-03' },
  { metricId: 'ld_participation', value: 72, month: '2026-01' },
  { metricId: 'ld_participation', value: 78, month: '2026-02' },
  { metricId: 'ld_participation', value: 82, month: '2026-03' },
  { metricId: 'skill_gap_closure_rate', value: 65, month: '2026-01' },
  { metricId: 'skill_gap_closure_rate', value: 70, month: '2026-02' },
  { metricId: 'skill_gap_closure_rate', value: 76, month: '2026-03' },
];

export const departmentPerformance = [
  { department: 'Engineering', avgScore: 4.1, headcount: 15, retention: 94 },
  { department: 'Product', avgScore: 3.8, headcount: 8, retention: 88 },
  { department: 'Design', avgScore: 4.3, headcount: 6, retention: 92 },
  { department: 'Analytics', avgScore: 3.5, headcount: 10, retention: 85 },
  { department: 'HR', avgScore: 4.0, headcount: 5, retention: 96 },
  { department: 'Sales', avgScore: 3.7, headcount: 12, retention: 82 },
];
