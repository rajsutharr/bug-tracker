from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.db.session import engine, Base

# Ensure all models are loaded
from app.models.user import User
from app.models.project import Project
from app.models.issue import Issue

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Bug Tracker")

# THE BRIDGE: Allow your React app to access this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")