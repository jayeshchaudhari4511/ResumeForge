import { callGemini } from './gemini.js'
import { SYSTEM_PROMPT, buildUserPrompt, serializeResumeData } from './prompts.js'
import { AnalysisResponseSchema } from './schema.js'
import { generateFallbackAnalysis } from './fallback.js'

export interface AnalyzeRequestBody {
  resumeData?: {
    personalData?: Record<string, string>
    educationList?: Array<Record<string, string>>
    experienceList?: Array<Record<string, string>>
    skills?: string[]
    certifications?: Array<Record<string, string>>
  }
  jobDescription?: string
}

export interface AnalysisHandlerResponse {
  status: number
  body: any
}

/**
 * Core handler logic for processing resume analysis requests.
 * Shared between Express server route and Vercel serverless function.
 */
export async function processAnalysisRequest(
  resumeData?: AnalyzeRequestBody['resumeData'],
  jobDescription?: string
): Promise<AnalysisHandlerResponse> {
  // Input validation
  if (!resumeData || typeof resumeData !== 'object') {
    return {
      status: 400,
      body: {
        error: 'Missing resume data. Please select or create a resume first.',
        code: 'MISSING_RESUME',
      },
    }
  }

  if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length === 0) {
    return {
      status: 400,
      body: {
        error: 'Missing job description. Please paste the job description to analyze.',
        code: 'MISSING_JOB_DESCRIPTION',
      },
    }
  }

  const hasContent =
    (resumeData.skills && resumeData.skills.length > 0) ||
    (resumeData.personalData && Object.values(resumeData.personalData).some(v => v && v.trim())) ||
    (resumeData.experienceList && resumeData.experienceList.length > 0) ||
    (resumeData.educationList && resumeData.educationList.length > 0)

  if (!hasContent) {
    return {
      status: 400,
      body: {
        error: 'Resume appears to be empty. Please add some details to your resume before analyzing.',
        code: 'EMPTY_RESUME',
      },
    }
  }

  try {
    const resumeText = serializeResumeData(resumeData)
    const userPrompt = buildUserPrompt(resumeText, jobDescription.trim())

    console.log('[analyze] Calling Gemini API...')
    const rawResponse = await callGemini(SYSTEM_PROMPT, userPrompt)
    console.log('[analyze] Gemini response received, validating...')

    let parsed: unknown
    try {
      parsed = JSON.parse(rawResponse)
    } catch {
      console.error('[analyze] Failed to parse Gemini response as JSON')
      const fallbackResult = generateFallbackAnalysis(resumeData, jobDescription)
      return { status: 200, body: fallbackResult }
    }

    const validated = AnalysisResponseSchema.safeParse(parsed)
    if (!validated.success) {
      console.error('[analyze] Zod validation failed:', validated.error.issues)
      const fallbackResult = generateFallbackAnalysis(resumeData, jobDescription)
      return { status: 200, body: fallbackResult }
    }

    return { status: 200, body: validated.data }
  } catch (error: unknown) {
    console.error('[analyze] Gemini API error, serving fallback analysis:', error)
    const fallbackResult = generateFallbackAnalysis(resumeData || {}, jobDescription || '')
    return { status: 200, body: fallbackResult }
  }
}
