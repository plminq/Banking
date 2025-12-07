from fpdf import FPDF
from app.domain.models import AggregatedSimulation, CriticVerdict, FinancialReport, DebateResult
from typing import Optional

class EvaluatorAgent:
    def __init__(self):
        pass

    def generate_pdf(self, simulation: AggregatedSimulation, critic: CriticVerdict, 
                     report: FinancialReport, output_path: str, debate_result: Optional[DebateResult] = None):
        pdf = FPDF()
        pdf.add_page()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.set_margins(15, 15, 15)  # left, top, right margins
        
        # Effective width for content (A4 = 210mm, minus 30mm margins = 180mm)
        eff_width = 180
        left_margin = 15
        
        pdf.set_font("Arial", size=12)
        
        # Title
        pdf.set_font("Arial", 'B', 16)
        pdf.set_x(left_margin)
        pdf.cell(eff_width, 10, txt="Counterfactual Financial Report", ln=1, align='C')
        pdf.ln(5)
        
        # Results Section
        pdf.set_font("Arial", 'B', 14)
        pdf.set_x(left_margin)
        pdf.cell(eff_width, 10, txt="Simulation Results", ln=1)
        pdf.set_font("Arial", size=11)
        pdf.set_x(left_margin)
        pdf.cell(eff_width, 8, txt=f"Median NPV: ${simulation.median_npv:,.2f}", ln=1)
        pdf.set_x(left_margin)
        pdf.cell(eff_width, 8, txt=f"Median Revenue: ${simulation.median_revenue:,.2f}", ln=1)
        pdf.set_x(left_margin)
        pdf.cell(eff_width, 8, txt=f"Median EBITDA: ${simulation.median_ebitda:,.2f}", ln=1)
        pdf.ln(5)
        
        # Critic Section
        pdf.set_font("Arial", 'B', 14)
        pdf.set_x(left_margin)
        pdf.cell(eff_width, 10, txt="Critic Verdict", ln=1)
        pdf.set_font("Arial", size=11)
        pdf.set_x(left_margin)
        pdf.cell(eff_width, 8, txt=f"Verdict: {critic.verdict.upper()}", ln=1)
        pdf.ln(3)
        
        # Assumptions
        pdf.set_font("Arial", 'B', 12)
        pdf.set_x(left_margin)
        pdf.cell(eff_width, 8, txt="Model Assumptions:", ln=1)
        pdf.set_font("Arial", size=10)
        for log in simulation.assumption_log:
            log_text = log[:120] if len(log) > 120 else log
            pdf.set_x(left_margin)
            pdf.multi_cell(eff_width, 6, txt=f"  - {log_text}")
        pdf.ln(5)
        
        # Comparative Analysis
        pdf.set_font("Arial", 'B', 12)
        pdf.set_x(left_margin)
        pdf.cell(eff_width, 8, txt="Comparative Analysis:", ln=1)
        pdf.set_font("Arial", size=10)
        for point in critic.comparative_analysis:
            point_text = point[:120] if len(point) > 120 else point
            pdf.set_x(left_margin)
            pdf.multi_cell(eff_width, 6, txt=f"  - {point_text}")
        pdf.ln(5)
        
        # NEW: AI Debate Transcript (if available)
        if debate_result is not None:
            pdf.add_page()
            pdf.set_font("Arial", 'B', 16)
            pdf.set_x(left_margin)
            pdf.cell(eff_width, 10, txt="AI Analyst Debate Transcript", ln=1, align='C')
            pdf.ln(5)
            
            pdf.set_font("Arial", 'I', 10)
            pdf.set_x(left_margin)
            pdf.multi_cell(eff_width, 5, txt=f"Two AI analysts debated for {debate_result.total_rounds} rounds. "
                                     f"{'Consensus reached.' if debate_result.converged else 'Healthy disagreement.'}")
            pdf.ln(3)
            
            # Convergence status
            pdf.set_font("Arial", 'B', 12)
            status_text = f"Status: {'CONVERGED' if debate_result.converged else 'DIVERGED'}"
            if debate_result.converged:
                status_text += f" (Round {debate_result.convergence_round})"
            pdf.set_x(left_margin)
            pdf.cell(eff_width, 8, txt=status_text, ln=1)
            pdf.ln(3)
            
            # Debate rounds (show first 3 and last 2 to keep PDF concise)
            pdf.set_font("Arial", 'B', 11)
            pdf.set_x(left_margin)
            pdf.cell(eff_width, 8, txt="Debate Highlights:", ln=1)
            pdf.ln(2)
            
            # Show selected rounds
            rounds_to_show = []
            total_turns = len(debate_result.debate_log)
            
            if total_turns <= 6:
                rounds_to_show = debate_result.debate_log
            else:
                # First 3 turns
                rounds_to_show.extend(debate_result.debate_log[:3])
                # Add separator
                rounds_to_show.append(None)  # Marker for "..."
                # Last 2 turns
                rounds_to_show.extend(debate_result.debate_log[-2:])
            
            for turn in rounds_to_show:
                if turn is None:
                    pdf.set_font("Arial", 'I', 10)
                    pdf.set_x(left_margin)
                    pdf.cell(eff_width, 6, txt="... (rounds omitted) ...", ln=1, align='C')
                    pdf.ln(2)
                    continue
                
                # Speaker header
                pdf.set_font("Arial", 'B', 10)
                speaker_text = f"Round {turn.round_number}: {turn.speaker} ({turn.role})"
                pdf.set_x(left_margin)
                pdf.cell(eff_width, 6, txt=speaker_text, ln=1)
                
                # Message content (truncate if too long)
                pdf.set_font("Arial", size=9)
                message = turn.message[:200] + "..." if len(turn.message) > 200 else turn.message
                pdf.set_x(left_margin)
                pdf.multi_cell(eff_width, 5, txt=message)
                pdf.ln(2)
            
            # Final verdict
            pdf.ln(3)
            pdf.set_font("Arial", 'B', 14)
            pdf.set_x(left_margin)
            pdf.cell(eff_width, 10, txt="Final Investment Verdict", ln=1)
            pdf.set_font("Arial", 'B', 12)
            pdf.set_x(left_margin)
            pdf.cell(eff_width, 8, txt=f"{debate_result.final_verdict} (Confidence: {debate_result.confidence_level})", ln=1)
            pdf.ln(3)
            
            # Key agreements
            if debate_result.key_agreements:
                pdf.set_font("Arial", 'B', 11)
                pdf.set_x(left_margin)
                pdf.cell(eff_width, 7, txt="Key Agreements:", ln=1)
                pdf.set_font("Arial", size=9)
                for agreement in debate_result.key_agreements[:3]:
                    pdf.set_x(left_margin)
                    pdf.multi_cell(eff_width, 5, txt=f"  + {agreement[:100]}")
                pdf.ln(2)
            
            # Remaining concerns
            if debate_result.key_disagreements:
                pdf.set_font("Arial", 'B', 11)
                pdf.set_x(left_margin)
                pdf.cell(eff_width, 7, txt="Remaining Concerns:", ln=1)
                pdf.set_font("Arial", size=9)
                for disagreement in debate_result.key_disagreements[:2]:
                    pdf.set_x(left_margin)
                    pdf.multi_cell(eff_width, 5, txt=f"  - {disagreement[:100]}")
                pdf.ln(2)
        
        # NEW: Document Sources Appendix
        pdf.add_page()
        pdf.set_font("Arial", 'B', 16)
        pdf.set_x(left_margin)
        pdf.cell(eff_width, 10, txt="Appendix: Document Sources", ln=1, align='C')
        pdf.ln(5)
        
        pdf.set_font("Arial", 'I', 10)
        pdf.set_x(left_margin)
        pdf.multi_cell(eff_width, 5, txt="Document sources for key financial inputs.")
        pdf.ln(3)
        
        # Table header - use narrower columns to fit within 180mm
        pdf.set_font("Arial", 'B', 10)
        pdf.set_x(left_margin)
        pdf.cell(40, 8, txt="Field", border=1)
        pdf.cell(50, 8, txt="Value", border=1)
        pdf.cell(90, 8, txt="Source", border=1, ln=1)
        
        # Table rows
        pdf.set_font("Arial", size=9)
        sources_data = [
            ("Revenue", f"${report.income_statement.Revenue:,.0f}", "Landing AI ADE"),
            ("OpEx", f"${report.income_statement.OpEx:,.0f}", "Landing AI ADE"),
            ("EBITDA", f"${report.income_statement.EBITDA:,.0f}", "Calculated"),
            ("Total Assets", f"${report.balance_sheet.Assets.get('TotalAssets', 0):,.0f}", "Landing AI ADE"),
        ]
        
        for field, value, source in sources_data:
            pdf.set_x(left_margin)
            pdf.cell(40, 7, txt=field, border=1)
            pdf.cell(50, 7, txt=value[:18], border=1)
            pdf.cell(90, 7, txt=source[:30], border=1, ln=1)
        
        pdf.ln(5)
        pdf.set_font("Arial", 'I', 8)
        pdf.set_x(left_margin)
        pdf.multi_cell(eff_width, 4, txt="Note: Values extracted using Landing AI ADE.")
        
        
        pdf.output(output_path)
        return output_path

