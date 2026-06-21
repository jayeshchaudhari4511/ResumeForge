/* ─────────────────────────────────────────────────────────────
   ResumePreview.jsx
   Renders the selected resume template with a live dropdown
   switcher. Template selection is local state — no prop needed.
───────────────────────────────────────────────────────────── */
import { useState }          from 'react'
import TemplateATS            from './templates/TemplateATS'
import TemplateModern         from './templates/TemplateModern'
import { downloadResumePdf }  from '../utils/downloadPdf'

/* ── Template registry ── */
const TEMPLATES = [
  {
    id:    'ats',
    label: 'Template 1 — ATS Friendly',
    desc:  'Black & White · Minimal · ATS Safe',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    component: TemplateATS,
    badge: { label: 'ATS Safe', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  },
  {
    id:    'modern',
    label: 'Template 2 — Modern',
    desc:  'Blue Header · Card Layout · Visual',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3"/>
        <path d="M3 9h18M9 21V9"/>
      </svg>
    ),
    component: TemplateModern,
    badge: { label: 'Modern', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  },
]

/* ─────────────────────────────────────────────
   Empty state
───────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 p-10 min-h-[500px]">
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-primary-500/10 border border-primary-500/20
                         flex items-center justify-center">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none"
            stroke="#60a5fa" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full
                          bg-primary-500/20 border border-primary-500/40
                          flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse-slow"/>
        </span>
      </div>
      <div className="text-center space-y-1.5">
        <p className="text-sm font-semibold text-slate-300">Resume Preview</p>
        <p className="text-xs text-slate-600 max-w-xs leading-relaxed">
          Your live resume will appear here as you fill in the form on the left.
          Start with your name and email.
        </p>
      </div>
      {/* Skeleton shimmer */}
      <div className="w-full max-w-xs space-y-2 opacity-20 animate-pulse-slow">
        <div className="h-2.5 w-2/3 bg-slate-700 rounded mx-auto"/>
        <div className="h-1.5 w-1/2 bg-slate-700 rounded mx-auto"/>
        <div className="h-px   w-full bg-slate-700 rounded mt-3"/>
        {[100, 90, 80, 70, 85].map((w, i) => (
          <div key={i} className="h-1.5 bg-slate-700 rounded" style={{ width: `${w}%` }}/>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Template thumbnail chip (inside dropdown)
───────────────────────────────────────────── */
function TemplateOption({ tpl, selected, onSelect }) {
  const active = selected === tpl.id
  return (
    <button
      id={`template-option-${tpl.id}`}
      onClick={() => onSelect(tpl.id)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                   transition-all duration-200
                   ${active
                     ? 'bg-primary-500/20 border border-primary-500/40'
                     : 'hover:bg-white/5 border border-transparent'
                   }`}
    >
      {/* Icon */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                        transition-colors duration-200
                        ${active ? 'bg-primary-500/30 text-primary-300' : 'bg-white/10 text-slate-400'}`}>
        {tpl.icon}
      </div>
      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold leading-tight truncate
                        ${active ? 'text-white' : 'text-slate-300'}`}>
          {tpl.label}
        </p>
        <p className="text-[10px] text-slate-500 mt-0.5 truncate">{tpl.desc}</p>
      </div>
      {/* Badge */}
      <span className={`shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full border
                         ${tpl.badge.color}`}>
        {tpl.badge.label}
      </span>
      {/* Active check */}
      {active && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          className="shrink-0">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      )}
    </button>
  )
}

/* ─────────────────────────────────────────────
   Main ResumePreview component
   Props:
     data → all resume data from Builder
───────────────────────────────────────────── */
export default function ResumePreview({ data }) {
  const [selectedTemplate, setSelectedTemplate] = useState('ats')
  const [dropdownOpen,     setDropdownOpen]     = useState(false)
  const [downloading,      setDownloading]      = useState(false)

  /* Dynamic filename from the person's name */
  const pdfFilename = data.fullName?.trim()
    ? `${data.fullName.trim().toLowerCase().replace(/\s+/g, '_')}_resume.pdf`
    : 'resume.pdf'

  /* Trigger html2canvas → jsPDF download */
  const handleDownload = () =>
    downloadResumePdf(pdfFilename, () => setDownloading(true), () => setDownloading(false))

  /* Check if there's any content to render */
  const hasContent =
    data.fullName?.trim() || data.email?.trim() || data.phone?.trim() ||
    data.address?.trim()  || data.linkedin?.trim() || data.github?.trim() ||
    data.educationList?.some(e => e.collegeName?.trim() || e.degree?.trim())    ||
    data.experienceList?.some(e => e.companyName?.trim() || e.role?.trim())     ||
    data.certifications?.some(c => c.certName?.trim())                          ||
    data.projects?.some(p => p.title?.trim())                                   ||
    data.skills?.some(Boolean)

  /* Active template config */
  const activeTpl = TEMPLATES.find(t => t.id === selectedTemplate)
  const ActiveTemplate = activeTpl.component

  return (
    <div className="glass-card overflow-hidden animate-fade-in flex flex-col">

      {/* ── Top toolbar ── */}
      <div className="flex items-center gap-3 px-4 py-2.5
                       bg-white/5 border-b border-white/10 shrink-0">

        {/* Mac dots */}
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/70"/>
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70"/>
          <span className="w-2.5 h-2.5 rounded-full bg-green-400/70"/>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5 ml-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow"/>
          <span className="text-[10px] text-slate-500 font-mono">live</span>
        </div>

        {/* ── Template dropdown ── */}
        <div className="relative ml-auto">
          <button
            id="template-dropdown-btn"
            onClick={() => setDropdownOpen(o => !o)}
            className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl
                        glass-card border border-white/10 text-xs font-medium text-slate-300
                        hover:border-primary-500/40 hover:text-white
                        transition-all duration-200"
          >
            <span className="text-primary-400">{activeTpl.icon}</span>
            <span className="hidden sm:inline">{activeTpl.label}</span>
            <span className={`w-4 h-4 flex items-center justify-center text-slate-500
                               transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </span>
          </button>

          {/* Dropdown panel */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 z-50 animate-fade-in
                             glass-card border border-white/15 rounded-2xl p-2 shadow-card">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider
                             px-2 mb-1.5">
                Choose Template
              </p>
              {TEMPLATES.map(tpl => (
                <TemplateOption
                  key={tpl.id}
                  tpl={tpl}
                  selected={selectedTemplate}
                  onSelect={(id) => { setSelectedTemplate(id); setDropdownOpen(false) }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Filename */}
        <span className="text-[10px] text-slate-600 font-mono hidden md:inline">
          {pdfFilename}
        </span>
      </div>

      {/* ── Active template badge strip ── */}
      <div className={`flex items-center gap-2 px-4 py-1.5 border-b border-white/5 shrink-0
                        ${selectedTemplate === 'ats' ? 'bg-emerald-500/5' : 'bg-blue-500/5'}`}>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border
                           ${activeTpl.badge.color}`}>
          {activeTpl.badge.label}
        </span>
        <span className="text-[10px] text-slate-600">{activeTpl.desc}</span>
      </div>

      {/* ── Scrollable resume paper ── */}
      <div className="flex-1 max-h-[720px] overflow-y-auto" key={selectedTemplate}>
        {hasContent
          ? <ActiveTemplate data={data} />
          : <EmptyState />
        }
      </div>

      {/* ── Footer action bar ── */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5
                       bg-white/5 border-t border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-600">
            {selectedTemplate === 'ats'
              ? '✓ ATS parser safe · No colors used'
              : '❖ Visual design · PDF recommended'}
          </span>
        </div>

        {/* Download Resume button */}
        <button
          id="download-resume-btn"
          disabled={downloading || !hasContent}
          onClick={handleDownload}
          className={`relative flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold
                       text-white transition-all duration-200
                       ${downloading || !hasContent
                         ? 'opacity-50 cursor-not-allowed bg-slate-700'
                         : 'bg-btn-gradient hover:scale-105 shadow-glow active:scale-95'
                       }`}
        >
          {downloading ? (
            <>
              {/* Spinner */}
              <svg
                className="animate-spin"
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Generating…
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download Resume
            </>
          )}
        </button>
      </div>
    </div>
  )
}
