import { useState } from 'react'

/* ─────────────────────────────────────────────
   Shape of one education record
───────────────────────────────────────────── */
export const EMPTY_EDUCATION = {
  collegeName: '',
  degree:      '',
  cgpa:        '',
  year:        '',
}

/* ─────────────────────────────────────────────
   Field definitions per record
───────────────────────────────────────────── */
const EDU_FIELDS = [
  {
    key:         'collegeName',
    label:       'College / University',
    placeholder: 'Stanford University',
    type:        'text',
    span:        'sm:col-span-2',   // full row
    required:    true,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
  },
  {
    key:         'degree',
    label:       'Degree / Programme',
    placeholder: 'B.Sc. Computer Science',
    type:        'text',
    span:        'sm:col-span-2',   // full row
    required:    true,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
  },
  {
    key:         'cgpa',
    label:       'CGPA / Score',
    placeholder: '8.5 / 10',
    type:        'text',
    span:        '',                 // half row
    required:    false,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    key:         'year',
    label:       'Graduation Year',
    placeholder: '2024',
    type:        'text',
    span:        '',                 // half row
    required:    false,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8"  y1="2" x2="8"  y2="6"/>
        <line x1="3"  y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
]

/* ─────────────────────────────────────────────
   Single inline field inside a record card
───────────────────────────────────────────── */
function EduField({ field, value, onChange, touched, onBlur }) {
  const isEmpty   = touched && field.required && !value.trim()
  const isValid   = value.trim().length > 0

  return (
    <div className={`space-y-1.5 ${field.span}`}>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
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

      <div className="relative">
        <div className={`absolute inset-y-0 left-3 flex items-center pointer-events-none
                         transition-colors duration-200
                         ${isValid ? 'text-primary-400' : 'text-slate-600'}`}>
          {field.icon}
        </div>
        <input
          type={field.type}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(field.key, e.target.value)}
          onBlur={() => onBlur(field.key)}
          className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-sm text-slate-200
                       bg-white/5 border placeholder-slate-600
                       focus:outline-none focus:ring-1
                       transition-all duration-200
                       ${isEmpty
                         ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/30'
                         : isValid
                           ? 'border-emerald-500/40 focus:border-primary-500 focus:ring-primary-500/30'
                           : 'border-white/10 focus:border-primary-500 focus:ring-primary-500/30'
                       }`}
        />
      </div>

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
   Single education record card
───────────────────────────────────────────── */
function EducationCard({ record, index, total, onChange, onRemove }) {
  const [touched, setTouched] = useState({})

  const handleBlur  = (key) => setTouched((prev) => ({ ...prev, [key]: true }))
  const handleChange = (key, value) => onChange(index, { ...record, [key]: value })

  const isComplete = record.collegeName.trim() && record.degree.trim()

  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/3
                     hover:border-primary-500/25 transition-all duration-300 overflow-hidden group">

      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-3.5
                       bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          {/* Index badge */}
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold
                            transition-colors duration-300
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

          <div>
            <p className="text-sm font-semibold text-white leading-none">
              {record.collegeName || `Education #${index + 1}`}
            </p>
            {record.degree && (
              <p className="text-[11px] text-slate-500 mt-0.5">{record.degree}</p>
            )}
          </div>
        </div>

        {/* Remove button — always show but subtle when only 1 record */}
        <button
          id={`edu-remove-${index}`}
          onClick={() => onRemove(index)}
          title="Remove this education record"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                       transition-all duration-200
                       ${total === 1
                         ? 'text-slate-600 hover:text-rose-400 hover:bg-rose-500/10'
                         : 'text-slate-500 hover:text-rose-400 hover:bg-rose-500/10'
                       }`}
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

      {/* Fields grid */}
      <div className="grid sm:grid-cols-2 gap-4 p-5">
        {EDU_FIELDS.map((field) => (
          <EduField
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
  )
}

/* ─────────────────────────────────────────────
   Main EducationSection component
   Props:
     educationList  → array of education records (from parent)
     onChange       → (updatedArray) => void
───────────────────────────────────────────── */
export default function EducationSection({ educationList, onChange }) {

  /* Add a blank record */
  const handleAdd = () => {
    onChange([...educationList, { ...EMPTY_EDUCATION }])
  }

  /* Update one record by index */
  const handleChange = (index, updated) => {
    const next = educationList.map((rec, i) => (i === index ? updated : rec))
    onChange(next)
  }

  /* Remove a record by index */
  const handleRemove = (index) => {
    if (educationList.length === 1) {
      // Reset the last card instead of removing it entirely
      onChange([{ ...EMPTY_EDUCATION }])
      return
    }
    onChange(educationList.filter((_, i) => i !== index))
  }

  const filledCount = educationList.filter(
    (r) => r.collegeName.trim() && r.degree.trim()
  ).length

  return (
    <div className="glass-card p-6 sm:p-8 space-y-6">

      {/* ── Section header ── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20
                           flex items-center justify-center text-violet-400 shrink-0">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Education</h2>
            <p className="text-xs text-slate-500">
              {filledCount} of {educationList.length}{' '}
              {educationList.length === 1 ? 'record' : 'records'} complete
            </p>
          </div>
        </div>

        {/* Record count pill */}
        <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full
                         bg-violet-500/10 border border-violet-500/20">
          <span className="text-violet-400 text-xs font-bold tabular-nums">
            {educationList.length}
          </span>
          <span className="text-[11px] text-slate-500">
            {educationList.length === 1 ? 'record' : 'records'}
          </span>
        </div>
      </div>

      {/* ── Education cards ── */}
      <div className="space-y-4">
        {educationList.map((record, index) => (
          <EducationCard
            key={index}
            record={record}
            index={index}
            total={educationList.length}
            onChange={handleChange}
            onRemove={handleRemove}
          />
        ))}
      </div>

      {/* ── Add Education button ── */}
      <button
        id="edu-add-btn"
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-2
                   py-3 rounded-xl border border-dashed border-white/15
                   text-sm font-medium text-slate-400
                   hover:border-violet-500/50 hover:text-violet-400 hover:bg-violet-500/5
                   active:scale-[0.98]
                   transition-all duration-200"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="16"/>
          <line x1="8"  y1="12" x2="16" y2="12"/>
        </svg>
        + Add Education
      </button>

      {/* ── Tip ── */}
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
          <span className="text-violet-400 font-semibold">Pro tip: </span>
          List your most recent or most relevant education first.
          Include your CGPA only if it's above 7.0 / 3.5.
        </p>
      </div>
    </div>
  )
}
