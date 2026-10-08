import { useState, useRef } from 'react'

/* ─────────────────────────────────────────────
   Suggested skill chips (quick-add)
───────────────────────────────────────────── */
const SUGGESTIONS = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue',
  'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Python',
  'Java', 'Tailwind', 'Git', 'Docker', 'Figma',
]

/* Color palette — cycles through for visual variety */
const BADGE_COLORS = [
  { bg: 'bg-blue-500/15',   border: 'border-blue-500/30',   text: 'text-blue-300',   dot: 'bg-blue-400'   },
  { bg: 'bg-violet-500/15', border: 'border-violet-500/30', text: 'text-violet-300', dot: 'bg-violet-400' },
  { bg: 'bg-emerald-500/15',border: 'border-emerald-500/30',text: 'text-emerald-300',dot: 'bg-emerald-400'},
  { bg: 'bg-rose-500/15',   border: 'border-rose-500/30',   text: 'text-rose-300',   dot: 'bg-rose-400'   },
  { bg: 'bg-amber-500/15',  border: 'border-amber-500/30',  text: 'text-amber-300',  dot: 'bg-amber-400'  },
  { bg: 'bg-cyan-500/15',   border: 'border-cyan-500/30',   text: 'text-cyan-300',   dot: 'bg-cyan-400'   },
  { bg: 'bg-pink-500/15',   border: 'border-pink-500/30',   text: 'text-pink-300',   dot: 'bg-pink-400'   },
  { bg: 'bg-indigo-500/15', border: 'border-indigo-500/30', text: 'text-indigo-300', dot: 'bg-indigo-400' },
]

function badgeColor(index) {
  return BADGE_COLORS[index % BADGE_COLORS.length]
}

/* ─────────────────────────────────────────────
   SkillsSection component
   Props:
     skills   → string[]  (from parent)
     onChange → (string[]) => void
───────────────────────────────────────────── */
export default function SkillsSection({ skills, onChange }) {
  const [inputVal, setInputVal] = useState('')
  const [error,    setError]    = useState('')
  const inputRef = useRef(null)

  /* ── Add a skill ── */
  const addSkill = () => {
    const trimmed = inputVal.trim()

    if (!trimmed) {
      setError('Please type a skill first.')
      inputRef.current?.focus()
      return
    }
    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setError(`"${trimmed}" is already added.`)
      inputRef.current?.focus()
      return
    }
    if (trimmed.length > 40) {
      setError('Skill name is too long (max 40 chars).')
      return
    }

    onChange([...skills, trimmed])
    setInputVal('')
    setError('')
    inputRef.current?.focus()
  }

  /* ── Remove a skill by index ── */
  const removeSkill = (index) => {
    onChange(skills.filter((_, i) => i !== index))
  }

  /* ── Quick-add suggestion ── */
  const addSuggestion = (skill) => {
    if (!skills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
      onChange([...skills, skill])
    }
  }

  /* ── Allow Enter key in input ── */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    }
    if (error) setError('')
  }

  const availableSuggestions = SUGGESTIONS.filter(
    (s) => !skills.some((sk) => sk.toLowerCase() === s.toLowerCase())
  )

  return (
    <div className="glass-card p-6 sm:p-8 space-y-7">

      {/* ── Section header ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20
                           flex items-center justify-center text-emerald-400 shrink-0">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6"/>
              <polyline points="8 6 2 12 8 18"/>
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Skills</h2>
            <p className="text-xs text-slate-500">Add technologies and tools you're proficient in.</p>
          </div>
        </div>

        {/* Count badge */}
        {skills.length > 0 && (
          <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full
                           bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-emerald-400 text-xs font-bold tabular-nums">{skills.length}</span>
            <span className="text-[11px] text-slate-500">
              {skills.length === 1 ? 'skill' : 'skills'}
            </span>
          </div>
        )}
      </div>

      {/* ── Input row ── */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Add a Skill
        </label>

        <div className="flex gap-2">
          {/* Text input */}
          <div className="relative flex-1">
            <div className={`absolute inset-y-0 left-3.5 flex items-center pointer-events-none
                              transition-colors duration-200
                              ${inputVal ? 'text-emerald-400' : 'text-slate-600'}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
            </div>
            <input
              id="skill-input"
              ref={inputRef}
              type="text"
              value={inputVal}
              placeholder="e.g. React, Python, Docker…"
              maxLength={40}
              onChange={(e) => { setInputVal(e.target.value); if (error) setError('') }}
              onKeyDown={handleKeyDown}
              className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm text-slate-200
                           bg-white/5 border placeholder-slate-600
                           focus:outline-none focus:ring-1
                           transition-all duration-200
                           ${error
                             ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/30'
                             : 'border-white/10 focus:border-emerald-500 focus:ring-emerald-500/30'
                           }`}
            />
          </div>

          {/* Add button */}
          <button
            id="skill-add-btn"
            onClick={addSkill}
            className="flex items-center gap-2 px-5 py-3 rounded-xl
                       bg-emerald-500/15 border border-emerald-500/30 text-emerald-300
                       text-sm font-semibold
                       hover:bg-emerald-500/25 hover:border-emerald-400/50 hover:text-emerald-200
                       active:scale-95
                       transition-all duration-200 whitespace-nowrap"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5"  y1="12" x2="19" y2="12"/>
            </svg>
            Add Skill
          </button>
        </div>

        {/* Inline error */}
        {error && (
          <p className="text-xs text-rose-400 flex items-center gap-1.5 pl-1 animate-fade-in">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </p>
        )}

        <p className="text-[11px] text-slate-600 pl-1">
          Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-400 font-mono text-[10px]">Enter</kbd> or click <span className="text-emerald-400">Add Skill</span> to save.
        </p>
      </div>

      {/* ── Skill badges ── */}
      {skills.length > 0 ? (
        <div className="space-y-3">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Your Skills
          </p>
          <div className="flex flex-wrap gap-2.5">
            {skills.map((skill, index) => {
              const color = badgeColor(index)
              return (
                <div
                  key={`${skill}-${index}`}
                  id={`skill-badge-${index}`}
                  className={`group flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full
                               border text-sm font-medium
                               ${color.bg} ${color.border} ${color.text}
                               transition-all duration-200 hover:pr-2.5 animate-fade-in`}
                >
                  {/* Dot */}
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${color.dot}`} />

                  {/* Label */}
                  <span>{skill}</span>

                  {/* Remove × */}
                  <button
                    id={`skill-remove-${index}`}
                    onClick={() => removeSkill(index)}
                    aria-label={`Remove ${skill}`}
                    className={`ml-0.5 w-5 h-5 rounded-full flex items-center justify-center
                                 opacity-0 group-hover:opacity-100
                                 hover:bg-white/20
                                 transition-all duration-150`}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6"  x2="6"  y2="18"/>
                      <line x1="6"  y1="6"  x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>

          {/* Clear all */}
          <button
            id="skill-clear-all-btn"
            onClick={() => onChange([])}
            className="text-[11px] text-slate-600 hover:text-rose-400 transition-colors duration-200
                       flex items-center gap-1 mt-1"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            </svg>
            Clear all skills
          </button>
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center gap-3 py-10
                         rounded-xl border border-dashed border-white/10 text-center">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20
                           flex items-center justify-center text-emerald-400/60">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6"/>
              <polyline points="8 6 2 12 8 18"/>
            </svg>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">No skills added yet</p>
            <p className="text-xs text-slate-600 mt-0.5">Type above or pick from suggestions below</p>
          </div>
        </div>
      )}

      {/* ── Quick suggestions ── */}
      {availableSuggestions.length > 0 && (
        <div className="space-y-3">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Quick Add Suggestions
          </p>
          <div className="flex flex-wrap gap-2">
            {availableSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                id={`skill-suggestion-${suggestion.toLowerCase().replace(/\./g, '-')}`}
                onClick={() => addSuggestion(suggestion)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                             border border-white/10 bg-white/5
                             text-xs text-slate-400 font-medium
                             hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-300
                             active:scale-95
                             transition-all duration-150"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5"  y1="12" x2="19" y2="12"/>
                </svg>
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Tip ── */}
      <div className="flex items-start gap-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 p-4">
        <div className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center mt-0.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8"  x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          <span className="text-emerald-400 font-semibold">Pro tip: </span>
          Match your skills to keywords in the job description — ATS systems scan for exact matches.
          Aim for 8–12 relevant skills.
        </p>
      </div>
    </div>
  )
}
