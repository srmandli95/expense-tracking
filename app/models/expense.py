from datetime import datetime, date
from typing import Optional
from sqlmodel import SQLModel, Field

class Expense(SQLModel, table=True):
    __tablename__ = "expenses"

    id: Optional[int] = Field(default=None, primary_key=True)
    owner_id: int = Field(foreign_key="users.id", index=True)

    amount: float = Field(gt=0)
    currency: str = Field(default="USD", max_length=8)
    category: str = Field(index=True, max_length=50)
    description: Optional[str] = Field(default=None, max_length=255)
    spend_at: date = Field(index=True) #when the expense was made

    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow, index=True)

