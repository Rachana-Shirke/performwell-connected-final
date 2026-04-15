"""
main.py — EPMS FastAPI Application
====================================
Boot order:
  1. Load settings from .env
  2. Connect to PostgreSQL, create all tables
  3. Register CORS middleware
  4. Mount all API routers
  5. Register global exception handlers
  6. Expose /health endpoint
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from app.config import settings
from app.database import create_all_tables

from app.routes import (
    employee_routes,
    goal_routes,
    review_routes,
    feedback_routes,
    metrics_routes,
    ai_routes,
)

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.DEBUG if settings.app_env == "development" else logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
)
logger = logging.getLogger("epms")

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.app_title,
    version=settings.app_version,
    description=(
        "Enterprise Performance Management System — REST API\n\n"
        "Powered by FastAPI + SQLAlchemy + PostgreSQL. "
        "AI agent uses GPT-4o-mini (falls back to deterministic mock when key absent).\n\n"
        "**RAG-ready**: inject `rag_context` into the agent when a vector store is wired up."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
ALLOWED_ORIGINS = [
    settings.frontend_url,          # e.g. http://localhost:5173
    "http://localhost:3000",
    "http://localhost:4173",        # Vite preview
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Startup ───────────────────────────────────────────────────────────────────
@app.on_event("startup")
async def on_startup():
    logger.info("Starting EPMS backend…")
    logger.info(f"Environment : {settings.app_env}")
    logger.info(f"Database    : {settings.database_url.split('@')[-1]}")  # hide creds
    create_all_tables()
    logger.info("All tables verified / created.")


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"], summary="Server health check")
async def health():
    return {
        "status":  "ok",
        "service": settings.app_title,
        "version": settings.app_version,
        "env":     settings.app_env,
    }


# ── Global exception handlers ─────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.method} {request.url}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": "Internal server error", "detail": str(exc)},
    )


@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={"success": False, "error": f"Route {request.method} {request.url.path} not found"},
    )


# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(employee_routes.router)
app.include_router(goal_routes.router)
app.include_router(review_routes.router)
app.include_router(feedback_routes.router)
app.include_router(metrics_routes.router)
app.include_router(ai_routes.router)

logger.info("All routers registered.")
