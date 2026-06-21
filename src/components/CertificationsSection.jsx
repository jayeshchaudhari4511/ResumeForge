import { useState } from 'react'

/* ─────────────────────────────────────────────
   Shape of one certification record
───────────────────────────────────────────── */
export const EMPTY_CERTIFICATION = {
  certName:     '',
  organization: '',
  year:         '',
}

/* ─────────────────────────────────────────────
   Popular certification suggestions
───────────────────────────────────────────── */
const CERT_SUGGESTIONS = [
  { name: 'AWS Certified Developer',          org: 'Amazon Web Services' },
  { name: 'Google Cloud Associate',           org: 'Google'              },
  { name: 'Meta Front-End Developer',         org: 'Meta'                },
  { name: 'Microsoft Azure Fundamentals',     org: 'Microsoft'           },
  { name: 'Certified Kubernetes Administrator', org: 'CNCF'              },
  { name: 'React – The Complete Guide',       org: 'Udemy'               },
]

/* ─────────────────────────────────────────────
   Inline field for a certification card
───────────────────────────────────────────── */
function CertField({ id, label, placeholder, value, onChange, onBlur, touched, required, icon, type = 'text' }) {
  const isEmpty  = touched && required && !value.trim()
  const isValid  = value.trim().length > 0

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="flex items-center gap-1 text-[11px] font-semibold
                     text-slate-400 uppercase tracking-wider"
        >
          {label}
          {required && <span className="text-rose-400">*</span>}
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
                         ${isValid ? 'text-amber-400' : 'text-slate-600'}`}>
          {icon}
        </div>
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-sm text-slate-200
                       bg-white/5 border placeholder-slate-600
                       focus:outline-none focus:ring-1
                       transition-all duration-200
                       ${isEmpty
                         ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/30'
                         : isValid
                           ? 'border-emerald-500/40 focus:border-amber-500 focus:ring-amber-500/30'
                           : 'border-white/10 focus:border-amber-500 focus:ring-amber-500/30'
                       }`}
        />
      </div>

      {isEmpty && (
        <p className="text-[11px] text-rose-400 flex items-center gap-1 pl-1 animate-fade-in">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8"  x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {label} is required
        </p>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Icons used inside cards
───────────────────────────────────────────── */
const IconCert = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8"  r="6"/>
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
)
const IconOrg = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const IconYear = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2"  x2="16" y2="6"/>
    <line x1="8"  y1="2"  x2="8"  y2="6"/>
    <line x1="3"  y1="10" x2="21" y2="10"/>
  </svg>
)

/* ─────────────────────────────────────────────
   Single certification card
───────────────────────────────────────────── */
function CertCard({ record, index, total, onChange, onDelete }) {
  const [touched, setTouched] = useState({})

  const handleBlur   = (key) => setTouched((p) => ({ ...p, [key]: true }))
  const handleChange = (key, val) => onChange(index, { ...record, [key]: val })

  const isComplete = record.certName.trim() && record.organization.trim()

  /* Ribbon color for visual variety */
  const ribbonColors = [
    'from-amber-500   to-yellow-500',
    'from-blue-500    to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-violet-500  to-purple-600',
    'from-rose-500    to-pink-600',
    'from-cyan-500    to-sky-600',
  ]
  const ribbon = ribbonColors[index % ribbonColors.length]

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02]
                     hover:border-amber-500/25 transition-all duration-300 overflow-hidden group">

      {/* ── Card header ── */}
      <div className="flex items-center justify-between px-5 py-3.5
                       bg-white/5 border-b border-white/10">

        <div className="flex items-center gap-3 min-w-0">
          {/* Colored medal ribbon */}
          <div className={`shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br ${ribbon}
                            flex items-center justify-center text-white shadow-glow`}>
            {isComplete
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="6"/>
                  <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                </svg>
            }
          </div>

          {/* Title preview */}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate leading-none">
              {record.certName || `Certification #${index + 1}`}
            </p>
            {(record.organization || record.year) && (
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                {[record.organization, record.year].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
        </div>

        {/* Delete button */}
        <button
          id={`cert-delete-${index}`}
          onClick={() => onDelete(index)}
          title="Delete certification"
          className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                      text-xs font-medium text-slate-500 ml-3
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
          Delete
        </button>
      </div>

      {/* ── Fields ── */}
      <div className="grid sm:grid-cols-2 gap-4 p-5">
        {/* Cert Name — full row */}
        <div className="sm:col-span-2">
          <CertField
            id={`cert-name-${index}`}
            label="Certification Name"
            placeholder="AWS Certified Developer, Google Cloud Associate…"
            value={record.certName}
            onChange={(v) => handleChange('certName', v)}
            onBlur={() => handleBlur('certName')}
            touched={touched.certName}
            required
            icon={IconCert}
          />
        </div>

        {/* Org — half */}
        <CertField
          id={`cert-org-${index}`}
          label="Issuing Organization"
          placeholder="Amazon, Google, Microsoft…"
          value={record.organization}
          onChange={(v) => handleChange('organization', v)}
          onBlur={() => handleBlur('organization')}
          touched={touched.organization}
          required
          icon={IconOrg}
        />

        {/* Year — half */}
        <CertField
          id={`cert-year-${index}`}
          label="Year"
          placeholder="2024"
          value={record.year}
          onChange={(v) => handleChange('year', v)}
          onBlur={() => handleBlur('year')}
          touched={false}
          required={false}
          icon={IconYear}
          type="text"
        />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main CertificationsSection component
   Props:
     certifications → CertRecord[]
     onChange       → (CertRecord[]) => void
───────────────────────────────────────────── */
export default function CertificationsSection({ certifications, onChange }) {

  const handleAdd = () => {
    onChange([...certifications, { ...EMPTY_CERTIFICATION }])
  }

  const handleChange = (index, updated) => {
    onChange(certifications.map((r, i) => (i === index ? updated : r)))
  }

  const handleDelete = (index) => {
    if (certifications.length === 1) {
      onChange([{ ...EMPTY_CERTIFICATION }])   // reset last instead of removing
      return
    }
    onChange(certifications.filter((_, i) => i !== index))
  }

  const completedCount = certifications.filter(
    (r) => r.certName.trim() && r.organization.trim()
  ).length

  const unusedSuggestions = CERT_SUGGESTIONS.filter(
    (s) => !certifications.some(
      (r) => r.certName.toLowerCase() === s.name.toLowerCase()
    )
  )

  return (
    <div className="glass-card p-6 sm:p-8 space-y-6">

      {/* ── Section header ── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20
                           flex items-center justify-center text-amber-400 shrink-0">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8"  r="6"/>
              <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Certifications</h2>
            <p className="text-xs text-slate-500">
              {completedCount} of {certifications.length}{' '}
              {certifications.length === 1 ? 'certificate' : 'certificates'} complete
            </p>
          </div>
        </div>

        {/* Count pill */}
        <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full
                         bg-amber-500/10 border border-amber-500/20">
          <span className="text-amber-400 text-xs font-bold tabular-nums">
            {certifications.length}
          </span>
          <span className="text-[11px] text-slate-500">
            {certifications.length === 1 ? 'cert' : 'certs'}
          </span>
        </div>
      </div>

      {/* ── Cert cards ── */}
      <div className="space-y-4">
        {certifications.map((record, index) => (
          <CertCard
            key={index}
            record={record}
            index={index}
            total={certifications.length}
            onChange={handleChange}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* ── Add Certification button ── */}
      <button
        id="cert-add-btn"
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-2
                   py-3 rounded-xl border border-dashed border-white/15
                   text-sm font-medium text-slate-400
                   hover:border-amber-500/50 hover:text-amber-400 hover:bg-amber-500/5
                   active:scale-[0.98]
                   transition-all duration-200"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8"  x2="12" y2="16"/>
          <line x1="8"  y1="12" x2="16" y2="12"/>
        </svg>
        + Add Certification
      </button>

      {/* ── Quick-add suggestions ── */}
      {unusedSuggestions.length > 0 && (
        <div className="space-y-3">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Popular Certifications — Quick Add
          </p>
          <div className="flex flex-wrap gap-2">
            {unusedSuggestions.map((s) => (
              <button
                key={s.name}
                id={`cert-suggestion-${s.name.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() =>
                  onChange([
                    ...certifications,
                    { certName: s.name, organization: s.org, year: '' },
                  ])
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                             border border-white/10 bg-white/5
                             text-xs text-slate-400 font-medium
                             hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-300
                             active:scale-95 transition-all duration-150"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5"  y1="12" x2="19" y2="12"/>
                </svg>
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Tip ── */}
      <div className="flex items-start gap-3 rounded-xl bg-amber-500/5 border border-amber-500/15 p-4">
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
          Only list certifications relevant to the role you're applying for.
          Include the full official name so ATS systems can match it exactly.
        </p>
      </div>
    </div>
  )
}
