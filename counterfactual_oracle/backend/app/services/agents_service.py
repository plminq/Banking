"""Service for AI agents (critic, debate, validator)"""
from app.domain.models import FinancialReport, AggregatedSimulation, ScenarioParams
from app.domain.agents.critic import CriticAgent
from app.domain.agents.debate_agent import DebateAgent
from app.api.routes.settings import get_api_key


class AgentsService:
    """Service for orchestrating AI agents"""
    
    def _get_critic(self):
        """Get critic agent with current API key"""
        api_key = get_api_key("deepseek_api_key")
        if not api_key:
            raise ValueError("DeepSeek API key not configured. Please set it in Settings.")
        return CriticAgent(api_key=api_key)
    
    def _get_debate_agent(self):
        """Get debate agent with current API keys"""
        gemini_key = get_api_key("gemini_api_key")
        deepseek_key = get_api_key("deepseek_api_key")
        
        if not gemini_key:
            raise ValueError("Gemini API key not configured. Please set it in Settings.")
        if not deepseek_key:
            raise ValueError("DeepSeek API key not configured. Please set it in Settings.")
            
        return DebateAgent(
            gemini_api_key=gemini_key,
            deepseek_api_key=deepseek_key
        )
    
    def critique(
        self, 
        report: FinancialReport, 
        simulation: AggregatedSimulation
    ):
        """Run critic agent validation"""
        critic = self._get_critic()
        return critic.critique(report, simulation)
    
    def run_debate(
        self,
        report: FinancialReport,
        simulation: AggregatedSimulation,
        params: ScenarioParams,
        max_rounds: int = 10
    ):
        """Run multi-agent debate"""
        debate_agent = self._get_debate_agent()
        return debate_agent.run_debate(
            report=report,
            simulation=simulation,
            params=params,
            max_rounds=max_rounds
        )
