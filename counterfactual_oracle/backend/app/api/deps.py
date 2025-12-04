"""FastAPI dependencies"""
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.database import get_db

def get_database_session() -> Session:
    """Dependency for database session"""
    return Depends(get_db)



