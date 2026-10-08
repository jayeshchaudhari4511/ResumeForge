import { useState } from 'react'

export const EMPTY_PROJECT = {
  title:       '',
  techStack:   '',
  link:        '',
  description: '',
}

const PROJECT_FIELDS = [
  {
    key:         'title',
    label:       'Project Title',
    placeholder: 'E-Commerce Platform, AI Chatbot…',
    type:        'text',
    span:        'sm:col-span-2',
    required:    true,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    key:         'techStack',
    label:       'Technologies Used',
    placeholder: 'React, Node.js, MongoDB, Tailwind',
    type:        'text',
    span:        'sm:col-span-1',
    required:    false,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    key:         'link',
    label:       'Project Link / Demo',
    placeholder: 'https://github.com/username/project',
    type:        'text',
    span:        'sm:col-span-1',
    required:    false,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    ),
  },
]

export default function ProjectsSection({ projects = [], onChange }) {
  const [touched, setTouched] = useState({})

  const handleFieldChange = (index, key, val) => {
    const next = projects.map((item, i) => (i === index ? { ...item, [key]: val } : item))
    onChange(next)
  }

  const handleBlur = (index, key) => {
    setTouched((prev) => ({ ...prev, [`${index}_${key}`]: true }))
  }

  const handleAdd = () => {
    onChange([...projects, { ...EMPTY_PROJECT }])
  }

  const handleRemove = (index) => {
    if (projects.length === 1) {
      onChange([{ ...EMPTY_PROJECT }])
      return
    }
    onChange(projects.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Projects</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-400">
              {projects.filter((p) => p.title?.trim()).length} added
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Showcase your top personal and academic projects.</p>
        </div>
        <button
          id="add-project-btn"
          type="button"
          onClick={handleAdd}
          className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Project
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((proj, idx) => (
          <div
            key={idx}
            className="glass-card p-4 sm:p-5 rounded-2xl border border-white/10 space-y-3 relative group"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-400">
                Project #{idx + 1} {proj.title ? `— ${proj.title}` : ''}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition-colors text-xs flex items-center gap-1"
                title="Remove project"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROJECT_FIELDS.map(({ key, label, placeholder, span, required, icon }) => (
                <div key={key} className={span || ''}>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    {label} {required && <span className="text-rose-400">*</span>}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                      {icon}
                    </span>
                    <input
                      type="text"
                      placeholder={placeholder}
                      value={proj[key] || ''}
                      onChange={(e) => handleFieldChange(idx, key, e.target.value)}
                      onBlur={() => handleBlur(idx, key)}
                      className="input-field pl-9 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              ))}

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Project Description / Highlights
                </label>
                <textarea
                  rows={3}
                  placeholder="Built a real-time collaborative workspace with socket-based syncing and JWT authentication..."
                  value={proj.description || ''}
                  onChange={(e) => handleFieldChange(idx, 'description', e.target.value)}
                  className="input-field text-xs sm:text-sm py-2.5 resize-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
