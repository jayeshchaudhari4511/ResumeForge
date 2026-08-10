interface AtsIssuesProps {
  issues: string[]
}

/**
 * Warning cards displaying ATS compatibility issues.
 */
export default function AtsIssues({ issues }: AtsIssuesProps) {
  if (issues.length === 0) {
    return (
      <div className="glass-card p-5 sm:p-6 space-y-3" role="region" aria-label="ATS issues">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25
                          flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">ATS Compatibility</h3>
        </div>
        <div className="flex items-center gap-2 py-3 px-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
          <span className="text-lg">🛡️</span>
          <p className="text-sm text-emerald-400 font-medium">No ATS issues detected!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card p-5 sm:p-6 space-y-4" role="region" aria-label="ATS issues">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/25
                        flex items-center justify-center">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          ATS Issues
          <span className="ml-2 text-xs font-normal text-amber-400">({issues.length})</span>
        </h3>
      </div>

      <div className="space-y-2">
        {issues.map((issue, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-xl
                       bg-amber-500/5 border border-amber-500/15
                       hover:-translate-y-0.5 transition-all duration-200"
          >
            <span className="shrink-0 mt-0.5 text-amber-400 text-sm">⚠️</span>
            <p className="text-sm text-slate-300 leading-relaxed">{issue}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
