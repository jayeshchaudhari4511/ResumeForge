/* ─────────────────────────────────────────────────────────────
   JobMatchAnalyzer.jsx
   Unique feature: paste a job description, instantly see how
   well your resume skills match — with a circular ATS score,
   matched/missing skill breakdown, and actionable suggestions.

   100% offline · No API · Pure React + Tailwind
───────────────────────────────────────────────────────────── */
import { useState, useMemo } from 'react'

/* ── Common English stop-words to ignore during extraction ── */
const STOP_WORDS = new Set([
  'a','an','and','are','as','at','be','been','being','but','by','do','does',
  'did','for','from','had','has','have','he','her','here','him','his','how',
  'i','if','in','into','is','it','its','just','me','more','my','not','of',
  'on','or','our','out','over','own','re','so','some','than','that','the',
  'their','them','then','there','these','they','this','those','to','too',
  'up','us','was','we','were','what','when','where','which','while','who',
  'will','with','would','you','your','about','after','all','also','any',
  'can','could','each','experience','good','great','have','help','including',
  'knowledge','looking','need','new','please','required','role','should',
  'strong','team','understand','work','working','years','year','must','well',
  'ability','background','candidate','company','develop','following','join',
  'minimum','opportunity','position','preferred','qualifications','skills',
  'responsibilities','using','utilize','various','within','without','proven',
  'excellent','proficient','familiarity','understanding','demonstrated',
])

/* ── Extract meaningful keyword tokens from raw text ── */
function extractKeywords(text) {
  // Normalise — keep alphanumeric, dots, plus, hash (for C#, C++, .NET etc.)
  const cleaned = text
    .replace(/[^\w\s.#+]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  // Collect 1–3 word phrases that are likely tech keywords
  const tokens = new Set()
  const words   = cleaned.split(' ')

  words.forEach((word, i) => {
    const w = word.trim().toLowerCase()
    if (!w || w.length < 2 || STOP_WORDS.has(w)) return

    // Single word
    tokens.add(w)

    // Two-word phrase (e.g. "rest api", "machine learning", "node js")
    if (i + 1 < words.length) {
      const next = words[i + 1].trim().toLowerCase()
      if (next && !STOP_WORDS.has(next)) tokens.add(`${w} ${next}`)
    }

    // Three-word phrase (e.g. "continuous integration delivery")
    if (i + 2 < words.length) {
      const n1 = words[i + 1].trim().toLowerCase()
      const n2 = words[i + 2].trim().toLowerCase()
      if (n1 && n2 && !STOP_WORDS.has(n1) && !STOP_WORDS.has(n2))
        tokens.add(`${w} ${n1} ${n2}`)
    }
  })

  return tokens
}

/* ── Match a single resume skill against extracted JD tokens ── */
function matchSkill(skill, jdTokens) {
  const s = skill.trim().toLowerCase()
  if (!s) return false
  // Direct match
  if (jdTokens.has(s)) return true
  // Partial — skill appears as a substring of any JD token or vice-versa
  for (const token of jdTokens) {
    if (token.includes(s) || s.includes(token)) return true
  }
  return false
}

/* ── Circular SVG progress ring ── */
function CircularProgress({ pct, size = 160, stroke = 12 }) {
  const radius      = (size - stroke) / 2
  const circumf     = 2 * Math.PI * radius
  const filled      = circumf * (pct / 100)
  const scoreColor  =
    pct >= 75 ? '#34d399' :   // emerald
    pct >= 50 ? '#60a5fa' :   // blue
    pct >= 25 ? '#fbbf24' :   // amber
                '#f87171'      // rose

  const gradId = `grad-${pct}`

  return (
    <svg width={size} height={size} className="drop-shadow-lg">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={scoreColor} stopOpacity="1" />
          <stop offset="100%" stopColor={scoreColor} stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Track ring */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={stroke}
      />

      {/* Progress arc */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circumf}`}
        strokeDashoffset={0}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)' }}
      />

      {/* Score text */}
      <text
        x={size / 2} y={size / 2 - 8}
        textAnchor="middle" dominantBaseline="middle"
        fill={scoreColor}
        fontSize="28" fontWeight="800" fontFamily="Inter,sans-serif"
      >
        {pct}%
      </text>
      <text
        x={size / 2} y={size / 2 + 16}
        textAnchor="middle" dominantBaseline="middle"
        fill="rgba(148,163,184,0.8)"
        fontSize="11" fontWeight="600" fontFamily="Inter,sans-serif"
        letterSpacing="1"
      >
        ATS MATCH
      </text>
    </svg>
  )
}

/* ── Score label badge ── */
function ScoreLabel({ pct }) {
  if (pct >= 75) return <span className="text-emerald-400 font-bold">Excellent Match 🎉</span>
  if (pct >= 50) return <span className="text-blue-400    font-bold">Good Match 👍</span>
  if (pct >= 25) return <span className="text-amber-400   font-bold">Partial Match ⚠️</span>
  return               <span className="text-rose-400    font-bold">Low Match ❌</span>
}

/* ── A single skill pill ── */
function SkillPill({ skill, matched }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
                     border transition-all duration-200
                     ${matched
                       ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                       : 'bg-rose-500/10   border-rose-500/30   text-rose-300'
                     }`}
    >
      <span className={`text-base leading-none ${matched ? 'text-emerald-400' : 'text-rose-400'}`}>
        {matched ? '✓' : '✗'}
      </span>
      {skill}
    </div>
  )
}

/* ── Suggestion card ── */
function SuggestionCard({ icon, text, color }) {
  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-xl border
                     ${color.bg} ${color.border} transition-all duration-200
                     hover:-translate-y-0.5 hover:shadow-lg`}
    >
      <span className={`text-lg shrink-0 mt-0.5`}>{icon}</span>
      <p className={`text-sm leading-relaxed ${color.text}`}>{text}</p>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function JobMatchAnalyzer({ skills = [] }) {
  const [jobDesc, setJobDesc] = useState('')

  /* ── Core analysis (memoised — recalculates only when inputs change) ── */
  const analysis = useMemo(() => {
    const jdTrimmed = jobDesc.trim()
    if (!jdTrimmed || skills.length === 0) return null

    const jdTokens = extractKeywords(jdTrimmed)

    // Separate matched vs missing
    const matched = skills.filter(s => matchSkill(s, jdTokens))
    const missing = skills.filter(s => !matchSkill(s, jdTokens))

    const score = skills.length > 0
      ? Math.round((matched.length / skills.length) * 100)
      : 0

    // Extract JD keywords not already in user's skills (potential additions)
    const resumeSet = new Set(skills.map(s => s.trim().toLowerCase()))
    const jdOnlyKeywords = [...jdTokens]
      .filter(token => {
        // Keep only single-word meaningful tokens not already in resume
        if (token.includes(' ')) return false
        if (token.length < 2 || STOP_WORDS.has(token)) return false
        // Skip if already matched by a resume skill
        return !resumeSet.has(token)
      })
      .slice(0, 8)

    // Build contextual suggestions
    const suggestions = []

    missing.forEach(skill => {
      suggestions.push({
        icon: '➕',
        text: `Add "${skill}" to your Skills section — it appears in the job description.`,
        color: {
          bg: 'bg-blue-500/8',
          border: 'border-blue-500/20',
          text: 'text-slate-300',
        },
      })
    })

    jdOnlyKeywords.slice(0, 3).forEach(kw => {
      const title = kw.charAt(0).toUpperCase() + kw.slice(1)
      suggestions.push({
        icon: '📝',
        text: `Mention "${title}" in your Experience or Projects descriptions for better ATS relevance.`,
        color: {
          bg: 'bg-violet-500/8',
          border: 'border-violet-500/20',
          text: 'text-slate-300',
        },
      })
    })

    if (score < 50) {
      suggestions.push({
        icon: '💡',
        text: 'Your match score is below 50%. Consider tailoring your Skills section to mirror the keywords in this job description.',
        color: {
          bg: 'bg-amber-500/8',
          border: 'border-amber-500/20',
          text: 'text-slate-300',
        },
      })
    }

    if (score >= 75) {
      suggestions.push({
        icon: '🚀',
        text: 'Great match! Make sure your work experience bullet points also reflect these keywords for maximum ATS impact.',
        color: {
          bg: 'bg-emerald-500/8',
          border: 'border-emerald-500/20',
          text: 'text-slate-300',
        },
      })
    }

    return { score, matched, missing, jdOnlyKeywords, suggestions }
  }, [jobDesc, skills])

  const hasSkills = skills.length > 0
  const hasJd     = jobDesc.trim().length > 0
  const ready     = hasSkills && hasJd && analysis !== null

  return (
    <div className="space-y-5">

      {/* ── Section header ── */}
      <div className="glass-card p-6 sm:p-7">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="shrink-0 w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/25
                          flex items-center justify-center text-violet-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-white">Job Description Match Analyzer</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold
                               bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase tracking-wider">
                New
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Paste any job description below. We'll instantly compare it against your resume skills
              and compute your ATS match score — entirely offline.
            </p>
          </div>
        </div>

        {/* ── Textarea ── */}
        <div className="mt-5 space-y-2">
          <label
            htmlFor="job-desc-input"
            className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider"
          >
            Paste Job Description
          </label>

          <div className="relative">
            <textarea
              id="job-desc-input"
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              placeholder="Paste the complete job description here."
              rows={7}
              className="w-full px-4 py-3 rounded-xl text-sm text-slate-200 leading-relaxed
                         bg-white/5 border border-white/10 placeholder-slate-600
                         focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30
                         transition-all duration-200 resize-none"
            />
            {/* Character count */}
            {jobDesc.length > 0 && (
              <span className="absolute bottom-3 right-3 text-[10px] text-slate-600 font-mono">
                {jobDesc.length} chars
              </span>
            )}
          </div>

          {/* Helper row */}
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] text-slate-600">
              {!hasSkills
                ? '⚠️ Go to the Skills tab and add your skills first.'
                : !hasJd
                  ? 'Paste a job description above to run the analysis.'
                  : `Comparing against ${skills.length} resume skill${skills.length !== 1 ? 's' : ''}.`
              }
            </p>
            {jobDesc.length > 0 && (
              <button
                id="jma-clear-btn"
                onClick={() => setJobDesc('')}
                className="text-[11px] text-slate-600 hover:text-rose-400 transition-colors duration-200
                           flex items-center gap-1 whitespace-nowrap"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Empty / waiting state ── */}
      {!ready && (
        <div className="glass-card p-10 flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20
                          flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
              stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-300">Waiting for analysis</p>
            <p className="text-xs text-slate-600 max-w-xs">
              {!hasSkills
                ? 'Add skills in the Skills tab, then come back here.'
                : 'Paste a job description above to see your ATS match score.'}
            </p>
          </div>
          {/* Shimmer skeleton */}
          <div className="w-full max-w-xs space-y-2 opacity-20 animate-pulse-slow mt-2">
            {[80, 60, 70, 50].map((w, i) => (
              <div key={i} className="h-2 bg-slate-700 rounded" style={{ width: `${w}%`, margin: '0 auto' }}/>
            ))}
          </div>
        </div>
      )}

      {/* ── Results ── */}
      {ready && (
        <div className="space-y-5 animate-fade-in">

          {/* ── Score card ── */}
          <div className="glass-card p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-8">

              {/* Circular progress */}
              <div className="shrink-0 flex flex-col items-center gap-3">
                <CircularProgress pct={analysis.score} size={160} stroke={12} />
                <ScoreLabel pct={analysis.score} />
              </div>

              {/* Stats column */}
              <div className="flex-1 w-full space-y-4">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Match Breakdown</h3>

                {/* Matched count */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"/>
                      Matched Skills
                    </span>
                    <span className="font-bold text-emerald-400 tabular-nums">
                      {analysis.matched.length} / {skills.length}
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700"
                      style={{ width: `${(analysis.matched.length / skills.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Missing count */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-400 inline-block"/>
                      Missing Skills
                    </span>
                    <span className="font-bold text-rose-400 tabular-nums">
                      {analysis.missing.length} / {skills.length}
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full transition-all duration-700"
                      style={{ width: `${(analysis.missing.length / skills.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* ATS score pill */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-slate-600">ATS Score:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border
                    ${analysis.score >= 75
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : analysis.score >= 50
                        ? 'bg-blue-500/15 border-blue-500/30 text-blue-300'
                        : analysis.score >= 25
                          ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                          : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                    }`}
                  >
                    {analysis.score}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Matched & Missing skills ── */}
          <div className="grid sm:grid-cols-2 gap-5">

            {/* Matched */}
            <div className="glass-card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/25
                                flex items-center justify-center">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-white">
                  Matched Skills
                  <span className="ml-2 text-xs font-normal text-emerald-400">({analysis.matched.length})</span>
                </h4>
              </div>

              {analysis.matched.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.matched.map((skill, i) => (
                    <SkillPill key={`m-${i}`} skill={skill} matched />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-600 italic py-4 text-center">
                  None of your skills matched the job description yet.
                </p>
              )}
            </div>

            {/* Missing */}
            <div className="glass-card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/25
                                flex items-center justify-center">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-white">
                  Missing Skills
                  <span className="ml-2 text-xs font-normal text-rose-400">({analysis.missing.length})</span>
                </h4>
              </div>

              {analysis.missing.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.missing.map((skill, i) => (
                    <SkillPill key={`x-${i}`} skill={skill} matched={false} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-4 text-center">
                  <span className="text-2xl">🎯</span>
                  <p className="text-xs text-emerald-400 font-semibold">All skills matched!</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Suggestions ── */}
          {analysis.suggestions.length > 0 && (
            <div className="glass-card p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/25
                                flex items-center justify-center">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-white">
                  Suggestions to Improve Your Match
                </h4>
              </div>

              <div className="space-y-2.5">
                {analysis.suggestions.map((s, i) => (
                  <SuggestionCard key={i} icon={s.icon} text={s.text} color={s.color} />
                ))}
              </div>
            </div>
          )}

          {/* ── JD-only keywords spotted ── */}
          {analysis.jdOnlyKeywords.length > 0 && (
            <div className="glass-card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/25
                                flex items-center justify-center">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Keywords Spotted in Job Description</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Consider adding these to your resume if you have experience with them.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {analysis.jdOnlyKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full text-xs font-medium
                               bg-cyan-500/10 border border-cyan-500/25 text-cyan-300"
                  >
                    {kw.charAt(0).toUpperCase() + kw.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Footer tip ── */}
          <div className="flex items-start gap-3 rounded-xl bg-violet-500/5 border border-violet-500/15 p-4">
            <div className="shrink-0 w-6 h-6 rounded-full bg-violet-500/15 flex items-center justify-center mt-0.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8"  x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              <span className="text-violet-400 font-semibold">How it works: </span>
              We extract every meaningful keyword from the job description and fuzzy-match it against
              your resume skills. Aim for a score of <span className="text-slate-300">75%+</span> for
              the best chance of passing ATS filters. All analysis happens in your browser — no data is
              sent anywhere.
            </p>
          </div>

        </div>
      )}
    </div>
  )
}
