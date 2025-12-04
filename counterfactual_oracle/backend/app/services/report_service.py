"""Service for PDF report generation"""
import tempfile
import os
from app.domain.models import FinancialReport, AggregatedSimulation
from app.domain.agents.evaluator import EvaluatorAgent
from app.domain.agents.critic import CriticVerdict
from app.domain.agents.debate_agent import DebateResult
from typing import Optional


class ReportService:
    """Service for generating PDF reports"""
    
    def __init__(self):
        self.evaluator = EvaluatorAgent()
    
    def generate_pdf(
        self,
        simulation: AggregatedSimulation,
        critic_verdict: CriticVerdict,
        report: FinancialReport,
        debate_result: Optional[DebateResult] = None
    ) -> bytes:
        """Generate PDF report and return as bytes"""
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            tmp_path = tmp_file.name
        
        try:
            # Generate PDF
            self.evaluator.generate_pdf(
                simulation=simulation,
                critic=critic_verdict,
                report=report,
                output_path=tmp_path,
                debate_result=debate_result
            )
            
            # Read and return bytes
            with open(tmp_path, "rb") as f:
                return f.read()
        finally:
            # Clean up
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)



