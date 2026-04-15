# EPMS FastAPI Backend
### Enterprise Performance Management System — Python + FastAPI + PostgreSQL

A **production-ready** REST API backend that perfectly integrates with the existing
**PerformWell** React frontend, replacing all mock/static data with live PostgreSQL queries.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Python 3.10+ |
| Framework | FastAPI 0.111 |
| Server | Uvicorn |
| ORM | SQLAlchemy 2.0 |
| Database | PostgreSQL (via psycopg2) |
| Validation | Pydantic v2 |
| AI Agent | OpenAI GPT-4o-mini (mock fallback included) |
| Config | pydantic-settings + python-dotenv |

---

## Project Structure

```
epms-fastapi-backend/
├── app/
│   ├── agents/
│   │   └── performance_review_agent.py   ← THE one AI agent (RAG-ready)
│   ├── models/
│   │   ├── __init__.py
│   │   ├── employee.py
│   │   ├── goal.py
│   │   ├── review.py
│   │   ├── feedback.py
│   │   ├── performance_metrics.py
│   │   └── ai_summary.py
│   ├── schemas/
│   │   ├── employee_schema.py
│   │   ├── goal_schema.py
│   │   ├── review_schema.py
│   │   ├── feedback_schema.py
│   │   └── ai_schema.py
│   ├── routes/
│   │   ├── employee_routes.py
│   │   ├── goal_routes.py
│   │   ├── review_routes.py
│   │   ├── feedback_routes.py
│   │   ├── metrics_routes.py
│   │   └── ai_routes.py
│   ├── services/
│   │   ├── employee_service.py
│   │   ├── performance_service.py        ← goals, reviews, feedback, metrics
│   │   └── analytics_service.py
│   ├── utils/
│   │   └── metrics_config.py             ← mirrors frontend constants.ts
│   ├── config.py                         ← pydantic-settings from .env
│   ├── database.py                       ← SQLAlchemy engine + get_db()
│   └── main.py                           ← FastAPI app entry point
├── frontend-integration/
│   ├── apiClient.ts                      → copy to src/services/apiClient.ts
│   ├── PerformanceContext.tsx             → copy to src/contexts/
│   └── AISummaryCard.tsx                 → copy to src/components/performance/
├── seed.py                               ← populate DB with all mock data
├── requirements.txt
├── .env.example
└── README.md
```

---

## Quick Start

### 1. Set up Python environment

```bash
cd epms-fastapi-backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Create PostgreSQL database

```sql
-- In pgAdmin or psql:
CREATE DATABASE epms_db;
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/epms_db
OPENAI_API_KEY=sk-...          # optional — mock used if blank
FRONTEND_URL=http://localhost:5173
```

### 4. Seed the database

```bash
python seed.py
```

This inserts the exact same employees, goals, reviews, feedback, and metric values
as the frontend's `mockData.ts`.

### 5. Start the server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Server starts at **http://localhost:8000**

- Interactive docs: **http://localhost:8000/docs**
- ReDoc: **http://localhost:8000/redoc**
- Health: **http://localhost:8000/health**

---

## API Reference

### Employees
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/employees` | List all employees |
| GET | `/api/employees/{id}` | Get one employee |
| POST | `/api/employees` | Create employee |
| PUT | `/api/employees/{id}` | Update employee |

### Goals
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/goals` | All goals |
| GET | `/api/goals/{employee_id}` | Goals for one employee |
| POST | `/api/goals` | Create goal |
| PUT | `/api/goals/{id}` | Update goal |
| DELETE | `/api/goals/{id}` | Delete goal |

### Reviews
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/reviews` | All reviews |
| GET | `/api/reviews/{employee_id}` | Reviews for one employee |
| POST | `/api/reviews` | Create review |
| PUT | `/api/reviews/{id}` | Update review |

### Feedback (360°)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/feedback` | All feedback |
| GET | `/api/feedback/{employee_id}` | Feedback for one employee |
| POST | `/api/feedback` | Submit feedback |

### Metrics & Analytics
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/metrics/{employee_id}` | Enriched metrics (currentValue + trend + status) |
| GET | `/api/metrics/departments` | Department-level performance |
| POST | `/api/metrics` | Upsert a metric value |
| GET | `/api/analytics/{employee_id}` | Full analytics payload |

### AI Agent
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/ai/performance-summary` | Trigger the Performance Review Agent |
| GET | `/api/ai/performance-summary/{id}` | Fetch latest stored summary |

**Trigger AI agent:**
```bash
curl -X POST http://localhost:8000/api/ai/performance-summary \
     -H "Content-Type: application/json" \
     -d '{"employee_id": "e1"}'
```

---

## AI Agent — Performance Review Agent

**File:** `app/agents/performance_review_agent.py`

### Data flow
```
POST /api/ai/performance-summary
         │
         ▼
performance_review_agent.run(employee_id, db, rag_context="")
         │
         ├── query Employee        ─┐
         ├── query Goals            │  PostgreSQL only
         ├── query Reviews          │  (SQLAlchemy)
         ├── query Feedback360      │
         └── query PerformanceMetrics ─┘
         │
         ▼
_build_prompt(...)   ← structured, data-grounded HR context block
         │
         ▼
_call_openai(prompt) OR _mock_summary(...)
         │
         ▼
AISummary.create(...)   ← persisted to ai_summaries table
         │
         ▼
returns Markdown text → JSON response → frontend
```

### Prompt rules enforced
- Professional HR tone
- Data-driven only — no invented facts
- Fixed structure: Overall Performance → Key Strengths → Areas for Improvement
  → Goal Progress → Actionable Recommendations → Closing Note
- 200–250 words
- Full Markdown formatting

### Mock fallback
When `OPENAI_API_KEY` is not set, a **deterministic mock** is returned that still
extracts real numbers from the database (ratings, scores, goal counts) — the UI
works completely without an API key.

---

## RAG Readiness

The agent accepts a `rag_context: str` parameter. When a vector store (e.g.,
pgvector, Pinecone, Chroma) is wired up later:

```python
# In ai_routes.py — future RAG call (no other changes needed)
retrieved_chunks = rag_store.query(employee_id)
summary = await performance_review_agent.run(
    employee_id, db,
    rag_context=retrieved_chunks   # ← inject HR policy chunks here
)
```

The prompt builder has a dedicated `RELEVANT HR POLICY CONTEXT` section that is
populated automatically. **Zero frontend changes required.**

Designed to augment (not replace) structured PostgreSQL data:
- HR policies
- Promotion guidelines
- Appraisal rules
- Training manuals

---

## Frontend Integration (3 files)

Copy these three files from `frontend-integration/` into the React project:

```
frontend-integration/apiClient.ts
    → src/services/apiClient.ts

frontend-integration/PerformanceContext.tsx
    → src/contexts/PerformanceContext.tsx

frontend-integration/AISummaryCard.tsx
    → src/components/performance/AISummaryCard.tsx
```

Add to `performwell-hub-main/.env`:
```
VITE_API_URL=http://localhost:8000
```

The `PerformanceContext.tsx` replacement:
- Removes all `mockData.ts` imports
- Fetches employees, goals, reviews, feedback from the backend on mount
- Re-fetches metrics whenever `selectedEmployeeId` changes
- Exposes exactly the same context shape — **zero page/component changes needed**

---

## Response Format

All endpoints return JSON directly (FastAPI default).
Routes that use the `success/data` envelope return:

```json
{ "success": true, "data": { ... } }
```

Validation errors (422):
```json
{
  "detail": [
    { "loc": ["body", "employee_id"], "msg": "Field required", "type": "missing" }
  ]
}
```

---

## Database Models

| Model | Table | Key Columns |
|-------|-------|-------------|
| Employee | employees | id, name, email, role, department, performance_score, nine_box_* |
| Goal | goals | id, employee_id, title, type, progress, due_date, status |
| Review | reviews | id, employee_id, reviewer_id, type, rating, strengths[], weaknesses[], status |
| Feedback360 | feedback360 | id, employee_id, from_id, rating, categories[] |
| PerformanceMetrics | performance_metrics | employee_id, *_metrics (JSON arrays) |
| AISummary | ai_summaries | id, employee_id, summary_text, generated_at |

---

## Environment Variables

| Variable | Default | Notes |
|----------|---------|-------|
| `DATABASE_URL` | `postgresql://postgres:password@localhost:5432/epms_db` | Full SQLAlchemy URL |
| `OPENAI_API_KEY` | *(empty)* | Leave blank → mock summaries |
| `OPENAI_MODEL` | `gpt-4o-mini` | Any OpenAI chat model |
| `FRONTEND_URL` | `http://localhost:5173` | CORS allowed origin |
| `APP_ENV` | `development` | `development` or `production` |

---

## Useful Commands

```bash
# Start development server
uvicorn app.main:app --reload --port 8000

# Seed database
python seed.py

# Check API docs
open http://localhost:8000/docs

# Test health endpoint
curl http://localhost:8000/health

# Test AI agent (no OpenAI key needed — returns mock)
curl -X POST http://localhost:8000/api/ai/performance-summary \
     -H "Content-Type: application/json" \
     -d '{"employee_id": "e1"}'
```
