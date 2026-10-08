interface StrengthsListProps {
  strengths: string[]
}

/**
 * Displays resume strengths as a list of green-accented cards.
 */
export default function StrengthsList({ strengths }: StrengthsListProps) {
  if (strengths.length === 0) return null

  return (
    <div className="glass-card p-5 sm:p-6 space-y-4" role="region" aria-label="Resume strengths">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25
                        flex items-center justify-center">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Strengths
          <span className="ml-2 text-xs font-normal text-emerald-400">({strengths.length})</span>
        </h3>
      </div>

      <ul className="space-y-2">
        {strengths.map((strength, i) => (
          <li
            key={i}
            className="flex items-start gap-3 p-3 rounded-xl
                       bg-emerald-500/5 border border-emerald-500/15
                       hover:-translate-y-0.5 transition-all duration-200"
          >
            <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-emerald-500/20
                             flex items-center justify-center text-xs text-emerald-400 font-bold">
              ✓
            </span>
            <p className="text-sm text-slate-300 leading-relaxed">{strength}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
