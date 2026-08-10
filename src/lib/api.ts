import type { AnalysisResult, ResumeData, AnalysisError as AnalysisErrorType } from '../types/analysis'

/**
 * Custom error class for analysis API failures.
 * Carries a typed error code for the UI to handle appropriately.
 */
export class AnalysisApiError extends Error {
  code: string
  details?: string[]

  constructor(message: string, code: string, details?: string[]) {
    super(message)
    this.name = 'AnalysisApiError'
    this.code = code
    this.details = details
  }
}

/**
 * Call the server-side /api/analyze endpoint.
 *
 * @param resumeData     - The user's resume data from localStorage
 * @param jobDescription - The pasted job description text
 * @returns Parsed and validated AnalysisResult
 * @throws AnalysisApiError on any failure
 */
export async function analyzeResume(
  resumeData: ResumeData,
  jobDescription: string
): Promise<AnalysisResult> {
  let response: Response

  try {
    response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeData, jobDescription }),
    })
  } catch (error: unknown) {
    throw new AnalysisApiError(
      'Network error. Please check your connection and try again.',
      'NETWORK_ERROR'
    )
  }

  const data = await response.json()

  if (!response.ok) {
    const errData = data as AnalysisErrorType
    throw new AnalysisApiError(
      errData.error || 'An unexpected error occurred.',
      errData.code || 'UNKNOWN_ERROR',
      errData.details
    )
  }

  return data as AnalysisResult
}
