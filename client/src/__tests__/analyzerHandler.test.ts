import { describe, it, expect, vi, beforeEach } from 'vitest'
import { processAnalysisRequest } from '../../server/lib/analyzerHandler'
import * as geminiModule from '../../server/lib/gemini'

vi.mock('../../server/lib/gemini', () => ({
  callGemini: vi.fn(),
}))

describe('analyzerHandler - processAnalysisRequest', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns 400 error when resumeData is missing', async () => {
    const res = await processAnalysisRequest(undefined, 'Software Engineer role')
    expect(res.status).toBe(400)
    expect(res.body.code).toBe('MISSING_RESUME')
  })

  it('returns 400 error when jobDescription is empty', async () => {
    const res = await processAnalysisRequest({ skills: ['React'] }, '   ')
    expect(res.status).toBe(400)
    expect(res.body.code).toBe('MISSING_JOB_DESCRIPTION')
  })

  it('returns 400 error when resume has no content', async () => {
    const res = await processAnalysisRequest({ skills: [], personalData: {} }, 'Frontend Developer')
    expect(res.status).toBe(400)
    expect(res.body.code).toBe('EMPTY_RESUME')
  })

  it('successfully returns validated analysis when Gemini responds with valid JSON', async () => {
    const mockAnalysis = {
      matchScore: 88,
      summary: 'Excellent alignment with React requirements.',
      strengths: ['Strong React experience'],
      missingSkills: ['TypeScript'],
      keywordCoverage: [
        { keyword: 'React', found: true },
      ],
      atsIssues: ['Use standard headings'],
      recommendedImprovements: ['Add quantitative metrics'],
      improvedProfessionalSummary: 'Experienced React developer with frontend expertise.',
      improvedBulletPoints: ['Developed React components'],
    }

    vi.spyOn(geminiModule, 'callGemini').mockResolvedValue(JSON.stringify(mockAnalysis))

    const res = await processAnalysisRequest(
      { skills: ['React', 'JavaScript'], personalData: { fullName: 'Jane Doe' } },
      'Looking for a React developer with TypeScript knowledge.'
    )

    expect(res.status).toBe(200)
    expect(res.body.matchScore).toBe(88)
    expect(res.body.summary).toBe('Excellent alignment with React requirements.')
  })

  it('falls back to local analysis engine if Gemini returns invalid JSON', async () => {
    vi.spyOn(geminiModule, 'callGemini').mockResolvedValue('Not JSON content')

    const res = await processAnalysisRequest(
      { skills: ['React', 'CSS'], personalData: { fullName: 'John Smith' } },
      'React and CSS developer needed.'
    )

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('matchScore')
    expect(res.body).toHaveProperty('summary')
    expect(res.body.strengths.length).toBeGreaterThan(0)
  })

  it('falls back to local analysis engine if Gemini API call throws an error', async () => {
    vi.spyOn(geminiModule, 'callGemini').mockRejectedValue(new Error('Quota exceeded'))

    const res = await processAnalysisRequest(
      { skills: ['Node.js'], experienceList: [{ title: 'Backend Dev' }] },
      'Node.js developer needed.'
    )

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('matchScore')
    expect(res.body).toHaveProperty('keywordCoverage')
  })
})
