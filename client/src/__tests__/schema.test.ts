import { describe, it, expect } from 'vitest'
import { AnalysisResponseSchema } from '../../server/lib/schema'

describe('AnalysisResponseSchema Zod Validation', () => {
  const validResponse = {
    matchScore: 85,
    summary: 'Strong match for Senior Frontend Developer role with solid React and TypeScript skills.',
    strengths: ['5+ years React experience', 'TypeScript expertise', 'State management proficiency'],
    missingSkills: ['GraphQL', 'AWS CloudFront'],
    keywordCoverage: [
      { keyword: 'React', found: true },
      { keyword: 'TypeScript', found: true },
      { keyword: 'GraphQL', found: false },
    ],
    atsIssues: ['Certifications section missing dates'],
    recommendedImprovements: [
      'Add quantitative impact metrics to experience bullet points.',
      'Explicitly list state management libraries in skills.',
    ],
    improvedProfessionalSummary:
      'Senior Frontend Engineer with 5+ years building scalable React & TypeScript web applications.',
    improvedBulletPoints: [
      'Architected high-throughput React dashboard serving 50k daily active users.',
      'Reduced bundle size by 35% through tree-shaking and dynamic imports.',
    ],
  }

  it('validates a correct Gemini JSON response', () => {
    const result = AnalysisResponseSchema.safeParse(validResponse)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.matchScore).toBe(85)
      expect(result.data.strengths).toHaveLength(3)
    }
  })

  it('rejects matchScore below 0', () => {
    const invalid = { ...validResponse, matchScore: -5 }
    const result = AnalysisResponseSchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })

  it('rejects matchScore above 100', () => {
    const invalid = { ...validResponse, matchScore: 105 }
    const result = AnalysisResponseSchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })

  it('rejects response missing required fields', () => {
    const incomplete = { matchScore: 80, summary: 'Good match' }
    const result = AnalysisResponseSchema.safeParse(incomplete)
    expect(result.success).toBe(false)
  })

  it('rejects invalid keywordCoverage item structure', () => {
    const invalidCoverage = {
      ...validResponse,
      keywordCoverage: [{ keyword: 'React' }], // missing 'found' boolean
    }
    const result = AnalysisResponseSchema.safeParse(invalidCoverage)
    expect(result.success).toBe(false)
  })
})
