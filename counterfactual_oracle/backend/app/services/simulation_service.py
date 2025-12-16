"""Service for Monte Carlo simulation"""
from app.domain.models import FinancialReport, ScenarioParams, AggregatedSimulation
from app.domain.logic import run_monte_carlo
from app.domain.agents.simulator import SimulatorAgent
from app.api.routes.settings import get_api_key


class SimulationService:
    """Service for running financial simulations"""
    
    def _get_simulator_agent(self):
        """Get simulator agent with current API key"""
        api_key = get_api_key("gemini_api_key")
        if not api_key:
            raise ValueError("Gemini API key not configured. Please set it in Settings.")
        return SimulatorAgent(api_key=api_key)
    
    def run_simulation(
        self, 
        report: FinancialReport, 
        params: ScenarioParams
    ) -> AggregatedSimulation:
        """Run Monte Carlo simulation with AI-generated assumption log"""
        # Run Monte Carlo (pure Python math)
        agg_results = run_monte_carlo(report, params)
        
        # Enhance with AI-generated qualitative analysis
        simulator_agent = self._get_simulator_agent()
        agg_results = simulator_agent.run_simulation(report, params)
        
        return agg_results
