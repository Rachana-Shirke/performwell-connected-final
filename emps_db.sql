-- eyployee table 
CREATE TABLE employees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    department TEXT NOT NULL,
    avatar TEXT,
    join_date DATE NOT NULL,
    manager_id TEXT,
    performance_score DOUBLE PRECISION DEFAULT 0.0,
    nine_box_performance INT CHECK (nine_box_performance BETWEEN 1 AND 3),
    nine_box_potential INT CHECK (nine_box_potential BETWEEN 1 AND 3),
    status TEXT CHECK (status IN ('active', 'inactive', 'on_leave')) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- goal table 
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('KPI', 'KRA', 'OKR', 'MBO')) NOT NULL,
    progress INT CHECK (progress BETWEEN 0 AND 100) DEFAULT 0,
    due_date DATE NOT NULL,
    status TEXT CHECK (status IN ('On Track', 'At Risk', 'Behind', 'Completed')) DEFAULT 'On Track',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_goal_employee
        FOREIGN KEY(employee_id)
        REFERENCES employees(id)
        ON DELETE CASCADE
);



-- review table 
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id TEXT NOT NULL,
    reviewer_id TEXT NOT NULL,
    type TEXT CHECK (type IN ('Manager', 'Self', 'Peer')) NOT NULL,
    period TEXT NOT NULL,
    rating DOUBLE PRECISION CHECK (rating BETWEEN 0 AND 5),
    strengths TEXT[],
    weaknesses TEXT[],
    comments TEXT,
    status TEXT CHECK (status IN ('Pending', 'In Progress', 'Completed')) DEFAULT 'Pending',
    completed_at DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_employee
        FOREIGN KEY(employee_id)
        REFERENCES employees(id)
        ON DELETE CASCADE
);


-- feedback table 
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id TEXT NOT NULL,
    from_id TEXT NOT NULL,
    from_name TEXT NOT NULL,
    type TEXT NOT NULL,
    rating DOUBLE PRECISION CHECK (rating BETWEEN 0 AND 5),
    comment TEXT,
    date DATE NOT NULL,
    categories JSONB,

    CONSTRAINT fk_feedback_employee
        FOREIGN KEY(employee_id)
        REFERENCES employees(id)
        ON DELETE CASCADE
);


-- performance matrics table 
CREATE TABLE performance_metrics (
    employee_id TEXT PRIMARY KEY,
    quantity_metrics JSONB,
    quality_metrics JSONB,
    efficiency_metrics JSONB,
    engagement_metrics JSONB,
    organizational_metrics JSONB,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_metrics_employee
        FOREIGN KEY(employee_id)
        REFERENCES employees(id)
        ON DELETE CASCADE
);


-- AI summary table 
CREATE TABLE ai_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id TEXT NOT NULL,
    summary_text TEXT NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ai_employee
        FOREIGN KEY(employee_id)
        REFERENCES employees(id)
        ON DELETE CASCADE
);


-- indexes 
CREATE INDEX idx_goals_employee ON goals(employee_id);
CREATE INDEX idx_reviews_employee ON reviews(employee_id);
CREATE INDEX idx_feedback_employee ON feedback(employee_id);