from datetime import datetime
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select
from sqlalchemy import or_ 

from app.database import get_session
from app.models.expense import Expense
from app.models.user import User
from app.core.deps import get_current_user
from app.schemas.expense import ExpenseCreate, ExpenseRead, ExpenseUpdate

router = APIRouter(prefix="/expenses", tags=["expenses"])

@router.post("", response_model=ExpenseRead, status_code=status.HTTP_201_CREATED)
def create_expense(
    payload: ExpenseCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    expense = Expense(
        owner_id = current_user.id,
        amount = payload.amount,
        currency = payload.currency,
        category = payload.category,
        description = payload.description,
        spend_at = payload.spend_at
    )

    session.add(expense)
    session.commit()
    session.refresh(expense)
    return expense


@router.get("", response_model=List[ExpenseRead])
def list_expenses(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),

    offset: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(10, ge=1, le=100, description="Maximum number of items to return"),

    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    category: Optional[str] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None,
    q: Optional[str] = None,   # search in desciption and category
):

    query = select(Expense).where(Expense.owner_id == current_user.id)

    if date_from:
        query = query.where(Expense.spend_at >= datetime.fromisoformat(date_from))
    if date_to:
        query = query.where(Expense.spend_at <= datetime.fromisoformat(date_to))
    if category:
        query = query.where(Expense.category == category)
    if min_amount is not None:
        query = query.where(Expense.amount >= min_amount)
    if max_amount is not None:
        query = query.where(Expense.amount <= max_amount)
    if q:
        query = query.where(or_(Expense.description.ilike(f"%{q}%"), Expense.category.ilike(f"%{q}%")))

    query = query.order_by(Expense.spend_at.desc(), Expense.created_at.desc())
    

    expenses = session.exec(query.offset(offset).limit(limit)).all()
    return expenses