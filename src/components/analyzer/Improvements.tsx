interface ImprovementsProps {
  improvements: string[]
}

/**
 * Numbered list of recommended improvements with actionable styling.
 */
export default function Improvements({ improvements }: ImprovementsProps) {
  if (improvements.length === 0) return null

  return (
    <div className="glass-card p-5 sm:p-6 space-y-4" role="region" aria-label="Recommended improvements">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/25
                        flex items-center justify-center">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
        </div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Recommended Improvements
          <span className="ml-2 text-xs font-normal text-blue-400">({improvements.length})</span>
        </h3>
      </div>

      <ol className="space-y-2">
        {improvements.map((improvement, i) => (
          <li
            key={i}
            className="flex items-start gap-3 p-3.5 rounded-xl
                       bg-blue-500/5 border border-blue-500/15
                       hover:-translate-y-0.5 transition-all duration-200"
          >
            <span className="shrink-0 w-6 h-6 rounded-full bg-blue-500/20
                             flex items-center justify-center text-xs font-bold text-blue-400">
              {i + 1}
            </span>
            <p className="text-sm text-slate-300 leading-relaxed">{improvement}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
