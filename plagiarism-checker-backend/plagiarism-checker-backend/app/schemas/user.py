from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class LoginRequest(BaseModel):
    username: str
    password: str

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str

class UserUpdateSchema(BaseModel):
    username: str
    role: str
    password: Optional[str] = None

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str
    created_at: datetime

    class Config:
        from_attributes = True
        # orm_mode = True
