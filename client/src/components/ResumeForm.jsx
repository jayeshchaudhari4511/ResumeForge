import { useState } from 'react'

/* ─────────────────────────────────────────────
   Default / initial state shape
───────────────────────────────────────────── */
export const INITIAL_FORM_DATA = {
  // Personal Details
  fullName: '',
  email:    '',
  phone:    '',
  address:  '',
  linkedin: '',
  github:   '',
}

/* ─────────────────────────────────────────────
   Field definitions for Personal Details
───────────────────────────────────────────── */
const PERSONAL_FIELDS = [
  {
    key:         'fullName',
    label:       'Full Name',
    placeholder: 'John Doe',
    type:        'text',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    required: true,
  },
  {
    key:         'email',
    label:       'Email Address',
    placeholder: 'john@example.com',
    type:        'email',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    required: true,
  },
  {
    key:         'phone',
    label:       'Phone Number',
    placeholder: '+1 (555) 000-0000',
    type:        'tel',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l.97-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    required: false,
  },
  {
    key:         'address',
    label:       'Address',
    placeholder: 'San Francisco, CA, USA',
    type:        'text',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    required: false,
  },
  {
    key:         'linkedin',
    label:       'LinkedIn Profile',
    placeholder: 'linkedin.com/in/johndoe',
    type:        'url',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
    required: false,
  },
  {
    key:         'github',
    label:       'GitHub Profile',
    placeholder: 'github.com/johndoe',
    type:        'url',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483
                 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466
                 -.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832
                 .092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688
                 -.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844
                 c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651
                 .64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855
                 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017
                 C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
    required: false,
  },
]

/* ─────────────────────────────────────────────
   Single field component
───────────────────────────────────────────── */
function FormField({ field, value, onChange, touched, onBlur }) {
  const isEmpty   = touched && field.required && !value.trim()
  const isValid   = value.trim().length > 0
  const showCheck = isValid && !isEmpty

  return (
    <div className="space-y-1.5">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <label
          htmlFor={`field-${field.key}`}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider"
        >
          {field.label}
          {field.required && (
            <span className="text-rose-400 text-sm leading-none">*</span>
          )}
        </label>
        {showCheck && (
          <span className="text-emerald-400">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </span>
        )}
      </div>

      {/* Input wrapper */}
      <div className="relative">
        {/* Leading icon */}
        <div className={`absolute inset-y-0 left-3.5 flex items-center pointer-events-none
                         transition-colors duration-200
                         ${isValid ? 'text-primary-400' : 'text-slate-600'}`}>
          {field.icon}
        </div>

        <input
          id={`field-${field.key}`}
          name={field.key}
          type={field.type}
          value={value}
          placeholder={field.placeholder}
          required={field.required}
          autoComplete={field.key === 'email' ? 'email' : field.key === 'phone' ? 'tel' : 'off'}
          onChange={(e) => onChange(field.key, e.target.value)}
          onBlur={() => onBlur(field.key)}
          className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm text-slate-200
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

      {/* Inline error */}
      {isEmpty && (
        <p className="text-xs text-rose-400 flex items-center gap-1 pl-1 animate-fade-in">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
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
   Main ResumeForm component
───────────────────────────────────────────── */
export default function ResumeForm({ data, onChange }) {
  // Track which fields have been touched (for validation UX)
  const [touched, setTouched] = useState({})

  /* Update a single field and bubble up to parent */
  const handleChange = (key, value) => {
    onChange({ ...data, [key]: value })
  }

  /* Mark a field as touched on blur */
  const handleBlur = (key) => {
    setTouched((prev) => ({ ...prev, [key]: true }))
  }

  /* Count filled fields for progress */
  const filledCount = Object.values(data).filter((v) => v.trim?.()).length
  const totalCount  = PERSONAL_FIELDS.length
  const progressPct = Math.round((filledCount / totalCount) * 100)

  return (
    <div className="glass-card p-6 sm:p-8 space-y-8 h-full">

      {/* ── Section header ── */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          {/* Section icon */}
          <div className="w-9 h-9 rounded-xl bg-primary-500/10 border border-primary-500/20
                           flex items-center justify-center text-primary-400 shrink-0">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Personal Details</h2>
            <p className="text-xs text-slate-500">
              This info appears at the top of your resume.
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="pt-2 space-y-1">
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-btn-gradient rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-600">
            <span>{filledCount} of {totalCount} fields filled</span>
            <span>{progressPct}% complete</span>
          </div>
        </div>
      </div>

      {/* ── Fields grid — 2 col on larger screens ── */}
      <div className="grid sm:grid-cols-2 gap-5">
        {PERSONAL_FIELDS.map((field) => (
          <div
            key={field.key}
            /* Full Name and Address span full width */
            className={field.key === 'fullName' || field.key === 'address' ? 'sm:col-span-2' : ''}
          >
            <FormField
              field={field}
              value={data[field.key]}
              onChange={handleChange}
              touched={touched[field.key]}
              onBlur={handleBlur}
            />
          </div>
        ))}
      </div>

      {/* ── Tip banner ── */}
      <div className="flex items-start gap-3 rounded-xl bg-amber-500/5 border border-amber-500/20 p-4">
        <div className="shrink-0 w-6 h-6 rounded-full bg-amber-500/15 flex items-center justify-center mt-0.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8"  x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          <span className="text-amber-400 font-semibold">Pro tip: </span>
          Use a professional email address and make sure your LinkedIn URL is customised
          (e.g. <span className="text-slate-400 font-mono">linkedin.com/in/yourname</span>).
        </p>
      </div>
    </div>
  )
}
