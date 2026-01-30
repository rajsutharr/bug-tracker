from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.issue import Issue
from app.schemas.issue import IssueCreate, IssueOut, IssueUpdate

router = APIRouter()

# GET all issues
@router.get("/", response_model=List[IssueOut])
def read_issues(db: Session = Depends(get_db)):
    return db.query(Issue).all()

# POST new issue
@router.post("/", response_model=IssueOut)
def create_issue(issue: IssueCreate, db: Session = Depends(get_db)):
    db_issue = Issue(**issue.model_dump())
    db.add(db_issue)
    db.commit()
    db.refresh(db_issue)
    return db_issue

# PUT (Update) - Fixes the "Snap Back" and handles Edit Mode
@router.put("/{issue_id}", response_model=IssueOut)
def update_issue(issue_id: int, issue_update: IssueUpdate, db: Session = Depends(get_db)):
    db_issue = db.query(Issue).filter(Issue.id == issue_id).first()
    
    if not db_issue:
        # If this triggers, your frontend ID doesn't match a DB record
        raise HTTPException(status_code=404, detail="Issue not found in database")

    # Update only fields provided (partial update)
    update_data = issue_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_issue, key, value)

    db.commit()
    db.refresh(db_issue)
    return db_issue

# DELETE issue
@router.delete("/{issue_id}")
def delete_issue(issue_id: int, db: Session = Depends(get_db)):
    db_issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    db.delete(db_issue)
    db.commit()
    return {"message": "Issue deleted successfully"}