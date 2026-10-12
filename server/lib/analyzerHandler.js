import { callGemini } from './gemini.js'
import { SYSTEM_PROMPT, buildUserPrompt, serializeResumeData } from './prompts.js'
import { AnalysisResponseSchema } from './schema.js'
import { generateFallbackAnalysis } from './fallback.js'

/**
 * Core handler logic for processing resume analysis requests.
 */
export async function processAnalysisRequest(resumeData, jobDescription) {
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
        error: 'Resume is empty. Please fill in your skills, experience, or education before analyzing.',
        code: 'EMPTY_RESUME',
      },
    }
  }

  // Format prompts
  const resumeText = serializeResumeData(resumeData)
  const userPrompt = buildUserPrompt(resumeText, jobDescription.trim())

  // Try Gemini AI first
  try {
    console.log('[analyze] Calling Gemini API...')
    const rawResponse = await callGemini(SYSTEM_PROMPT, userPrompt)
    console.log('[analyze] Gemini response received, validating...')

    let parsed
    try {
      parsed = JSON.parse(rawResponse)
    } catch {
      console.error('[analyze] Failed to parse Gemini response as JSON')
      throw new Error('Gemini returned malformed JSON.')
    }

    const validated = AnalysisResponseSchema.parse(parsed)
    return {
      status: 200,
      body: validated,
    }
  } catch (apiError) {
    console.error('[analyze] Gemini API error, serving fallback analysis:', apiError)

    const fallbackResult = generateFallbackAnalysis(resumeData, jobDescription.trim())

    return {
      status: 200,
      body: {
        ...fallbackResult,
        _fallback: true,
        _warning: 'Served via offline analysis engine (Gemini API unavailable or quota reached).',
      },
    }
  }
}
