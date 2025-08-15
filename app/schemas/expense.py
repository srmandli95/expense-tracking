from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, date
from typing import Optional

class ExpenseCreate(BaseModel):
    amount: float = Field(gt=0, description="Amount of the expense")
    currency: str = Field(default="USD", max_length=8, description="Currency of the expense")
    category: str = Field(max_length=50, description="Category of the expense")
    description: Optional[str] = Field(default=None, max_length=255, description="Description of the expense")
    spent_at: date = Field(description="Date when the expense was made")

class ExpenseRead(BaseModel):
    id: int
    owner_id: int
    amount: float
    currency: str
    category: str
    description: Optional[str]
    spent_at: date
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ExpenseUpdate(BaseModel):
    amount: Optional[float] = Field(gt=0, description="Amount of the expense")
    currency: Optional[str] = Field(max_length=8, description="Currency of the expense")
    category: Optional[str] = Field(max_length=50, description="Category of the expense")
    description: Optional[str] = Field(max_length=255, description="Description of the expense")
    spent_at: Optional[date] = Field(description="Date when the expense was made")

