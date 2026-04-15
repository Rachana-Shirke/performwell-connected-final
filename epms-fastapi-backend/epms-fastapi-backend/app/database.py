"""
database.py
Provides the SQLAlchemy engine, session factory, declarative Base,
and FastAPI dependency get_db().
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.config import settings

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,         # auto-reconnect on stale connections
    pool_size=10,
    max_overflow=20,
    echo=(settings.app_env == "development"),
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Shared declarative base for all ORM models."""
    pass


def get_db():
    """FastAPI dependency — yields a DB session and guarantees close."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_all_tables():
    """Call once on startup to create all tables that don't yet exist."""
    from app.models import employee, goal, review, feedback, performance_metrics, ai_summary  # noqa: F401
    Base.metadata.create_all(bind=engine)
