"""Feedback360 routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.feedback_schema import FeedbackCreate, FeedbackOut
from app.services import performance_service

router = APIRouter(prefix="/api/feedback", tags=["Feedback360"])


@router.get("", response_model=list[FeedbackOut], summary="All feedback")
def list_all_feedback(db: Session = Depends(get_db)):
    return performance_service.get_all_feedback(db)


@router.get("/{employee_id}", response_model=list[FeedbackOut], summary="Feedback by employee")
def list_feedback(employee_id: str, db: Session = Depends(get_db)):
    return performance_service.get_feedback_by_employee(employee_id, db)


@router.post("", response_model=FeedbackOut, status_code=201, summary="Create feedback")
def create_feedback(data: FeedbackCreate, db: Session = Depends(get_db)):
    return performance_service.create_feedback(data, db)
