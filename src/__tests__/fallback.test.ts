import { describe, it, expect } from 'vitest'
import { generateFallbackAnalysis } from '../../server/lib/fallback'

describe('fallback analysis engine', () => {
  it('generates a valid structured AnalysisResponse object', () => {
    const resume = {
      personalData: { fullName: 'Alice Developer' },
      skills: ['React', 'TypeScript', 'Node.js', 'CSS'],
    }
    const jd = 'Looking for a Senior React Engineer with TypeScript and GraphQL experience.'

    const result = generateFallbackAnalysis(resume, jd)

    expect(result.matchScore).toBeGreaterThanOrEqual(55)
    expect(result.matchScore).toBeLessThanOrEqual(92)
    expect(result.summary).toContain('candidate')
    expect(result.strengths.length).toBeGreaterThan(0)
    expect(result.keywordCoverage.length).toBeGreaterThan(0)
    expect(result.atsIssues.length).toBeGreaterThan(0)
    expect(result.recommendedImprovements.length).toBeGreaterThan(0)
    expect(result.improvedProfessionalSummary).toContain('React')
    expect(result.improvedBulletPoints.length).toBeGreaterThan(0)
  })

  it('handles empty resume data gracefully', () => {
    const result = generateFallbackAnalysis({}, 'Need Python developer')

    expect(result).toHaveProperty('matchScore')
    expect(result).toHaveProperty('summary')
    expect(result.summary).toContain('candidate')
  })
})
