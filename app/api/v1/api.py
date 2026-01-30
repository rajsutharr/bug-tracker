from fastapi import APIRouter
from app.api.v1.endpoints import issues, projects # Add projects here

api_router = APIRouter()
api_router.include_router(issues.router, prefix="/issues", tags=["issues"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])