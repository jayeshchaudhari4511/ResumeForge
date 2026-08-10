interface AnalysisErrorProps {
  error: string
  errorCode?: string | null
  onRetry: () => void
}

/**
 * Error state card with message, error code, and retry button.
 */
export default function AnalysisError({ error, errorCode, onRetry }: AnalysisErrorProps) {
  const getErrorIcon = () => {
    switch (errorCode) {
      case 'QUOTA_EXCEEDED': return '⏱️'
      case 'TIMEOUT': return '⌛'
      case 'NETWORK_ERROR': return '🌐'
      case 'API_KEY_MISSING': return '🔑'
      default: return '⚠️'
    }
  }

  const getErrorHint = () => {
    switch (errorCode) {
      case 'QUOTA_EXCEEDED':
        return 'The Gemini API rate limit has been reached. Wait a few minutes and try again.'
      case 'TIMEOUT':
        return 'The AI took too long to respond. This can happen with very long job descriptions.'
      case 'NETWORK_ERROR':
        return 'Could not reach the analysis server. Make sure it is running.'
      case 'API_KEY_MISSING':
        return 'The server needs a valid GEMINI_API_KEY in the .env.local file.'
      case 'INVALID_JSON':
      case 'VALIDATION_FAILED':
        return 'The AI returned an unexpected format. This is usually temporary.'
      default:
        return null
    }
  }

  const hint = getErrorHint()

  return (
    <div
      className="glass-card p-6 sm:p-8 space-y-4"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Error icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20
                        flex items-center justify-center">
          <span className="text-3xl">{getErrorIcon()}</span>
        </div>

        {/* Error message */}
        <div className="space-y-2 max-w-md">
          <h3 className="text-base font-bold text-white">Analysis Failed</h3>
          <p className="text-sm text-slate-400 leading-relaxed">{error}</p>
          {hint && (
            <p className="text-xs text-slate-600 leading-relaxed italic">{hint}</p>
          )}
          {errorCode && (
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono
                             text-slate-600 bg-white/5 border border-white/10">
              {errorCode}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            id="analysis-retry-btn"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                       text-white bg-btn-gradient shadow-glow
                       hover:scale-105 hover:shadow-glow-purple
                       transition-all duration-300 cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 .49-3.45"/>
            </svg>
            Try Again
          </button>

          {(errorCode === 'QUOTA_EXCEEDED' || errorCode === 'API_KEY_MISSING' || errorCode === 'API_KEY_INVALID') && (
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                         text-violet-300 bg-violet-500/15 border border-violet-500/30
                         hover:bg-violet-500/25 transition-all duration-200"
            >
              🔑 Get Fresh Key (AI Studio) ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
