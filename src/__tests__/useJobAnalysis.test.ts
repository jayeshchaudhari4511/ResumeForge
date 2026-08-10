import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useJobAnalysis } from '../hooks/useJobAnalysis'

const mockResumeData = {
  personalData: { fullName: 'Jane Doe', email: 'jane@example.com' },
  skills: ['React', 'TypeScript', 'Tailwind'],
  experienceList: [{ companyName: 'Acme Corp', role: 'Frontend Dev' }],
}

const mockJobDesc = 'We need a React and TypeScript developer.'

const mockAnalysisResult = {
  matchScore: 90,
  summary: 'Excellent match for the role.',
  strengths: ['React expertise', 'TypeScript proficiency'],
  missingSkills: [],
  keywordCoverage: [{ keyword: 'React', found: true }],
  atsIssues: [],
  recommendedImprovements: ['Add portfolio link'],
  improvedProfessionalSummary: 'Senior React Developer with proven track record.',
  improvedBulletPoints: ['Built scalable React UI components.'],
}

describe('useJobAnalysis hook', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('initializes with default state', () => {
    const { result } = renderHook(() => useJobAnalysis())
    expect(result.current.result).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.errorCode).toBeNull()
  })

  it('handles successful analysis flow', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAnalysisResult,
    } as Response)

    const { result } = renderHook(() => useJobAnalysis())

    await act(async () => {
      await result.current.analyze(mockResumeData, mockJobDesc)
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.result).toEqual(mockAnalysisResult)
  })

  it('handles API failure error state', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: 'Missing job description.',
        code: 'MISSING_JOB_DESCRIPTION',
      }),
    } as Response)

    const { result } = renderHook(() => useJobAnalysis())

    await act(async () => {
      await result.current.analyze(mockResumeData, '')
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.result).toBeNull()
    expect(result.current.error).toBe('Missing job description.')
    expect(result.current.errorCode).toBe('MISSING_JOB_DESCRIPTION')
  })

  it('handles network failure', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError('Failed to fetch'))

    const { result } = renderHook(() => useJobAnalysis())

    await act(async () => {
      await result.current.analyze(mockResumeData, mockJobDesc)
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.result).toBeNull()
    expect(result.current.error).toContain('Network error')
    expect(result.current.errorCode).toBe('NETWORK_ERROR')
  })

  it('resets state when reset() is called', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAnalysisResult,
    } as Response)

    const { result } = renderHook(() => useJobAnalysis())

    await act(async () => {
      await result.current.analyze(mockResumeData, mockJobDesc)
    })

    expect(result.current.result).not.toBeNull()

    act(() => {
      result.current.reset()
    })

    expect(result.current.result).toBeNull()
    expect(result.current.error).toBeNull()
  })
})
