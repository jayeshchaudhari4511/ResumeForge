import { useState } from 'react'

/* ─────────────────────────────────────────────
   Shape of one experience record
───────────────────────────────────────────── */
export const EMPTY_EXPERIENCE = {
  companyName:  '',
  role:         '',
  duration:     '',
  description:  '',
}

/* ─────────────────────────────────────────────
   Field definitions per record
───────────────────────────────────────────── */
const EXP_FIELDS = [
  {
    key:         'companyName',
    label:       'Company Name',
    placeholder: 'Google, Amazon, Startup Inc…',
    type:        'text',
    span:        'sm:col-span-2',
    required:    true,
    rows:        null,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
  },
  {
    key:         'role',
    label:       'Job Role / Title',
    placeholder: 'Software Engineer, UX Designer…',
    type:        'text',
    span:        '',
    required:    true,
    rows:        null,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    key:         'duration',
    label:       'Duration',
    placeholder: 'Jan 2022 – Present',
    type:        'text',
    span:        '',
    required:    false,
    rows:        null,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2"  x2="16" y2="6"/>
        <line x1="8"  y1="2"  x2="8"  y2="6"/>
        <line x1="3"  y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    key:         'description',
    label:       'Key Responsibilities & Achievements',
    placeholder: 'Describe your role, what you built, and the impact you made…\n• Led a team of 4 engineers to ship a new checkout flow\n• Improved API response time by 40%',
    type:        'textarea',
    span:        'sm:col-span-2',
    required:    false,
    rows:        4,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="17" y1="10" x2="3" y2="10"/>
        <line x1="21" y1="6"  x2="3" y2="6"/>
        <line x1="21" y1="14" x2="3" y2="14"/>
        <line x1="17" y1="18" x2="3" y2="18"/>
      </svg>
    ),
  },
]

/* ─────────────────────────────────────────────
   Single field inside a card
───────────────────────────────────────────── */
function ExpField({ field, value, onChange, touched, onBlur }) {
  const isEmpty  = touched && field.required && !value.trim()
  const isValid  = value.trim().length > 0

  const baseInput = `w-full pl-9 pr-3 rounded-xl text-sm text-slate-200
                     bg-white/5 border placeholder-slate-600
                     focus:outline-none focus:ring-1
                     transition-all duration-200
                     ${isEmpty
                       ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/30'
                       : isValid
                         ? 'border-emerald-500/40 focus:border-primary-500 focus:ring-primary-500/30'
                         : 'border-white/10 focus:border-primary-500 focus:ring-primary-500/30'
                     }`

  return (
    <div className={`space-y-1.5 ${field.span}`}>
      {/* Label row */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1 text-[11px] font-semibold
                           text-slate-400 uppercase tracking-wider">
          {field.label}
          {field.required && <span className="text-rose-400">*</span>}
        </label>
        {isValid && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
      </div>

      {/* Input / Textarea */}
      <div className="relative">
        <div className={`absolute left-3 flex items-center pointer-events-none
                          transition-colors duration-200
                          ${field.type === 'textarea' ? 'top-3' : 'inset-y-0'}
                          ${isValid ? 'text-primary-400' : 'text-slate-600'}`}>
          {field.icon}
        </div>

        {field.type === 'textarea' ? (
          <textarea
            value={value}
            placeholder={field.placeholder}
            rows={field.rows}
            onChange={(e) => onChange(field.key, e.target.value)}
            onBlur={() => onBlur(field.key)}
            className={`${baseInput} py-3 resize-none`}
          />
        ) : (
          <input
            type={field.type}
            value={value}
            placeholder={field.placeholder}
            onChange={(e) => onChange(field.key, e.target.value)}
            onBlur={() => onBlur(field.key)}
            className={`${baseInput} py-2.5`}
          />
        )}
      </div>

      {/* Inline error */}
      {isEmpty && (
        <p className="text-[11px] text-rose-400 flex items-center gap-1 pl-1 animate-fade-in">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {field.label} is required
        </p>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Single experience card
───────────────────────────────────────────── */
function ExperienceCard({ record, index, total, onChange, onRemove }) {
  const [touched,  setTouched]  = useState({})
  const [expanded, setExpanded] = useState(true)   // start open

  const handleBlur   = (key) => setTouched((p) => ({ ...p, [key]: true }))
  const handleChange = (key, val) => onChange(index, { ...record, [key]: val })

  const isComplete = record.companyName.trim() && record.role.trim()

  /* Preview line shown in collapsed header */
  const previewLabel = record.companyName
    ? `${record.role ? record.role + ' @ ' : ''}${record.companyName}`
    : `Experience #${index + 1}`

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02]
                     hover:border-primary-500/20 transition-all duration-300 overflow-hidden group">

      {/* ── Card header ── */}
      <div className="flex items-center justify-between px-5 py-3.5
                       bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-2.5 min-w-0">

          {/* Status badge */}
          <div className={`shrink-0 w-6 h-6 rounded-lg flex items-center justify-center
                            text-xs font-bold transition-colors duration-300
                            ${isComplete
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-primary-500/15 text-primary-400 border border-primary-500/25'
                            }`}>
            {isComplete
              ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              : index + 1
            }
          </div>

          {/* Title */}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate leading-none">
              {previewLabel}
            </p>
            {record.duration && (
              <p className="text-[11px] text-slate-500 mt-0.5">{record.duration}</p>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 shrink-0 ml-3">
          {/* Collapse toggle */}
          <button
            onClick={() => setExpanded((p) => !p)}
            title={expanded ? 'Collapse' : 'Expand'}
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10
                        transition-all duration-200"
          >
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {/* Remove */}
          <button
            id={`exp-remove-${index}`}
            onClick={() => onRemove(index)}
            title="Remove experience"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                        text-xs font-medium text-slate-500
                        hover:text-rose-400 hover:bg-rose-500/10
                        transition-all duration-200"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
            Remove
          </button>
        </div>
      </div>

      {/* ── Collapsible fields ── */}
      <div className={`transition-all duration-300 overflow-hidden
                        ${expanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="grid sm:grid-cols-2 gap-4 p-5">
          {EXP_FIELDS.map((field) => (
            <ExpField
              key={field.key}
              field={field}
              value={record[field.key]}
              onChange={handleChange}
              touched={touched[field.key]}
              onBlur={handleBlur}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main ExperienceSection component
   Props:
     experienceList → ExperienceRecord[]
     onChange       → (ExperienceRecord[]) => void
───────────────────────────────────────────── */
export default function ExperienceSection({ experienceList, onChange }) {

  const handleAdd = () => {
    onChange([...experienceList, { ...EMPTY_EXPERIENCE }])
  }

  const handleChange = (index, updated) => {
    onChange(experienceList.map((r, i) => (i === index ? updated : r)))
  }

  const handleRemove = (index) => {
    if (experienceList.length === 1) {
      onChange([{ ...EMPTY_EXPERIENCE }])   // reset last card
      return
    }
    onChange(experienceList.filter((_, i) => i !== index))
  }

  const completedCount = experienceList.filter(
    (r) => r.companyName.trim() && r.role.trim()
  ).length

  return (
    <div className="glass-card p-6 sm:p-8 space-y-6">

      {/* ── Section header ── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20
                           flex items-center justify-center text-rose-400 shrink-0">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Work Experience</h2>
            <p className="text-xs text-slate-500">
              {completedCount} of {experienceList.length}{' '}
              {experienceList.length === 1 ? 'record' : 'records'} complete
            </p>
          </div>
        </div>

        {/* Record count pill */}
        <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full
                         bg-rose-500/10 border border-rose-500/20">
          <span className="text-rose-400 text-xs font-bold tabular-nums">
            {experienceList.length}
          </span>
          <span className="text-[11px] text-slate-500">
            {experienceList.length === 1 ? 'role' : 'roles'}
          </span>
        </div>
      </div>

      {/* ── Experience cards ── */}
      <div className="space-y-4">
        {experienceList.map((record, index) => (
          <ExperienceCard
            key={index}
            record={record}
            index={index}
            total={experienceList.length}
            onChange={handleChange}
            onRemove={handleRemove}
          />
        ))}
      </div>

      {/* ── Add Experience button ── */}
      <button
        id="exp-add-btn"
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-2
                   py-3 rounded-xl border border-dashed border-white/15
                   text-sm font-medium text-slate-400
                   hover:border-rose-500/50 hover:text-rose-400 hover:bg-rose-500/5
                   active:scale-[0.98]
                   transition-all duration-200"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8"  x2="12" y2="16"/>
          <line x1="8"  y1="12" x2="16" y2="12"/>
        </svg>
        + Add Experience
      </button>

      {/* ── Tip ── */}
      <div className="flex items-start gap-3 rounded-xl bg-rose-500/5
                       border border-rose-500/15 p-4">
        <div className="shrink-0 w-6 h-6 rounded-full bg-rose-500/15
                         flex items-center justify-center mt-0.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="#fb7185" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8"  x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          <span className="text-rose-400 font-semibold">Pro tip: </span>
          Start bullet points with strong action verbs — <span className="text-slate-400 italic">Led, Built, Increased, Shipped, Optimised</span>.
          Quantify your impact wherever possible (e.g. "Reduced load time by 35%").
        </p>
      </div>
    </div>
  )
}
