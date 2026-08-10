import { Router, Request, Response } from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { callGemini } from '../lib/gemini.js'
import { SYSTEM_PROMPT, buildUserPrompt, serializeResumeData } from '../lib/prompts.js'
import { AnalysisResponseSchema } from '../lib/schema.js'
import { generateFallbackAnalysis } from '../lib/fallback.js'

const router = Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Shape of the expected request body */
interface AnalyzeRequestBody {
  resumeData: {
    personalData?: Record<string, string>
    educationList?: Array<Record<string, string>>
    experienceList?: Array<Record<string, string>>
    skills?: string[]
    certifications?: Array<Record<string, string>>
  }
  jobDescription: string
}

/**
 * POST /api/analyze
 *
 * Accepts resume data + job description, calls Gemini,
 * validates the response, and returns structured analysis.
 * Falls back to intelligent local analysis on any Gemini error.
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  let resumeData: AnalyzeRequestBody['resumeData'] | undefined
  let jobDescription: string | undefined

  try {
    // Reload .env.local dynamically in case the user updated their key
    dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env.local'), override: true })

    const body = req.body as AnalyzeRequestBody
    resumeData = body.resumeData
    jobDescription = body.jobDescription

    // ── Input validation ──
    if (!resumeData || typeof resumeData !== 'object') {
      res.status(400).json({
        error: 'Missing resume data. Please select or create a resume first.',
        code: 'MISSING_RESUME',
      })
      return
    }

    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length === 0) {
      res.status(400).json({
        error: 'Missing job description. Please paste the job description to analyze.',
        code: 'MISSING_JOB_DESCRIPTION',
      })
      return
    }

    // Check that resume has at least some content
    const hasContent =
      (resumeData.skills && resumeData.skills.length > 0) ||
      (resumeData.personalData && Object.values(resumeData.personalData).some(v => v && v.trim())) ||
      (resumeData.experienceList && resumeData.experienceList.length > 0) ||
      (resumeData.educationList && resumeData.educationList.length > 0)

    if (!hasContent) {
      res.status(400).json({
        error: 'Resume appears to be empty. Please add some details to your resume before analyzing.',
        code: 'EMPTY_RESUME',
      })
      return
    }

    // ── Serialize resume to plain text ──
    const resumeText = serializeResumeData(resumeData)
    const userPrompt = buildUserPrompt(resumeText, jobDescription.trim())

    // ── Call Gemini ──
    console.log('[analyze] Calling Gemini API...')
    const rawResponse = await callGemini(SYSTEM_PROMPT, userPrompt)
    console.log('[analyze] Gemini response received, validating...')

    // ── Parse JSON ──
    let parsed: unknown
    try {
      parsed = JSON.parse(rawResponse)
    } catch {
      console.error('[analyze] Failed to parse Gemini response as JSON:', rawResponse.substring(0, 200))
      // Fall back to local analysis on parse failure
      console.log('[analyze] Falling back to local analysis engine...')
      const fallbackResult = generateFallbackAnalysis(resumeData, jobDescription)
      res.json(fallbackResult)
      return
    }

    // ── Validate with Zod ──
    const validated = AnalysisResponseSchema.safeParse(parsed)

    if (!validated.success) {
      console.error('[analyze] Zod validation failed:', validated.error.issues)
      // Fall back to local analysis on validation failure
      console.log('[analyze] Falling back to local analysis engine...')
      const fallbackResult = generateFallbackAnalysis(resumeData, jobDescription)
      res.json(fallbackResult)
      return
    }

    // ── Success ──
    console.log('[analyze] Analysis complete, matchScore:', validated.data.matchScore)
    res.json(validated.data)
  } catch (error: unknown) {
    // Any Gemini API failure (quota, auth, timeout, network) → serve fallback
    console.error('[analyze] Gemini API error, serving fallback analysis:', error)
    const fallbackResult = generateFallbackAnalysis(resumeData || {}, jobDescription || '')
    res.json(fallbackResult)
    return
  }
})

export default router
