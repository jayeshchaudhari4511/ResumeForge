import { GoogleGenerativeAI } from '@google/generative-ai'

/** Default timeout for Gemini requests (30 seconds) */
const REQUEST_TIMEOUT_MS = 30_000

/** Candidate Gemini models to try in sequence if one hits rate limits / quota */
const CANDIDATE_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-2.5-flash',
]

/** Delay helper for retries */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Call the Gemini API with structured JSON output.
 * Tries multiple model candidates and handles rate limits gracefully.
 *
 * @param systemPrompt - The system instruction for the model
 * @param userPrompt   - The user message containing resume + JD
 * @returns Raw string response from Gemini (expected to be JSON)
 * @throws Error if API key is missing, timeout, or network failure
 */
export async function callGemini(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY?.trim()

  if (
    !apiKey ||
    apiKey === 'your_google_gemini_api_key_here' ||
    apiKey === 'your_key_here' ||
    apiKey === 'YOUR_GEMINI_API_KEY'
  ) {
    throw new Error(
      'GEMINI_API_KEY is not set in .env.local. Please set GEMINI_API_KEY=your_key in .env.local'
    )
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  let lastError: Error | null = null

  for (let mIndex = 0; mIndex < CANDIDATE_MODELS.length; mIndex++) {
    const modelName = CANDIDATE_MODELS[mIndex]

    for (let attempt = 0; attempt < 2; attempt++) {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemPrompt,
          generationConfig: {
            temperature: 0.3,
            topP: 0.8,
            maxOutputTokens: 4096,
            responseMimeType: 'application/json',
          },
        })

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        })

        const response = result.response
        const text = response.text()

        if (!text || text.trim().length === 0) {
          throw new Error(`Gemini model ${modelName} returned an empty response.`)
        }

        console.log(`[gemini] Successfully generated response using model '${modelName}'`)
        return text
      } catch (error: unknown) {
        if (error instanceof Error) {
          lastError = error
          const errStr = error.message.toLowerCase()
          const isQuota = errStr.includes('429') || errStr.includes('quota') || errStr.includes('resource_exhausted') || errStr.includes('rate limit')

          if (error.name === 'AbortError') {
            console.warn(`[gemini] Request to ${modelName} timed out after 30 seconds.`)
            break // try next model
          }

          if (isQuota) {
            console.warn(`[gemini] Model ${modelName} hit quota/rate limit (attempt ${attempt + 1}/2).`)
            if (attempt === 0) {
              // Wait 1 second before retrying same model
              await delay(1000)
              continue
            }
          } else {
            console.warn(`[gemini] Error with model ${modelName}:`, error.message)
            break // Non-quota error, switch model candidate
          }
        }
      } finally {
        clearTimeout(timeoutId)
      }
    }
  }

  // If all models and attempts failed
  if (lastError) {
    const errStr = lastError.message.toLowerCase()
    if (errStr.includes('429') || errStr.includes('quota') || errStr.includes('resource_exhausted')) {
      throw new Error(
        'API quota exceeded across all model tiers. Please wait a moment and try again, or check your Gemini API quota.'
      )
    }
    throw lastError
  }

  throw new Error('An unknown error occurred while calling Gemini API.')
}

