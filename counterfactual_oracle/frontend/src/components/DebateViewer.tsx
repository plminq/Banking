import { DebateResult } from '../lib/types'

interface Props {
  debate: DebateResult
}

export default function DebateViewer({ debate }: Props) {
  return (
    <div className="space-y-6">
      {/* Convergence Status */}
      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
        debate.converged 
          ? 'bg-green-100 text-green-800' 
          : 'bg-yellow-100 text-yellow-800'
      }`}>
        {debate.converged 
          ? `✅ CONVERGED (Round ${debate.convergence_round})` 
          : `⚠️ NO FULL CONVERGENCE (${debate.total_rounds} rounds)`}
      </div>

      {/* Debate Transcript */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Debate Transcript</h3>
        {debate.debate_log.map((turn, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg border-l-4 ${
              turn.speaker === 'Gemini'
                ? 'bg-green-50 border-green-500'
                : 'bg-red-50 border-red-500'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-lg ${
                  turn.speaker === 'Gemini' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {turn.speaker === 'Gemini' ? '🟢' : '🔴'}
                </span>
                <strong className="text-sm font-semibold">
                  {turn.speaker} ({turn.role})
                </strong>
              </div>
              <span className="text-xs text-gray-500">Round {turn.round_number}</span>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{turn.message}</p>
          </div>
        ))}
      </div>

      {/* Consensus Summary */}
      {debate.consensus_summary && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Consensus Summary</h3>
          <p className="text-gray-700">{debate.consensus_summary}</p>
        </div>
      )}

      {/* Key Agreements */}
      {debate.key_agreements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Key Agreements</h3>
          <ul className="space-y-1">
            {debate.key_agreements.map((agreement, idx) => (
              <li key={idx} className="text-gray-700">✓ {agreement}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Key Disagreements */}
      {debate.key_disagreements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Remaining Concerns</h3>
          <ul className="space-y-1">
            {debate.key_disagreements.map((disagreement, idx) => (
              <li key={idx} className="text-gray-700">⚠ {disagreement}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

