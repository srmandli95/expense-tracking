from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from sqlalchemy import or_, func

from datetime import datetime, timedelta
from typing import List, Dict, Optional

from app.database import get_session
from app.models.expense import Expense
from app.models.user import User
from app.core.deps import get_current_user
from app.core.logging_config import get_logger


router = APIRouter(prefix="/analytics", tags=["analytics"])
logger = get_logger("analytics")

@router.get("/summary", response_model=Dict[str, float])
def get_expense_summary(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    if not start_date:
        start_date = datetime.utcnow() - timedelta(days=30)
    if not end_date:
        end_date = datetime.utcnow()
        
    logger.info(f"Generating expense summary for user_id: {current_user.id} from {start_date} to {end_date}")

    try:
        statement = (
            select(Expense.category, Expense.currency, func.sum(Expense.amount).label("total_amount"))
            .where(
                Expense.owner_id == current_user.id,
                Expense.spent_at >= start_date,
                Expense.spent_at <= end_date
            )
            .group_by(Expense.category, Expense.currency)
        )
        results = session.exec(statement).all()

        summary = {f"{category}_{currency}": total_amount for category, currency, total_amount in results}

        logger.info(f"Generated expense summary for user_id: {current_user.id}")
        return summary
    except Exception as exc:
        logger.exception("Failed to generate expense summary")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to generate expense summary")

    