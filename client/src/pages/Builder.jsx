import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useLocalStorage, clearResumeStorage } from '../hooks/useLocalStorage'
import ResumeForm, { INITIAL_FORM_DATA }               from '../components/ResumeForm'
import EducationSection, { EMPTY_EDUCATION }           from '../components/EducationSection'
import ExperienceSection, { EMPTY_EXPERIENCE }         from '../components/ExperienceSection'
import CertificationsSection, { EMPTY_CERTIFICATION }  from '../components/CertificationsSection'
import ProjectsSection, { EMPTY_PROJECT }              from '../components/ProjectsSection'
import SkillsSection                                   from '../components/SkillsSection'
import ResumePreview                                   from '../components/ResumePreview'
import JobMatchAnalyzer                                from '../components/JobMatchAnalyzer'
import { useAuth }                                     from '../context/AuthContext'
import { resumeApi }                                   from '../services/api'

/* Tab definitions */
const TABS = [
  {
    id: 'personal',
    label: 'Personal',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    id: 'education',
    label: 'Education',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    id: 'experience',
    label: 'Experience',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    id: 'certifications',
    label: 'Certs',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
  },
  {
    id: 'analyze',
    label: 'Analyze',
    isNew: true,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <line x1="11" y1="8" x2="11" y2="14"/>
        <line x1="8" y1="11" x2="14" y2="11"/>
      </svg>
    ),
  },
]

export default function Builder() {
  const { isAuthenticated, token, loading: authLoading } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const currentResumeId = searchParams.get('id')

  // ── All state persisted to localStorage automatically as draft cache ──
  const [activeTab,        setActiveTab]        = useLocalStorage('activeTab',       'personal')
  const [title,            setTitle]            = useLocalStorage('resumeTitle',     'My Professional Resume')
  const [personalData,     setPersonalData]     = useLocalStorage('personalData',    { ...INITIAL_FORM_DATA })
  const [educationList,    setEducationList]    = useLocalStorage('educationList',   [{ ...EMPTY_EDUCATION }])
  const [experienceList,   setExperienceList]   = useLocalStorage('experienceList',  [{ ...EMPTY_EXPERIENCE }])
  const [projects,         setProjects]         = useLocalStorage('projects',        [{ ...EMPTY_PROJECT }])
  const [certifications,   setCertifications]   = useLocalStorage('certifications',  [{ ...EMPTY_CERTIFICATION }])
  const [skills,           setSkills]           = useLocalStorage('skills',          ['Java', 'React', 'MongoDB', 'Python', 'Tailwind'])

  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [saveError, setSaveError] = useState('')
  const [loadingCloud, setLoadingCloud] = useState(false)

  // ── Load existing resume from MongoDB if URL has ?id=<resumeId> ──
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      clearResumeStorage()
      setTitle('Untitled Resume')
      setPersonalData({ ...INITIAL_FORM_DATA })
      setEducationList([{ ...EMPTY_EDUCATION }])
      setExperienceList([{ ...EMPTY_EXPERIENCE }])
      setProjects([{ ...EMPTY_PROJECT }])
      setCertifications([{ ...EMPTY_CERTIFICATION }])
      setSkills(['React', 'Node.js', 'MongoDB', 'Express'])
      setActiveTab('personal')
      setSearchParams({})
      return
    }

    if (currentResumeId && isAuthenticated) {
      let isSubscribed = true
      setLoadingCloud(true)

      resumeApi.getById(currentResumeId)
        .then((res) => {
          if (!isSubscribed) return
          const r = res.resume
          if (r) {
            if (r.title) setTitle(r.title)
            if (r.personal) setPersonalData({ ...INITIAL_FORM_DATA, ...r.personal })
            if (Array.isArray(r.education) && r.education.length > 0) setEducationList(r.education)
            if (Array.isArray(r.experience) && r.experience.length > 0) setExperienceList(r.experience)
            if (Array.isArray(r.projects) && r.projects.length > 0) setProjects(r.projects)
            if (Array.isArray(r.certifications) && r.certifications.length > 0) setCertifications(r.certifications)
            if (Array.isArray(r.skills) && r.skills.length > 0) setSkills(r.skills)
          }
        })
        .catch((err) => {
          console.error('Failed to load resume from cloud:', err)
          setSaveError('Could not load resume from cloud: ' + err.message)
        })
        .finally(() => {
          if (isSubscribed) setLoadingCloud(false)
        })

      return () => {
        isSubscribed = false
      }
    }
  }, [currentResumeId, isAuthenticated])

  // ── Save Resume to MongoDB / Local Storage ──
  const handleSave = async () => {
    setSaveMessage('')
    setSaveError('')

    // Use token directly — isAuthenticated also requires user to be loaded,
    // which causes a race on page refresh where token exists but user hasn't hydrated yet.
    if (!token) {
      setSaveMessage('Saved locally in draft! Log in to sync to MongoDB cloud.')
      setTimeout(() => setSaveMessage(''), 4000)
      return
    }

    try {
      setSaving(true)
      const payload = {
        title: title.trim() || 'My Professional Resume',
        personal: personalData,
        education: educationList,
        experience: experienceList,
        projects: projects.filter((p) => p.title?.trim() || p.description?.trim()),
        certifications: certifications.filter((c) => c.certName?.trim()),
        skills,
      }

      if (currentResumeId) {
        await resumeApi.update(currentResumeId, payload)
        setSaveMessage('Resume updated in MongoDB cloud ✓')
      } else {
        const res = await resumeApi.create(payload)
        const newId = res.resume?._id
        if (newId) {
          setSearchParams({ id: newId })
        }
        setSaveMessage('Resume saved to MongoDB cloud ✓')
      }
      setTimeout(() => setSaveMessage(''), 4000)
    } catch (err) {
      setSaveError(err.message || 'Failed to save resume')
      setTimeout(() => setSaveError(''), 5000)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (window.confirm('Reset all fields? This will clear local draft data.')) {
      clearResumeStorage()
      setTitle('My Professional Resume')
      setPersonalData({ ...INITIAL_FORM_DATA })
      setEducationList([{ ...EMPTY_EDUCATION }])
      setExperienceList([{ ...EMPTY_EXPERIENCE }])
      setProjects([{ ...EMPTY_PROJECT }])
      setCertifications([{ ...EMPTY_CERTIFICATION }])
      setSkills([])
      setActiveTab('personal')
    }
  }

  /* Personal fields filled count */
  const personalFilled = Object.values(personalData).filter((v) => v?.trim?.()).length
  const personalTotal  = Object.keys(INITIAL_FORM_DATA).length

  /* Education records completed count */
  const eduCompleted = educationList.filter(
    (r) => r.collegeName?.trim() && r.degree?.trim()
  ).length

  /* Experience records completed count */
  const expCompleted = experienceList.filter(
    (r) => r.companyName?.trim() && r.role?.trim()
  ).length

  /* Projects completed count */
  const projCompleted = projects.filter((p) => p.title?.trim()).length

  /* Certifications completed count */
  const certsCompleted = certifications.filter(
    (r) => r.certName?.trim() && r.organization?.trim()
  ).length

  /* Combined preview data */
  const previewData = {
    ...personalData,
    educationList,
    experienceList,
    projects,
    certifications,
    skills,
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background orbs */}
      <div className="orb w-72 h-72 bg-blue-600 top-10 -left-20 opacity-10"/>
      <div className="orb w-72 h-72 bg-purple-600 bottom-20 right-0 opacity-10"/>

      <div className="max-w-7xl mx-auto">

        {/* ── Page header ── */}
        <div className="mb-8 animate-slide-up">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1 min-w-[260px]">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Resume Title..."
                  className="text-2xl sm:text-3xl font-bold text-white bg-transparent border-b border-dashed border-white/20 hover:border-primary-400 focus:border-primary-500 focus:outline-none transition-colors max-w-md"
                />
              </div>
              <p className="text-slate-400 mt-1 text-xs sm:text-sm">
                Fill in your details, save to cloud, or export as pixel-perfect PDF.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Cloud Save Button */}
              <button
                id="builder-save-btn"
                onClick={handleSave}
                disabled={saving || loadingCloud || authLoading}
                className="btn-primary text-xs sm:text-sm px-4 py-2 flex items-center gap-1.5 shadow-glow"
              >
                {saving ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                  </svg>
                )}
                <span>{saving ? 'Saving...' : 'Save Resume'}</span>
              </button>

              {/* Reset Button */}
              <button
                id="builder-reset-btn"
                onClick={handleReset}
                className="btn-outline text-xs sm:text-sm px-3.5 py-2 flex items-center gap-1.5"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10"/>
                  <path d="M3.51 15a9 9 0 1 0 .49-3.45"/>
                </svg>
                Reset
              </button>

              {/* Download PDF Button */}
              <button
                id="builder-download-btn"
                onClick={() => window.print()}
                className="btn-outline text-xs sm:text-sm px-3.5 py-2 flex items-center gap-1.5"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                PDF
              </button>

              {/* Dashboard Link if logged in */}
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/10 flex items-center gap-1"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                  </svg>
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Feedback messages */}
          {saveMessage && (
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>{saveMessage}</span>
            </div>
          )}

          {saveError && (
            <div className="mt-3 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-fade-in">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{saveError}</span>
            </div>
          )}

          {/* Overall progress bar */}
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-btn-gradient rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round(
                    ((personalFilled / personalTotal) * 0.4 +
                     (eduCompleted > 0 ? 0.3 : 0) +
                     (skills.length > 0 ? 0.3 : 0)) * 100
                  )}%`,
                }}
              />
            </div>
            <span className="text-xs text-slate-500 tabular-nums whitespace-nowrap">
              {personalFilled}/{personalTotal} · {eduCompleted} edu · {expCompleted} exp · {projCompleted} proj · {certsCompleted} certs · {skills.length} skills
            </span>
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Left — tabbed form panel */}
          <div className="animate-slide-up space-y-4" style={{ animationDelay: '0.1s' }}>

            {/* Tab switcher — scrollable on mobile */}
            <div className="flex gap-1.5 p-1 glass-card rounded-2xl overflow-x-auto scrollbar-none">
              {TABS.map(({ id, label, icon, isNew }) => {
                const badge =
                  id === 'personal'       ? personalFilled :
                  id === 'education'      ? eduCompleted   :
                  id === 'experience'     ? expCompleted   :
                  id === 'projects'       ? projCompleted  :
                  id === 'certifications' ? certsCompleted :
                  id === 'skills'         ? skills.length  : 0

                return (
                  <button
                    key={id}
                    id={`builder-tab-${id}`}
                    onClick={() => setActiveTab(id)}
                    className={`relative shrink-0 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl
                                 text-xs sm:text-sm font-medium transition-all duration-200
                                 ${activeTab === id
                                   ? id === 'analyze'
                                     ? 'bg-violet-500/25 text-violet-300 border border-violet-500/40'
                                     : 'bg-primary-500/25 text-primary-300 border border-primary-500/40 shadow-glow'
                                   : 'text-slate-500 hover:text-white hover:bg-white/5'
                                 }`}
                  >
                    {/* Pulsing dot for NEW tabs */}
                    {isNew && activeTab !== id && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-violet-400 animate-pulse-slow"/>
                    )}
                    {icon}
                    <span className="whitespace-nowrap">{label}</span>
                    {badge > 0 && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full
                                        ${activeTab === id
                                          ? 'bg-primary-500/30 text-primary-300'
                                          : 'bg-white/10 text-slate-400'
                                        }`}>
                        {badge}
                      </span>
                    )}
                    {isNew && (
                      <span className={`text-[9px] font-bold px-1 py-0.5 rounded uppercase tracking-wider
                                        ${activeTab === id
                                          ? 'bg-violet-500/30 text-violet-200'
                                          : 'bg-violet-500/20 text-violet-400'
                                        }`}>
                        ai
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Active panel */}
            <div className="animate-fade-in" key={activeTab}>
              {activeTab === 'personal' && (
                <ResumeForm
                  data={personalData}
                  onChange={setPersonalData}
                />
              )}
              {activeTab === 'education' && (
                <EducationSection
                  educationList={educationList}
                  onChange={setEducationList}
                />
              )}
              {activeTab === 'experience' && (
                <ExperienceSection
                  experienceList={experienceList}
                  onChange={setExperienceList}
                />
              )}
              {activeTab === 'projects' && (
                <ProjectsSection
                  projects={projects}
                  onChange={setProjects}
                />
              )}
              {activeTab === 'certifications' && (
                <CertificationsSection
                  certifications={certifications}
                  onChange={setCertifications}
                />
              )}
              {activeTab === 'skills' && (
                <SkillsSection
                  skills={skills}
                  onChange={setSkills}
                />
              )}
              {activeTab === 'analyze' && (
                <JobMatchAnalyzer skills={skills} />
              )}
            </div>
          </div>

          {/* Right — live preview */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <ResumePreview data={previewData} />
          </div>
        </div>

        {/* Tips banner */}
        <div className="mt-6 glass-card p-4 flex items-start gap-3 animate-fade-in">
          <div className="shrink-0 w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center mt-0.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8"  x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="text-amber-400 font-semibold">Pro tip: </span>
            Click <span className="text-slate-300">Save Resume</span> anytime to persist your edits to your MongoDB account.
            The live preview on the right updates instantly as you type.
          </p>
        </div>
      </div>
    </div>
  )
}
