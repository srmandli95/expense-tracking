from fastapi import FastAPI, HTTPException
from datetime import date
from backend import db_helper
from typing import List
from pydantic import BaseModel

class GetExpense(BaseModel):
    id: int
    amount: float
    category: str
    notes:str

class PutExpense(BaseModel):
    expense_date: date
    amount: float
    category: str
    notes: str

class DateRange(BaseModel):
    start_date: date
    end_date: date 

app = FastAPI()

@app.get("/getexpenses/{start_date}/{end_date}", response_model=List[GetExpense])
def get_expenses(start_date: date, end_date: date):
    return db_helper.fetch_expense_for_date(start_date, end_date)

@app.post("/addexpense/")
def add_expense(expenses: List[PutExpense]):
    for expense in expenses:
        db_helper.insert_expense(expense.expense_date, expense.amount, expense.category, expense.notes)
    return {"message": "Expenses added successfully"}

@app.delete("/deleteexpense/{expense_id}")
def delete_expense(expense_id: int):
    deleted = db_helper.delete_expense_by_id(expense_id)
    if deleted:
        return {"message": f"Expense with ID {expense_id} deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Expense not found")


@app.post("/analytics/monthly/")
def get_monthly_expenses(data: dict):
    month = data["month"]  # Expected format: "YYYY-MM"
    result = db_helper.fetch_expenses_by_month(month)
    return result
  