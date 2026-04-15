"""Review routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.review_schema import ReviewCreate, ReviewUpdate, ReviewOut
from app.services import performance_service

router = APIRouter(prefix="/api/reviews", tags=["Reviews"])


@router.get("", response_model=list[ReviewOut], summary="All reviews")
def list_all_reviews(db: Session = Depends(get_db)):
    return performance_service.get_all_reviews(db)


@router.get("/{employee_id}", response_model=list[ReviewOut], summary="Reviews by employee")
def list_reviews(employee_id: str, db: Session = Depends(get_db)):
    return performance_service.get_reviews_by_employee(employee_id, db)


@router.post("", response_model=ReviewOut, status_code=201, summary="Create review")
def create_review(data: ReviewCreate, db: Session = Depends(get_db)):
    return performance_service.create_review(data, db)


@router.put("/{review_id}", response_model=ReviewOut, summary="Update review")
def update_review(review_id: str, data: ReviewUpdate, db: Session = Depends(get_db)):
    return performance_service.update_review(review_id, data, db)
