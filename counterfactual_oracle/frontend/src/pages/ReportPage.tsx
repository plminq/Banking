import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { reportsApi, scenariosApi } from '../lib/api'
import { useState } from 'react'

export default function ReportPage() {
  const { reportId } = useParams<{ reportId: string }>()
  const navigate = useNavigate()
  const [opexDelta, setOpexDelta] = useState(0)
  const [revGrowthDelta, setRevGrowthDelta] = useState(0)
  const [discountRateDelta, setDiscountRateDelta] = useState(0)
  const [creating, setCreating] = useState(false)

  const { data: report, isLoading } = useQuery({
    queryKey: ['report', reportId],
    queryFn: () => reportsApi.get(reportId!),
    enabled: !!reportId,
  })

  const handleCreateScenario = async () => {
    if (!reportId) return

    setCreating(true)
    try {
      const scenario = await scenariosApi.create({
        report_id: reportId,
        revenue_growth_delta_bps: revGrowthDelta,
        opex_delta_bps: opexDelta,
        discount_rate_delta_bps: discountRateDelta,
      })
      navigate(`/scenarios/${scenario.id}`)
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to create scenario')
    } finally {
      setCreating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Report not found</h2>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {report.company_name || 'Financial Report'}
          </h1>
          {report.fiscal_year && (
            <p className="text-gray-600">Fiscal Year: {report.fiscal_year}</p>
          )}
        </div>

        <div className="card mb-6">
          <h2 className="text-2xl font-semibold mb-6">Create Scenario</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OpEx Delta: {opexDelta} bps
              </label>
              <input
                type="range"
                min="-500"
                max="500"
                value={opexDelta}
                onChange={(e) => setOpexDelta(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Negative = Cost cutting (Higher Profit), Positive = More spending (Lower Profit)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Revenue Growth Delta: {revGrowthDelta} bps
              </label>
              <input
                type="range"
                min="-500"
                max="500"
                value={revGrowthDelta}
                onChange={(e) => setRevGrowthDelta(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Positive = Faster growth, Negative = Slower growth or decline
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Rate Delta: {discountRateDelta} bps
              </label>
              <input
                type="range"
                min="-500"
                max="500"
                value={discountRateDelta}
                onChange={(e) => setDiscountRateDelta(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Higher = Future cash worth less (Lower Valuation), Lower = Future cash worth more (Higher Valuation)
              </p>
            </div>

            <button
              onClick={handleCreateScenario}
              disabled={creating}
              className="btn-primary w-full"
            >
              {creating ? 'Creating...' : '▶️ Run Simulation + Debate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


