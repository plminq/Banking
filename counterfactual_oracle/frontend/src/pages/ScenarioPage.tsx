import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { scenariosApi } from '../lib/api'
import { useScenarioStatus } from '../hooks/useScenarioStatus'
import { Scenario } from '../lib/types'
import ScenarioCharts from '../components/ScenarioCharts'
import DebateViewer from '../components/DebateViewer'
import { useState } from 'react'

export default function ScenarioPage() {
  const { scenarioId } = useParams<{ scenarioId: string }>()
  const navigate = useNavigate()
  const [downloading, setDownloading] = useState(false)

  const { data: scenario, isLoading } = useQuery<Scenario>({
    queryKey: ['scenario', scenarioId],
    queryFn: () => scenariosApi.get(scenarioId!),
    enabled: !!scenarioId,
  })

  const { data: status } = useScenarioStatus(scenarioId || null, !!scenarioId)

  const handleDownloadReport = async () => {
    if (!scenarioId) return

    setDownloading(true)
    try {
      const blob = await scenariosApi.generateReport(scenarioId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `scenario_${scenarioId}_report.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to download report')
    } finally {
      setDownloading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Scenario not found</h2>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const isRunning = scenario.status === 'RUNNING' || scenario.status === 'PENDING'
  const isCompleted = scenario.status === 'COMPLETED'
  const isFailed = scenario.status === 'FAILED'

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {scenario.name || 'Scenario Analysis'}
          </h1>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isCompleted ? 'bg-green-100 text-green-800' :
              isFailed ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {scenario.status}
            </span>
            {isRunning && (
              <span className="text-sm text-gray-600">
                Progress: {status?.progress || scenario.progress}%
              </span>
            )}
          </div>
        </div>

        {/* Error Message */}
        {isFailed && scenario.error_message && (
          <div className="card mb-6 bg-red-50 border-red-200">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
            <p className="text-red-700">{scenario.error_message}</p>
          </div>
        )}

        {/* Loading State */}
        {isRunning && (
          <div className="card mb-6 text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">
              Running Monte Carlo simulation and AI analysis...
              <br />
              This may take 30-60 seconds
            </p>
            {status && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${status.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {isCompleted && scenario.simulation_results && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Projected NPV</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${scenario.simulation_results.median_npv.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-gray-500 mt-1">Net Present Value</p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Median Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${scenario.simulation_results.median_revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-gray-500 mt-1">Projected annual revenue</p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Median EBITDA</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${scenario.simulation_results.median_ebitda.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-gray-500 mt-1">Earnings before interest, tax, D&A</p>
              </div>
            </div>

            {/* Charts */}
            <div className="card mb-6">
              <h2 className="text-2xl font-semibold mb-4">Simulation Results</h2>
              <ScenarioCharts simulation={scenario.simulation_results} />
            </div>

            {/* Assumption Log */}
            {scenario.simulation_results.assumption_log && (
              <div className="card mb-6">
                <h2 className="text-2xl font-semibold mb-4">Model Assumptions</h2>
                <ul className="space-y-2">
                  {scenario.simulation_results.assumption_log.map((log, idx) => (
                    <li key={idx} className="text-gray-700">• {log}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Critic Verdict */}
            {scenario.critic_verdict && (
              <div className="card mb-6">
                <h2 className="text-2xl font-semibold mb-4">Adversarial Analysis</h2>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                  scenario.critic_verdict.verdict === 'approve' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  VERDICT: {scenario.critic_verdict.verdict.toUpperCase()}
                </div>
                <div className="space-y-2">
                  {scenario.critic_verdict.comparative_analysis.map((point, idx) => (
                    <p key={idx} className="text-gray-700">{point}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Debate */}
            {scenario.debate_result && (
              <div className="card mb-6">
                <h2 className="text-2xl font-semibold mb-4">AI Analyst Debate</h2>
                <DebateViewer debate={scenario.debate_result} />
              </div>
            )}

            {/* Final Verdict */}
            {scenario.final_verdict && (
              <div className="card mb-6 text-center">
                <h2 className="text-xl font-semibold mb-2">Final Investment Verdict</h2>
                <p className="text-4xl font-bold text-gray-900 mb-2">{scenario.final_verdict}</p>
                {scenario.debate_result && (
                  <p className="text-gray-600">Confidence: {scenario.debate_result.confidence_level}</p>
                )}
              </div>
            )}

            {/* Download Report */}
            <div className="text-center">
              <button
                onClick={handleDownloadReport}
                disabled={downloading}
                className="btn-primary"
              >
                {downloading ? 'Generating...' : '📥 Download PDF Report'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}


