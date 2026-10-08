/**
 * Loading skeleton for the analysis dashboard.
 * Shows animated shimmer placeholders for each result section.
 */
export default function AnalysisSkeleton() {
  return (
    <div className="space-y-5 animate-fade-in" role="status" aria-label="Loading analysis">
      <span className="sr-only">Analyzing your resume against the job description...</span>

      {/* Header with progress message */}
      <div className="glass-card p-6 sm:p-8 flex flex-col items-center gap-4 text-center">
        {/* Spinning AI icon */}
        <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20
                        flex items-center justify-center animate-pulse">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            className="animate-spin" style={{ animationDuration: '3s' }}>
            <circle cx="12" cy="12" r="10" strokeDasharray="20 40"/>
          </svg>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-violet-300">AI Analysis in Progress</p>
          <p className="text-xs text-slate-600">
            Gemini is reviewing your resume against the job description...
          </p>
        </div>

        {/* Progress shimmer bar */}
        <div className="w-full max-w-xs">
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-gradient-to-r from-violet-500/50 to-violet-400/20 rounded-full
                            animate-pulse" style={{ animationDuration: '1.5s' }}/>
          </div>
        </div>
      </div>

      {/* Score card skeleton */}
      <div className="glass-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Circular ring placeholder */}
          <div className="shrink-0">
            <div className="w-[180px] h-[180px] rounded-full border-[14px] border-white/5 animate-pulse"/>
          </div>
          {/* Stats skeleton */}
          <div className="flex-1 w-full space-y-4">
            <div className="h-3 w-32 bg-white/5 rounded animate-pulse"/>
            <div className="space-y-3">
              <div className="h-2 bg-white/5 rounded-full animate-pulse"/>
              <div className="h-2 bg-white/5 rounded-full animate-pulse" style={{ width: '80%' }}/>
            </div>
            <div className="space-y-3">
              <div className="h-2 bg-white/5 rounded-full animate-pulse" style={{ width: '60%' }}/>
              <div className="h-2 bg-white/5 rounded-full animate-pulse" style={{ width: '40%' }}/>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column skeleton */}
      <div className="grid sm:grid-cols-2 gap-5">
        <SkeletonCard lines={4} />
        <SkeletonCard lines={3} />
      </div>

      {/* Full-width skeleton cards */}
      <SkeletonCard lines={5} />
      <SkeletonCard lines={3} />
    </div>
  )
}

function SkeletonCard({ lines }: { lines: number }) {
  return (
    <div className="glass-card p-5 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-white/5 animate-pulse"/>
        <div className="h-3 w-28 bg-white/5 rounded animate-pulse"/>
      </div>
      <div className="space-y-2">
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className="h-2.5 bg-white/5 rounded animate-pulse"
            style={{
              width: `${70 + Math.random() * 30}%`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
