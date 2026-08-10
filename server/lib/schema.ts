import { z } from 'zod'

/**
 * Zod schema for keyword coverage entries returned by Gemini.
 */
export const KeywordCoverageSchema = z.object({
  keyword: z.string(),
  found: z.boolean(),
})

/**
 * Zod schema for the full Gemini analysis response.
 * Used to validate that the AI returned properly structured JSON.
 */
export const AnalysisResponseSchema = z.object({
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe('Overall match percentage between resume and job description'),
  summary: z
    .string()
    .min(1)
    .describe('Brief paragraph summarizing the match analysis'),
  strengths: z
    .array(z.string())
    .describe('List of resume strengths relative to the job'),
  missingSkills: z
    .array(z.string())
    .describe('Skills mentioned in the JD but absent from the resume'),
  keywordCoverage: z
    .array(KeywordCoverageSchema)
    .describe('Key JD keywords and whether they appear in the resume'),
  atsIssues: z
    .array(z.string())
    .describe('ATS compatibility issues found in the resume'),
  recommendedImprovements: z
    .array(z.string())
    .describe('Actionable improvement suggestions backed by the resume'),
  improvedProfessionalSummary: z
    .string()
    .describe('AI-improved professional summary based on existing resume content'),
  improvedBulletPoints: z
    .array(z.string())
    .describe('AI-improved experience bullet points using only existing achievements'),
})

/** TypeScript type inferred from the Zod schema */
export type AnalysisResponse = z.infer<typeof AnalysisResponseSchema>

/** TypeScript type for a single keyword coverage entry */
export type KeywordCoverage = z.infer<typeof KeywordCoverageSchema>
