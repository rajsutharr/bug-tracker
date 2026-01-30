from pydantic import BaseModel, ConfigDict
from typing import Optional

class IssueBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "To Do"
    project_id: int

class IssueCreate(IssueBase):
    pass

# DAY 11: New schema for partial updates (Drag-and-Drop / Edit)
class IssueUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    project_id: Optional[int] = None

class IssueOut(IssueBase):
    id: int
    
    # Modern Pydantic V2 configuration
    model_config = ConfigDict(from_attributes=True)