"""Employee routes — GET /api/employees, GET /api/employees/{id}, POST, PUT"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.employee_schema import EmployeeCreate, EmployeeUpdate, EmployeeOut
from app.services import employee_service

router = APIRouter(prefix="/api/employees", tags=["Employees"])


@router.get("", response_model=list[EmployeeOut], summary="List all employees")
def list_employees(db: Session = Depends(get_db)):
    return employee_service.get_all_employees(db)


@router.get("/{employee_id}", response_model=EmployeeOut, summary="Get one employee")
def get_employee(employee_id: str, db: Session = Depends(get_db)):
    return employee_service.get_employee_by_id(employee_id, db)


@router.post("", response_model=EmployeeOut, status_code=201, summary="Create employee")
def create_employee(data: EmployeeCreate, db: Session = Depends(get_db)):
    return employee_service.create_employee(data, db)


@router.put("/{employee_id}", response_model=EmployeeOut, summary="Update employee")
def update_employee(employee_id: str, data: EmployeeUpdate, db: Session = Depends(get_db)):
    return employee_service.update_employee(employee_id, data, db)
