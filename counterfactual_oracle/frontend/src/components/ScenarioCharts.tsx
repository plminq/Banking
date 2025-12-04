import { AggregatedSimulation } from '../lib/types'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Props {
  simulation: AggregatedSimulation
}

export default function ScenarioCharts({ simulation }: Props) {
  // Prepare data for 5-year forecast chart
  const forecastData = simulation.revenue_forecast_p50.map((rev, idx) => ({
    year: `Year ${idx + 1}`,
    Revenue: rev,
    EBITDA: simulation.ebitda_forecast_p50[idx],
    FCF: simulation.fcf_forecast_p50[idx],
  }))

  // NPV distribution (simplified - using percentiles)
  const npvData = [
    { range: 'P10', value: simulation.p10_npv },
    { range: 'P50 (Median)', value: simulation.median_npv },
    { range: 'P90', value: simulation.p90_npv },
  ]

  return (
    <div className="space-y-8">
      {/* 5-Year Forecast */}
      <div>
        <h3 className="text-lg font-semibold mb-4">5-Year Forecast</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
            <Legend />
            <Line type="monotone" dataKey="Revenue" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="EBITDA" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="FCF" stroke="#f59e0b" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* NPV Distribution */}
      <div>
        <h3 className="text-lg font-semibold mb-4">NPV Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={npvData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}


