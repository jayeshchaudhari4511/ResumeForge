/* ─────────────────────────────────────────────────────────────
   TemplateModern.jsx
   Template 2 — Modern · Blue Header · Card Layout
───────────────────────────────────────────────────────────── */

/* ── Contact chip in header ── */
function HeaderChip({ icon, value }) {
  if (!value?.trim()) return null
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] text-blue-100">
      <span className="opacity-80">{icon}</span>
      <span className="truncate max-w-[140px]">{value}</span>
    </span>
  )
}

/* ── Card section wrapper ── */
function ModernSection({ title, accent = '#2563eb', children }) {
  return (
    <div className="mb-4">
      {/* Heading with colored left bar */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1 h-4 rounded-full" style={{ background: accent }}/>
        <h2
          className="text-[10.5px] font-extrabold uppercase tracking-widest"
          style={{ color: accent }}
        >
          {title}
        </h2>
      </div>
      <div className="pl-3 border-l-2 border-blue-100 space-y-3">
        {children}
      </div>
    </div>
  )
}

/* ── Skill badge ── */
function SkillBadge({ label }) {
  return (
    <span className="px-2 py-0.5 rounded text-[9.5px] font-semibold border"
          style={{ background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}>
      {label}
    </span>
  )
}

/* ── Timeline dot for experience/education items ── */
function TimelineItem({ title, subtitle, right, description, techStack }) {
  return (
    <div className="relative">
      {/* Dot */}
      <div className="absolute -left-[17px] top-[4px] w-2.5 h-2.5 rounded-full border-2
                       border-blue-400 bg-white"/>
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[11.5px] font-bold text-gray-900 leading-tight">{title}</p>
          {subtitle && (
            <p className="text-[10px] text-blue-600 font-semibold mt-0.5">{subtitle}</p>
          )}
          {techStack && (
            <p className="text-[9.5px] text-gray-400 italic mt-0.5">{techStack}</p>
          )}
        </div>
        {right && (
          <span className="shrink-0 text-[9.5px] text-gray-400 italic font-medium whitespace-nowrap mt-0.5">
            {right}
          </span>
        )}
      </div>
      {description && (
        <p className="text-[10px] text-gray-600 leading-relaxed mt-1.5 whitespace-pre-line">
          {description}
        </p>
      )}
    </div>
  )
}

/* ── Cert row ── */
function CertRow({ cert }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        {/* Medal pip */}
        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
             style={{ background: '#fef9c3', border: '1px solid #fde68a' }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
            stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="6"/>
            <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
          </svg>
        </div>
        <div>
          <p className="text-[11px] font-bold text-gray-900 leading-tight">{cert.certName}</p>
          {cert.organization && (
            <p className="text-[9.5px] text-gray-500">{cert.organization}</p>
          )}
        </div>
      </div>
      {cert.year && (
        <span className="shrink-0 text-[9.5px] text-gray-400 italic">{cert.year}</span>
      )}
    </div>
  )
}

export default function TemplateModern({ data }) {
  const education      = (data.educationList   || []).filter(e => e.collegeName?.trim() || e.degree?.trim())
  const experience     = (data.experienceList  || []).filter(e => e.companyName?.trim() || e.role?.trim())
  const certifications = (data.certifications  || []).filter(c => c.certName?.trim())
  const projects       = (data.projects        || []).filter(p => p.title?.trim())
  const skills         = (data.skills          || []).filter(Boolean)

  const BLUE     = '#2563eb'
  const BLUE_DK  = '#1e40af'
  const BLUE_HDR = '#1d4ed8'

  return (
    <div
      id="resume-paper"
      className="bg-white text-gray-900 overflow-hidden"
      style={{ fontFamily: "'Helvetica Neue', 'Arial', sans-serif" }}
    >

      {/* ══════════════════════════════════════
          BLUE HEADER CARD
      ══════════════════════════════════════ */}
      <div
        className="px-8 pt-7 pb-6 text-white"
        style={{ background: `linear-gradient(135deg, ${BLUE_DK} 0%, ${BLUE_HDR} 60%, #3b82f6 100%)` }}
      >
        {/* Name */}
        <h1 className="text-[22px] font-extrabold tracking-tight text-white leading-none">
          {data.fullName || 'Your Name'}
        </h1>

        {/* Divider line */}
        <div className="h-[2px] w-12 bg-blue-300/60 rounded mt-2 mb-3"/>

        {/* Contact chips */}
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          <HeaderChip icon="✉"  value={data.email}    />
          <HeaderChip icon="☎"  value={data.phone}    />
          <HeaderChip icon="📍" value={data.address}  />
          <HeaderChip icon="in" value={data.linkedin} />
          <HeaderChip icon={
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839
                       9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703
                       -2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466
                       -.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032
                       .892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338
                       -2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688
                       -.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026
                       A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337
                       1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651
                       .64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943
                       .359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747
                       0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          } value={data.github} />
        </div>
      </div>

      {/* ══════════════════════════════════════
          BODY — padded content
      ══════════════════════════════════════ */}
      <div className="px-8 pt-5 pb-6">

        {/* ── EXPERIENCE ── */}
        {experience.length > 0 && (
          <ModernSection title="Work Experience" accent={BLUE}>
            {experience.map((exp, i) => (
              <TimelineItem
                key={i}
                title={exp.role || 'Job Title'}
                subtitle={exp.companyName}
                right={exp.duration}
                description={exp.description}
              />
            ))}
          </ModernSection>
        )}

        {/* ── EDUCATION ── */}
        {education.length > 0 && (
          <ModernSection title="Education" accent={BLUE}>
            {education.map((edu, i) => (
              <TimelineItem
                key={i}
                title={edu.degree || 'Degree'}
                subtitle={edu.collegeName}
                right={[edu.year, edu.cgpa ? `CGPA ${edu.cgpa}` : ''].filter(Boolean).join(' · ')}
              />
            ))}
          </ModernSection>
        )}

        {/* ── PROJECTS ── */}
        {projects.length > 0 && (
          <ModernSection title="Projects" accent="#7c3aed">
            {projects.map((proj, i) => (
              <TimelineItem
                key={i}
                title={proj.title}
                subtitle={proj.link}
                techStack={proj.techStack}
                description={proj.description}
              />
            ))}
          </ModernSection>
        )}

        {/* ── SKILLS — badge grid ── */}
        {skills.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 rounded-full" style={{ background: '#059669' }}/>
              <h2 className="text-[10.5px] font-extrabold uppercase tracking-widest"
                  style={{ color: '#059669' }}>Skills</h2>
            </div>
            {/* Skills grid card */}
            <div className="rounded-lg p-3 border border-blue-100"
                 style={{ background: '#f8faff' }}>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, i) => <SkillBadge key={i} label={skill} />)}
              </div>
            </div>
          </div>
        )}

        {/* ── CERTIFICATIONS — card row ── */}
        {certifications.length > 0 && (
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 rounded-full bg-amber-500"/>
              <h2 className="text-[10.5px] font-extrabold uppercase tracking-widest text-amber-600">
                Certifications
              </h2>
            </div>
            <div className="rounded-lg border border-amber-100 divide-y divide-amber-50 overflow-hidden"
                 style={{ background: '#fffbeb' }}>
              {certifications.map((cert, i) => (
                <div key={i} className="px-3 py-2">
                  <CertRow cert={cert} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <p className="text-center text-[7.5px] text-gray-300 pb-2 select-none">
        Generated with ResumeForge
      </p>
    </div>
  )
}
