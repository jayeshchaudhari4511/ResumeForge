interface MissingSkillsProps {
  skills: string[]
}

/**
 * Displays missing skills as red/amber pills.
 */
export default function MissingSkills({ skills }: MissingSkillsProps) {
  if (skills.length === 0) {
    return (
      <div className="glass-card p-5 sm:p-6 space-y-3" role="region" aria-label="Missing skills">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25
                          flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Missing Skills</h3>
        </div>
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <span className="text-2xl">🎯</span>
          <p className="text-xs text-emerald-400 font-semibold">No missing skills detected!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card p-5 sm:p-6 space-y-4" role="region" aria-label="Missing skills">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/25
                        flex items-center justify-center">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Missing Skills
          <span className="ml-2 text-xs font-normal text-rose-400">({skills.length})</span>
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <span
            key={i}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                       bg-rose-500/10 border border-rose-500/25 text-rose-300
                       hover:bg-rose-500/15 transition-colors duration-200"
          >
            <span className="text-rose-400 text-xs">✗</span>
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}
