from sqlmodel import SQLModel, Field
from typing import Optional

class User(SQLModel, table=True):

    __tablename__ = "users" 
    
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True, nullable=False)
    hashed_password: str
    is_active: bool = True

