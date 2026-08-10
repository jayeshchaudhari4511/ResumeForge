import { useState, useEffect } from 'react'
import { useJobAnalysis } from '../hooks/useJobAnalysis'
import type { ResumeData } from '../types/analysis'
import ScoreRing from '../components/analyzer/ScoreRing'
import StrengthsList from '../components/analyzer/StrengthsList'
import MissingSkills from '../components/analyzer/MissingSkills'
import KeywordTable from '../components/analyzer/KeywordTable'
import AtsIssues from '../components/analyzer/AtsIssues'
import Improvements from '../components/analyzer/Improvements'
import ImprovedSummary from '../components/analyzer/ImprovedSummary'
import ImprovedBullets from '../components/analyzer/ImprovedBullets'
import AnalysisError from '../components/analyzer/AnalysisError'
import AnalysisSkeleton from '../components/analyzer/AnalysisSkeleton'

const STORAGE_PREFIX = 'resumeforge_'

/** Read resume data from localStorage (same keys used by the Builder). */
function loadResumeFromStorage(): ResumeData {
  const read = (key: string) => {
    try {
      const raw = window.localStorage.getItem(STORAGE_PREFIX + key)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  return {
    personalData: read('personalData') || {},
    educationList: read('educationList') || [],
    experienceList: read('experienceList') || [],
    skills: read('skills') || [],
    certifications: read('certifications') || [],
  }
}

/** Check if resume has meaningful content */
function hasResumeContent(data: ResumeData): boolean {
  const hasPersonal = data.personalData
    ? Object.values(data.personalData).some(v => typeof v === 'string' && v.trim())
    : false
  const hasSkills = (data.skills?.length ?? 0) > 0
  const hasEdu = (data.educationList?.length ?? 0) > 0
    && data.educationList!.some(e => e.collegeName?.trim() || e.degree?.trim())
  const hasExp = (data.experienceList?.length ?? 0) > 0
    && data.experienceList!.some(e => e.companyName?.trim() || e.role?.trim())
  return hasPersonal || hasSkills || hasEdu || hasExp
}

export default function Analyzer() {
  const [jobDesc, setJobDesc] = useState('')
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const { result, isLoading, error, errorCode, analyze, retry, reset } = useJobAnalysis()

  // Load resume from localStorage on mount
  useEffect(() => {
    const data = loadResumeFromStorage()
    setResumeData(data)
  }, [])

  const hasResume = resumeData && hasResumeContent(resumeData)
  const hasJobDesc = jobDesc.trim().length > 0
  const canAnalyze = hasResume && hasJobDesc && !isLoading

  const handleAnalyze = () => {
    if (!resumeData || !hasJobDesc) return
    analyze(resumeData, jobDesc.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && canAnalyze) {
      handleAnalyze()
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background orbs */}
      <div className="orb w-72 h-72 bg-violet-600 top-10 -left-20 opacity-10"/>
      <div className="orb w-72 h-72 bg-blue-600 bottom-20 right-0 opacity-10"/>

      <div className="max-w-5xl mx-auto">

        {/* ── Page header ── */}
        <div className="mb-8 animate-slide-up">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/25
                            flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                AI Job Match Analyzer
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold
                                 bg-violet-500/20 text-violet-300 border border-violet-500/30
                                 uppercase tracking-wider">
                  AI Powered
                </span>
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                Compare your resume against any job description with AI-powered analysis.
              </p>
            </div>
          </div>
        </div>

        {/* ── Input Section ── */}
        <div className="grid lg:grid-cols-2 gap-5 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>

          {/* Resume Card */}
          <div className="glass-card p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary-500/15 border border-primary-500/25
                              flex items-center justify-center">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Your Resume</h2>
            </div>

            {hasResume ? (
              <div className="space-y-3">
                {/* Resume summary */}
                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none"
                        stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </span>
                    <span className="text-xs font-semibold text-emerald-400">Resume Loaded</span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-400">
                    {resumeData?.personalData?.fullName && (
                      <p><span className="text-slate-400 font-medium">Name:</span> {resumeData.personalData.fullName}</p>
                    )}
                    {(resumeData?.skills?.length ?? 0) > 0 && (
                      <p><span className="text-slate-400 font-medium">Skills:</span> {resumeData!.skills!.slice(0, 5).join(', ')}{(resumeData!.skills!.length > 5) ? ` +${resumeData!.skills!.length - 5} more` : ''}</p>
                    )}
                    {(resumeData?.experienceList?.length ?? 0) > 0 && (
                      <p><span className="text-slate-400 font-medium">Experience:</span> {resumeData!.experienceList!.filter(e => e.role?.trim()).length} role(s)</p>
                    )}
                    {(resumeData?.educationList?.length ?? 0) > 0 && (
                      <p><span className="text-slate-400 font-medium">Education:</span> {resumeData!.educationList!.filter(e => e.degree?.trim()).length} entry(s)</p>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  ℹ️ Resume data loaded from the Builder. Go to{' '}
                  <a href="/builder" className="text-primary-400 hover:text-primary-300 underline">Builder</a>
                  {' '}to update it.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20
                                flex items-center justify-center">
                  <span className="text-xl">📄</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-300">No Resume Found</p>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Go to the{' '}
                    <a href="/builder" className="text-primary-400 hover:text-primary-300 underline">Builder</a>
                    {' '}and fill in your details first.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Job Description Input */}
          <div className="glass-card p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/25
                              flex items-center justify-center">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Job Description</h2>
            </div>

            <div className="relative">
              <label htmlFor="analyzer-jd-input" className="sr-only">
                Paste the job description
              </label>
              <textarea
                id="analyzer-jd-input"
                value={jobDesc}
                onChange={e => setJobDesc(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste the complete job description here..."
                rows={8}
                aria-label="Job description input"
                className="w-full px-4 py-3 rounded-xl text-sm text-slate-200 leading-relaxed
                           bg-white/5 border border-white/10 placeholder-slate-400
                           focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30
                           transition-all duration-200 resize-none"
              />
              {jobDesc.length > 0 && (
                <span className="absolute bottom-3 right-3 text-[10px] text-slate-400 font-mono">
                  {jobDesc.length} chars
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] text-slate-400">
                {!hasJobDesc
                  ? 'Paste a job description above to analyze.'
                  : `${jobDesc.trim().split(/\s+/).length} words · Press Ctrl+Enter to analyze.`
                }
              </p>
              {jobDesc.length > 0 && (
                <button
                  onClick={() => setJobDesc('')}
                  className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors
                             flex items-center gap-1 whitespace-nowrap cursor-pointer"
                  aria-label="Clear job description"
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

        {/* ── Analyze Button ── */}
        <div className="flex justify-center mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <button
            id="analyze-match-btn"
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            aria-label="Analyze match between resume and job description"
            className={`inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl text-base font-bold
                        transition-all duration-300 cursor-pointer
                        ${canAnalyze
                          ? 'bg-btn-gradient text-white shadow-glow hover:scale-105 hover:shadow-glow-purple'
                          : 'bg-white/5 text-slate-600 border border-white/10 cursor-not-allowed'
                        }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            {isLoading ? 'Analyzing...' : 'Analyze Match'}
          </button>
        </div>

        {/* ── States ── */}

        {/* Loading */}
        {isLoading && <AnalysisSkeleton />}

        {/* Error */}
        {error && !isLoading && (
          <div className="animate-fade-in">
            <AnalysisError error={error} errorCode={errorCode} onRetry={retry} />
          </div>
        )}

        {/* Results Dashboard */}
        {result && !isLoading && !error && (
          <div className="space-y-5 animate-fade-in">

            {/* ── Score + Summary Card ── */}
            <div className="glass-card p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="shrink-0">
                  <ScoreRing score={result.matchScore} />
                </div>
                <div className="flex-1 space-y-4 text-center sm:text-left">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                    Analysis Summary
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{result.summary}</p>

                  {/* Quick stats */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold border
                                     bg-emerald-500/15 border-emerald-500/30 text-emerald-300">
                      {result.strengths.length} Strengths
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold border
                                     bg-rose-500/15 border-rose-500/30 text-rose-300">
                      {result.missingSkills.length} Missing
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold border
                                     bg-amber-500/15 border-amber-500/30 text-amber-300">
                      {result.atsIssues.length} ATS Issues
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold border
                                     bg-blue-500/15 border-blue-500/30 text-blue-300">
                      {result.recommendedImprovements.length} Improvements
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Strengths + Missing Skills ── */}
            <div className="grid lg:grid-cols-2 gap-5">
              <StrengthsList strengths={result.strengths} />
              <MissingSkills skills={result.missingSkills} />
            </div>

            {/* ── ATS Keywords ── */}
            <KeywordTable keywords={result.keywordCoverage} />

            {/* ── ATS Issues ── */}
            <AtsIssues issues={result.atsIssues} />

            {/* ── Improvements ── */}
            <Improvements improvements={result.recommendedImprovements} />

            {/* ── AI-Improved Content ── */}
            <ImprovedSummary improvedSummary={result.improvedProfessionalSummary} />
            <ImprovedBullets bullets={result.improvedBulletPoints} />

            {/* ── Footer Actions ── */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-start gap-3 flex-1 min-w-0 rounded-xl bg-violet-500/5 border border-violet-500/15 p-4">
                <div className="shrink-0 w-6 h-6 rounded-full bg-violet-500/15 flex items-center justify-center mt-0.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  <span className="text-violet-400 font-semibold">AI-Powered: </span>
                  This analysis was generated by Google Gemini. Results are suggestions —
                  always review and tailor your resume based on your own judgment.
                </p>
              </div>
              <button
                onClick={() => { reset(); setJobDesc(''); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className="btn-outline text-sm px-4 py-2 shrink-0"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10"/>
                  <path d="M3.51 15a9 9 0 1 0 .49-3.45"/>
                </svg>
                New Analysis
              </button>
            </div>
          </div>
        )}

        {/* ── Empty state (no analysis yet) ── */}
        {!result && !isLoading && !error && (
          <div className="glass-card p-10 flex flex-col items-center justify-center gap-4 text-center
                          animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20
                            flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-300">Ready to Analyze</p>
              <p className="text-xs text-slate-400 max-w-xs">
                {!hasResume
                  ? 'Build your resume first in the Builder, then come back to analyze.'
                  : !hasJobDesc
                    ? 'Paste a job description above, then click Analyze Match.'
                    : 'Click Analyze Match to get your AI-powered analysis.'
                }
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
      </div>
    </div>
  )
}
