"""Pydantic schemas for AI endpoints."""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AISummaryRequest(BaseModel):
    employee_id: str


class AISummaryOut(BaseModel):
    employee_id: str
    summary: str
    generated_at: str

    model_config = {"from_attributes": True}
