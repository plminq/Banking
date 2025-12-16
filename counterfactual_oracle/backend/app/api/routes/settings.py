"""Settings API routes for managing API keys"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import os
import httpx

router = APIRouter()


class APIKeys(BaseModel):
    """API keys configuration"""
    gemini_api_key: Optional[str] = None
    deepseek_api_key: Optional[str] = None
    landingai_api_key: Optional[str] = None


class APIKeyStatus(BaseModel):
    """Status of each API key"""
    gemini: bool = False
    deepseek: bool = False
    landingai: bool = False


# In-memory storage for API keys (session-based)
# In production, you'd want to use secure storage
_api_keys: dict = {}


@router.get("/keys/status", response_model=APIKeyStatus)
async def get_api_key_status():
    """Check which API keys are configured"""
    return APIKeyStatus(
        gemini=bool(_api_keys.get("gemini_api_key") or os.getenv("GEMINI_API_KEY")),
        deepseek=bool(_api_keys.get("deepseek_api_key") or os.getenv("DEEPSEEK_API_KEY")),
        landingai=bool(_api_keys.get("landingai_api_key") or os.getenv("LANDINGAI_API_KEY"))
    )


@router.post("/keys", response_model=APIKeyStatus)
async def save_api_keys(keys: APIKeys):
    """Save API keys to session storage"""
    if keys.gemini_api_key:
        _api_keys["gemini_api_key"] = keys.gemini_api_key
    if keys.deepseek_api_key:
        _api_keys["deepseek_api_key"] = keys.deepseek_api_key
    if keys.landingai_api_key:
        _api_keys["landingai_api_key"] = keys.landingai_api_key
    
    return await get_api_key_status()


@router.delete("/keys", response_model=APIKeyStatus)
async def clear_api_keys():
    """Clear all API keys from session storage"""
    _api_keys.clear()
    return await get_api_key_status()


@router.post("/keys/validate")
async def validate_api_keys(keys: APIKeys):
    """Validate API keys by testing connections"""
    results = {
        "gemini": {"valid": False, "message": "Not provided"},
        "deepseek": {"valid": False, "message": "Not provided"},
        "landingai": {"valid": False, "message": "Not provided"}
    }
    
    # Validate Gemini API key
    if keys.gemini_api_key:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"https://generativelanguage.googleapis.com/v1beta/models?key={keys.gemini_api_key}",
                    timeout=10.0
                )
                if response.status_code == 200:
                    results["gemini"] = {"valid": True, "message": "Connected successfully"}
                else:
                    results["gemini"] = {"valid": False, "message": f"Invalid key (status {response.status_code})"}
        except Exception as e:
            results["gemini"] = {"valid": False, "message": str(e)}
    
    # Validate DeepSeek API key
    if keys.deepseek_api_key:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://api.deepseek.com/v1/models",
                    headers={"Authorization": f"Bearer {keys.deepseek_api_key}"},
                    timeout=10.0
                )
                if response.status_code == 200:
                    results["deepseek"] = {"valid": True, "message": "Connected successfully"}
                else:
                    results["deepseek"] = {"valid": False, "message": f"Invalid key (status {response.status_code})"}
        except Exception as e:
            results["deepseek"] = {"valid": False, "message": str(e)}
    
    # Validate Landing AI API key
    if keys.landingai_api_key:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://api.landing.ai/v1/tools/agentic-document-analysis",
                    headers={"apikey": keys.landingai_api_key},
                    timeout=10.0
                )
                # Landing AI returns 405 for GET but validates the key
                if response.status_code in [200, 405]:
                    results["landingai"] = {"valid": True, "message": "Key format valid"}
                else:
                    results["landingai"] = {"valid": False, "message": f"Invalid key (status {response.status_code})"}
        except Exception as e:
            results["landingai"] = {"valid": False, "message": str(e)}
    
    return results


def get_api_key(key_name: str) -> Optional[str]:
    """Helper function to get API key from session or environment"""
    return _api_keys.get(key_name) or os.getenv(key_name.upper())
