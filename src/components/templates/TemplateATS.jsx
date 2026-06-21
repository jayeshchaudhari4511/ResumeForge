/* ─────────────────────────────────────────────────────────────
   TemplateATS.jsx
   Template 1 — ATS Friendly · Black & White · Minimal Design
   Uses only plain text, single-column layout, no colors.
   Safe for all Applicant Tracking System parsers.
───────────────────────────────────────────────────────────── */

/* ── Contact chip ── */
function Chip({ label, value }) {
  if (!value?.trim()) return null
  return (
    <span className="text-[10px] text-gray-700">
      <span className="font-semibold">{label}:</span> {value}
    </span>
  )
}

/* ── Section heading with full-width rule ── */
function ATSSection({ title, children }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1.5">
        <h2 className="text-[10.5px] font-extrabold uppercase tracking-[0.2em] text-gray-900 whitespace-nowrap">
          {title}
        </h2>
        <div className="flex-1 h-[1.5px] bg-gray-900"/>
      </div>
      {children}
    </div>
  )
}

/* ── Divider between multiple items ── */
function ItemDivider({ show }) {
  return show ? <div className="border-t border-dashed border-gray-200 my-2.5"/> : null
}

export default function TemplateATS({ data }) {
  const education     = (data.educationList    || []).filter(e => e.collegeName?.trim() || e.degree?.trim())
  const experience    = (data.experienceList   || []).filter(e => e.companyName?.trim() || e.role?.trim())
  const certifications= (data.certifications   || []).filter(c => c.certName?.trim())
  const projects      = (data.projects         || []).filter(p => p.title?.trim())
  const skills        = (data.skills           || []).filter(Boolean)

  return (
    <div
      id="resume-paper"
      className="bg-white text-gray-900 p-8"
      style={{ fontFamily: "'Arial', 'Helvetica', sans-serif" }}
    >
      {/* ── HEADER ── */}
      <div className="text-center mb-4 pb-3 border-b-2 border-gray-900">
        <h1 className="text-[20px] font-extrabold uppercase tracking-widest text-gray-900 leading-none">
          {data.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-0.5 mt-2">
          <Chip label="Email"    value={data.email}    />
          <Chip label="Phone"    value={data.phone}    />
          <Chip label="Location" value={data.address}  />
          <Chip label="LinkedIn" value={data.linkedin} />
          <Chip label="GitHub"   value={data.github}   />
        </div>
      </div>

      {/* ── EXPERIENCE ── */}
      {experience.length > 0 && (
        <ATSSection title="Work Experience">
          {experience.map((exp, i) => (
            <div key={i}>
              <ItemDivider show={i > 0} />
              <div className="flex justify-between items-baseline gap-2">
                <p className="text-[11.5px] font-bold text-gray-900">{exp.role || 'Job Title'}</p>
                {exp.duration && (
                  <span className="shrink-0 text-[10px] text-gray-500 italic">{exp.duration}</span>
                )}
              </div>
              <p className="text-[10.5px] text-gray-600 font-semibold">{exp.companyName}</p>
              {exp.description && (
                <p className="text-[10px] text-gray-700 leading-relaxed mt-1 whitespace-pre-line pl-2 border-l border-gray-300">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </ATSSection>
      )}

      {/* ── EDUCATION ── */}
      {education.length > 0 && (
        <ATSSection title="Education">
          {education.map((edu, i) => (
            <div key={i}>
              <ItemDivider show={i > 0} />
              <div className="flex justify-between items-baseline gap-2">
                <p className="text-[11.5px] font-bold text-gray-900">{edu.degree || 'Degree'}</p>
                <div className="shrink-0 text-right">
                  {edu.year && <span className="text-[10px] text-gray-500 italic block">{edu.year}</span>}
                  {edu.cgpa && <span className="text-[10px] font-bold text-gray-700 block">CGPA: {edu.cgpa}</span>}
                </div>
              </div>
              <p className="text-[10.5px] text-gray-600 italic">{edu.collegeName}</p>
            </div>
          ))}
        </ATSSection>
      )}

      {/* ── PROJECTS ── */}
      {projects.length > 0 && (
        <ATSSection title="Projects">
          {projects.map((proj, i) => (
            <div key={i}>
              <ItemDivider show={i > 0} />
              <div className="flex justify-between items-baseline gap-2">
                <p className="text-[11.5px] font-bold text-gray-900">{proj.title}</p>
                {proj.link && <span className="shrink-0 text-[10px] text-gray-500 italic truncate max-w-[120px]">{proj.link}</span>}
              </div>
              {proj.techStack && <p className="text-[10px] text-gray-500 italic">{proj.techStack}</p>}
              {proj.description && (
                <p className="text-[10px] text-gray-700 leading-relaxed mt-1 whitespace-pre-line pl-2 border-l border-gray-300">
                  {proj.description}
                </p>
              )}
            </div>
          ))}
        </ATSSection>
      )}

      {/* ── SKILLS ── */}
      {skills.length > 0 && (
        <ATSSection title="Skills">
          <p className="text-[10.5px] text-gray-800 leading-relaxed">
            {skills.join(' · ')}
          </p>
        </ATSSection>
      )}

      {/* ── CERTIFICATIONS ── */}
      {certifications.length > 0 && (
        <ATSSection title="Certifications">
          {certifications.map((cert, i) => (
            <div key={i} className="flex justify-between items-baseline gap-2">
              <div>
                <span className="text-[11px] font-bold text-gray-900">{cert.certName}</span>
                {cert.organization && (
                  <span className="text-[10px] text-gray-500 italic ml-2">— {cert.organization}</span>
                )}
              </div>
              {cert.year && <span className="shrink-0 text-[10px] text-gray-500">{cert.year}</span>}
            </div>
          ))}
        </ATSSection>
      )}

      <p className="text-center text-[7.5px] text-gray-300 mt-4 select-none">
        Generated with ResumeForge
      </p>
    </div>
  )
}
