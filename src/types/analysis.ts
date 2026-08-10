/**
 * Types shared between frontend analyzer components.
 * Mirrors the Zod schema on the server side.
 */

export interface KeywordCoverage {
  keyword: string
  found: boolean
}

export interface AnalysisResult {
  matchScore: number
  summary: string
  strengths: string[]
  missingSkills: string[]
  keywordCoverage: KeywordCoverage[]
  atsIssues: string[]
  recommendedImprovements: string[]
  improvedProfessionalSummary: string
  improvedBulletPoints: string[]
}

export interface ResumeData {
  personalData?: Record<string, string>
  educationList?: Array<Record<string, string>>
  experienceList?: Array<Record<string, string>>
  skills?: string[]
  certifications?: Array<Record<string, string>>
}

export interface AnalysisError {
  error: string
  code: string
  details?: string[]
}
