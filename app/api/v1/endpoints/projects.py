from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.project import Project

router = APIRouter()

@router.post("/")
def create_project(name: str, db: Session = Depends(get_db)):
    new_project = Project(name=name)
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

@router.get("/")
def list_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()