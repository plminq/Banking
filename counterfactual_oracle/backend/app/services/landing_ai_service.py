"""Service for Landing AI PDF extraction"""
import tempfile
import os
from typing import Union
from app.domain.models import FinancialReport
from app.domain.agents.landing_ai import LandingAIClient
from app.api.routes.settings import get_api_key


class LandingAIService:
    """Service wrapper for Landing AI client"""
    
    def _get_client(self):
        """Get Landing AI client with current API key"""
        api_key = get_api_key("landingai_api_key")
        if not api_key:
            raise ValueError("Landing AI API key not configured. Please set it in Settings.")
        return LandingAIClient(api_key=api_key)
    
    def extract_from_pdf(self, pdf_file: bytes, filename: str) -> FinancialReport:
        """Extract financial data from PDF file"""
        client = self._get_client()
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            tmp_file.write(pdf_file)
            tmp_path = tmp_file.name
        
        try:
            # Extract using Landing AI
            report = client.extract_data(tmp_path)
            return report
        finally:
            # Clean up temp file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
    
    def parse_json(self, json_data: dict) -> FinancialReport:
        """Parse JSON data (either FinancialReport format or raw Landing AI response)"""
        client = self._get_client()
        
        # Check if this is a raw Landing AI response
        if 'markdown' in json_data or 'failed_pages' in json_data:
            return client.parse_landing_ai_response(json_data)
        else:
            # Direct FinancialReport JSON
            return FinancialReport(**json_data)
