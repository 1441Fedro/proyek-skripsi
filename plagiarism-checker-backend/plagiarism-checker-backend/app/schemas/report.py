from pydantic import BaseModel
from datetime import datetime

class ReportCreate(BaseModel):
    file_name: str
    file_path: str

class ReportOut(BaseModel):
    id: int
    file_name: str
    file_path: str
    uploaded_at: datetime

    class Config:
        from_attributes = True
