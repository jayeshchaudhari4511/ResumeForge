import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { callGemini } from '../../server/lib/gemini'

// Mock GoogleGenerativeAI
const mockGenerateContent = vi.fn()
const mockGetGenerativeModel = vi.fn(() => ({
  generateContent: mockGenerateContent,
}))

vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(function () {
      return {
        getGenerativeModel: mockGetGenerativeModel,
      }
    }),
  }
})

describe('callGemini', () => {
  const originalEnv = process.env.GEMINI_API_KEY

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.GEMINI_API_KEY = 'valid-test-gemini-key'
  })

  afterEach(() => {
    process.env.GEMINI_API_KEY = originalEnv
  })

  it('throws error if GEMINI_API_KEY is missing or template placeholder', async () => {
    delete process.env.GEMINI_API_KEY
    await expect(callGemini('sys', 'user')).rejects.toThrow(/GEMINI_API_KEY is not set/)

    process.env.GEMINI_API_KEY = 'your_google_gemini_api_key_here'
    await expect(callGemini('sys', 'user')).rejects.toThrow(/GEMINI_API_KEY is not set/)
  })

  it('successfully returns response on first model hit', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => '{"matchScore": 85}',
      },
    })

    const result = await callGemini('sys prompt', 'user prompt')
    expect(result).toBe('{"matchScore": 85}')
    expect(mockGetGenerativeModel).toHaveBeenCalledWith(expect.objectContaining({
      model: 'gemini-2.0-flash',
    }))
  })

  it('falls back to secondary model if first model hits quota/rate-limit', async () => {
    // First model fails with 429 quota twice (attempt 0 and 1)
    mockGenerateContent
      .mockRejectedValueOnce(new Error('429 Resource Exhausted'))
      .mockRejectedValueOnce(new Error('429 Resource Exhausted'))
      // Second model succeeds
      .mockResolvedValueOnce({
        response: {
          text: () => '{"matchScore": 92}',
        },
      })

    const result = await callGemini('sys prompt', 'user prompt')
    expect(result).toBe('{"matchScore": 92}')
    expect(mockGetGenerativeModel).toBeCalledTimes(3)
  })
})
