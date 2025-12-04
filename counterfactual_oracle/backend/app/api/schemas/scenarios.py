"""Pydantic schemas for scenario API"""
from pydantic import BaseModel
from typing import Optional, Dict, Any
from uuid import UUID
from datetime import datetime


class ScenarioCreate(BaseModel):
    """Request schema for creating a scenario"""
    report_id: UUID
    name: Optional[str] = None
    revenue_growth_delta_bps: float = 0.0
    opex_delta_bps: float = 0.0
    discount_rate_delta_bps: float = 0.0
    tax_rate_delta_bps: float = 0.0


class ScenarioStatus(BaseModel):
    """Response schema for scenario status (lightweight for polling)"""
    id: UUID
    status: str  # PENDING, RUNNING, COMPLETED, FAILED
    progress: int  # 0-100
    error_message: Optional[str] = None
    
    class Config:
        from_attributes = True


class ScenarioResponse(BaseModel):
    """Response schema for full scenario details"""
    id: UUID
    report_id: UUID
    name: Optional[str]
    status: str
    params: Dict[str, Any]
    simulation_results: Optional[Dict[str, Any]] = None
    critic_verdict: Optional[Dict[str, Any]] = None
    debate_result: Optional[Dict[str, Any]] = None
    final_verdict: Optional[str] = None
    error_message: Optional[str] = None
    progress: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True



