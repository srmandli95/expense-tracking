from datetime import datetime
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select
from sqlalchemy import or_ 

from app.database import get_session
from app.models.expense import Expense
from app.models.user import User
from app.core.deps import get_current_user
from app.core.logging_config import setup_logging, get_logger
from app.schemas.expense import ExpenseCreate, ExpenseRead, ExpenseUpdate

router = APIRouter(prefix="/expenses", tags=["expenses"])
logger = get_logger("expenses")

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
        spent_at = payload.spent_at
    )

    logger.info(f"Creating expense: {expense} by user_id: {current_user.id}")
    session.add(expense)
    session.commit()
    session.refresh(expense)
    logger.info(f"Expense created with id: {expense.id} by user_id: {current_user.id}")
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
        query = query.where(Expense.spent_at >= datetime.fromisoformat(date_from))
    if date_to:
        query = query.where(Expense.spent_at <= datetime.fromisoformat(date_to))
    if category:
        query = query.where(Expense.category == category)
    if min_amount is not None:
        query = query.where(Expense.amount >= min_amount)
    if max_amount is not None:
        query = query.where(Expense.amount <= max_amount)
    if q:
        query = query.where(or_(Expense.description.ilike(f"%{q}%"), Expense.category.ilike(f"%{q}%")))

    query = query.order_by(Expense.spent_at.desc(), Expense.created_at.desc())

    logger.info(f"Listing expenses for user_id: {current_user.id}")
    expenses = session.exec(query.offset(offset).limit(limit)).all()
    logger.info(f"Found {len(expenses)} expenses for user_id: {current_user.id}")
    return expenses


@router.get("/{expense_id}",response_model=ExpenseRead)
def get_expense(
    expense_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    logger.info(f"Fetching expense id: {expense_id} for user_id: {current_user.id}")
    expense = session.get(Expense, expense_id)
    if not expense or expense.owner_id != current_user.id:
        logger.error(f"Expense not found or not owned by user_id: {current_user.id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
    logger.info(f"Found expense id: {expense_id} for user_id: {current_user.id}")
    return expense  

@router.put("/{expense_id}", response_model=ExpenseRead)
def replace_expense(
    expense_id: int,
    payload: ExpenseUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):

    expense = session.get(Expense, expense_id)
    if not expense or expense.owner_id != current_user.id:
        logger.error(f"Expense not found or not owned by user_id: {current_user.id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
    logger.info(f"Replacing expense id: {expense.id} for user_id: {current_user.id} with data: {payload}")
    expense.amount = payload.amount
    expense.currency = payload.currency
    expense.category = payload.category
    expense.description = payload.description
    expense.spent_at = payload.spent_at
    expense.updated_at = datetime.utcnow()
    
    session.add(expense)
    session.commit()
    session.refresh(expense)
    logger.info(f"Replaced expense id: {expense.id} for user_id: {current_user.id}")
    return expense

@router.patch("/{expense_id}", response_model=ExpenseRead)
def update_expense(
    expense_id: int,
    payload: ExpenseUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    expense = session.get(Expense, expense_id)
    if not expense or expense.owner_id != current_user.id:
        logger.error(f"Expense not found or not owned by user_id: {current_user.id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")

    expense_data = payload.model_dump(exclude_unset=True)
    logger.info(f"Updating expense id: {expense.id} for user_id: {current_user.id} with data: {expense_data}")
    for key, value in expense_data.items():
        setattr(expense, key, value)
    expense.updated_at = datetime.utcnow()
    session.add(expense)
    session.commit()
    session.refresh(expense)
    logger.info(f"Updated expense id: {expense.id} for user_id: {current_user.id}")
    return expense

@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(
    expense_id: str,
    session: Session =Depends(get_session),
    owner_id: User = Depends(get_current_user)
):
    expense = session.get(Expense, expense_id)
    if not expense or expense.owner_id != owner_id.id:
        logger.error(f"Expense not found or not owned by user_id: {owner_id.id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
    
    session.delete(expense)
    session.commit()
    logger.info(f"Deleted expense id: {expense_id} for user_id: {owner_id.id}")
    return None