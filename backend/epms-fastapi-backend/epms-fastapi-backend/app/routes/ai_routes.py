"""AI Agent routes — POST /api/ai/performance-summary, GET latest."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.ai_schema import AISummaryRequest, AISummaryOut
from app.models.ai_summary import AISummary
from app.agents import performance_review_agent

router = APIRouter(prefix="/api/ai", tags=["AI Agent"])


@router.post(
    "/performance-summary",
    summary="Trigger Performance Review Agent",
    description="Fetches all employee data from PostgreSQL, runs the AI agent, "
                "stores and returns a professional HR performance review summary.",
)
async def generate_summary(req: AISummaryRequest, db: Session = Depends(get_db)):
    try:
        summary_text = await performance_review_agent.run(req.employee_id, db)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI agent error: {str(e)}")

    return {
        "success": True,
        "data": {
            "employeeId":  req.employee_id,
            "summary":     summary_text,
            "generatedAt": __import__("datetime").datetime.utcnow().isoformat() + "Z",
        },
    }


@router.get(
    "/performance-summary/{employee_id}",
    summary="Fetch latest stored AI summary",
)
def get_latest_summary(employee_id: str, db: Session = Depends(get_db)):
    record = (
        db.query(AISummary)
        .filter(AISummary.employee_id == employee_id)
        .order_by(AISummary.generated_at.desc())
        .first()
    )
    if not record:
        raise HTTPException(
            status_code=404,
            detail=f"No AI summary found for employee '{employee_id}'",
        )
    return {
        "success": True,
        "data": {
            "employeeId":  employee_id,
            "summary":     record.summary_text,
            "generatedAt": record.generated_at.isoformat(),
        },
    }
