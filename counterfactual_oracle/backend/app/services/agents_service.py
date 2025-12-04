"""Service for AI agents (critic, debate, validator)"""
from app.domain.models import FinancialReport, AggregatedSimulation, ScenarioParams
from app.domain.agents.critic import CriticAgent
from app.domain.agents.debate_agent import DebateAgent
from app.core.config import settings


class AgentsService:
    """Service for orchestrating AI agents"""
    
    def __init__(self):
        self.critic = CriticAgent(api_key=settings.deepseek_api_key)
        self.debate_agent = DebateAgent(
            gemini_api_key=settings.gemini_api_key,
            deepseek_api_key=settings.deepseek_api_key
        )
    
    def critique(
        self, 
        report: FinancialReport, 
        simulation: AggregatedSimulation
    ):
        """Run critic agent validation"""
        return self.critic.critique(report, simulation)
    
    def run_debate(
        self,
        report: FinancialReport,
        simulation: AggregatedSimulation,
        params: ScenarioParams,
        max_rounds: int = 10
    ):
        """Run multi-agent debate"""
        return self.debate_agent.run_debate(
            report=report,
            simulation=simulation,
            params=params,
            max_rounds=max_rounds
        )


