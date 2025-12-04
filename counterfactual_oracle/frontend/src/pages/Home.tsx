import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { reportsApi } from '../lib/api'

export default function Home() {
  const navigate = useNavigate()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const report = await reportsApi.upload(file, null)
      navigate(`/reports/${report.id}`)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to upload report')
    } finally {
      setUploading(false)
    }
  }

  const handleJsonUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const text = await file.text()
      const report = await reportsApi.upload(null, text)
      navigate(`/reports/${report.id}`)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to upload report')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              🔮 Counterfactual Financial Oracle
            </h1>
            <p className="text-xl text-gray-600">
              Multi-agent AI system for counterfactual financial analysis
            </p>
          </div>

          <div className="card max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-semibold mb-6">Upload Financial Report</h2>
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload PDF (10-K, 10-Q, Annual Report)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="input"
                />
              </div>

              <div className="text-gray-500 text-sm">or</div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload JSON (Pre-extracted data)
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleJsonUpload}
                  disabled={uploading}
                  className="input"
                />
              </div>

              {uploading && (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Processing...</p>
                </div>
              )}
            </div>
          </div>

          <div className="card max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">Features</h3>
            <ul className="text-left space-y-2 text-gray-600">
              <li>🤖 AI-powered document extraction with Landing AI</li>
              <li>📈 Monte Carlo simulation (10,000 scenarios)</li>
              <li>🛡️ Adversarial critique with DeepSeek</li>
              <li>💬 Multi-agent debate (Gemini vs DeepSeek)</li>
              <li>📊 DCF valuation with Gordon Growth model</li>
              <li>📄 Professional PDF report generation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

