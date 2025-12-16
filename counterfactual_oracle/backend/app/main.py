"""FastAPI application entry point"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import reports, scenarios

app = FastAPI(
    title="Counterfactual Financial Oracle API",
    description="Multi-agent AI system for counterfactual financial analysis",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(reports.router, prefix="/api/reports", tags=["reports"])
app.include_router(scenarios.router, prefix="/api/scenarios", tags=["scenarios"])


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Counterfactual Financial Oracle API", "status": "healthy"}


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}



