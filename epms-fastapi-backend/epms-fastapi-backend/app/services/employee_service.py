"""
employee_service.py
All database operations for Employee.
"""

from sqlalchemy.orm import Session
from app.models.employee import Employee
from app.schemas.employee_schema import EmployeeCreate, EmployeeUpdate, EmployeeOut
from fastapi import HTTPException, status
import uuid


def get_all_employees(db: Session) -> list[EmployeeOut]:
    rows = db.query(Employee).order_by(Employee.name).all()
    return [EmployeeOut.from_orm_obj(e) for e in rows]


def get_employee_by_id(employee_id: str, db: Session) -> EmployeeOut:
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Employee '{employee_id}' not found")
    return EmployeeOut.from_orm_obj(emp)


def create_employee(data: EmployeeCreate, db: Session) -> EmployeeOut:
    existing = db.query(Employee).filter(Employee.id == data.id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail=f"Employee with id '{data.id}' already exists")
    emp = Employee(
        id=data.id,
        name=data.name,
        email=data.email,
        role=data.role,
        department=data.department,
        avatar=data.avatar,
        join_date=data.join_date,
        manager_id=data.manager_id,
        performance_score=data.performance_score,
        nine_box_performance=data.nine_box_performance,
        nine_box_potential=data.nine_box_potential,
        status=data.status,
    )
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return EmployeeOut.from_orm_obj(emp)


def update_employee(employee_id: str, data: EmployeeUpdate, db: Session) -> EmployeeOut:
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Employee '{employee_id}' not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(emp, field, value)
    db.commit()
    db.refresh(emp)
    return EmployeeOut.from_orm_obj(emp)
