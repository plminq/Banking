"""Service for Monte Carlo simulation"""
from app.domain.models import FinancialReport, ScenarioParams, AggregatedSimulation
from app.domain.logic import run_monte_carlo
from app.domain.agents.simulator import SimulatorAgent
from app.core.config import settings


class SimulationService:
    """Service for running financial simulations"""
    
    def __init__(self):
        self.simulator_agent = SimulatorAgent(api_key=settings.gemini_api_key)
    
    def run_simulation(
        self, 
        report: FinancialReport, 
        params: ScenarioParams
    ) -> AggregatedSimulation:
        """Run Monte Carlo simulation with AI-generated assumption log"""
        # Run Monte Carlo (pure Python math)
        agg_results = run_monte_carlo(report, params)
        
        # Enhance with AI-generated qualitative analysis
        agg_results = self.simulator_agent.run_simulation(report, params)
        
        return agg_results



