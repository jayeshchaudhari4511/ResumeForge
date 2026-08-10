import type { KeywordCoverage } from '../../types/analysis'

interface KeywordTableProps {
  keywords: KeywordCoverage[]
}

/**
 * Displays keyword coverage as a visual table with found/not-found indicators.
 */
export default function KeywordTable({ keywords }: KeywordTableProps) {
  if (keywords.length === 0) return null

  const found = keywords.filter(k => k.found).length
  const total = keywords.length
  const coverage = Math.round((found / total) * 100)

  return (
    <div className="glass-card p-5 sm:p-6 space-y-4" role="region" aria-label="ATS keyword coverage">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/25
                          flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            ATS Keywords
          </h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border
          ${coverage >= 70
            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
            : coverage >= 40
              ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
              : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
          }`}
        >
          {found}/{total} ({coverage}%)
        </span>
      </div>

      {/* Coverage bar */}
      <div className="space-y-1">
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-700"
            style={{ width: `${coverage}%` }}
          />
        </div>
      </div>

      {/* Keyword grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {keywords.map((kw, i) => (
          <div
            key={i}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm
                        border transition-all duration-200
                        ${kw.found
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-300'
                          : 'bg-rose-500/5 border-rose-500/20 text-slate-400'
                        }`}
          >
            <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold
              ${kw.found
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/20 text-rose-400'
              }`}
            >
              {kw.found ? '✓' : '✗'}
            </span>
            <span className="truncate">{kw.keyword}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
