"""Goal routes — GET /api/goals/{employee_id}, POST, PUT, DELETE"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.goal_schema import GoalCreate, GoalUpdate, GoalOut
from app.services import performance_service

router = APIRouter(prefix="/api/goals", tags=["Goals"])


@router.get("", response_model=list[GoalOut], summary="All goals")
def list_all_goals(db: Session = Depends(get_db)):
    return performance_service.get_all_goals(db)


@router.get("/{employee_id}", response_model=list[GoalOut], summary="Goals by employee")
def list_goals(employee_id: str, db: Session = Depends(get_db)):
    return performance_service.get_goals_by_employee(employee_id, db)


@router.post("", response_model=GoalOut, status_code=201, summary="Create goal")
def create_goal(data: GoalCreate, db: Session = Depends(get_db)):
    return performance_service.create_goal(data, db)


@router.put("/{goal_id}", response_model=GoalOut, summary="Update goal")
def update_goal(goal_id: str, data: GoalUpdate, db: Session = Depends(get_db)):
    return performance_service.update_goal(goal_id, data, db)


@router.delete("/{goal_id}", summary="Delete goal")
def delete_goal(goal_id: str, db: Session = Depends(get_db)):
    return performance_service.delete_goal(goal_id, db)
