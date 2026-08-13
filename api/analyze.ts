import type { Request, Response } from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { processAnalysisRequest } from '../server/lib/analyzerHandler.js'

// Load .env.local if present (useful in local dev / vercel dev environment)
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

export default async function handler(req: Request, res: Response): Promise<void> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' })
    return
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
  const result = await processAnalysisRequest(body.resumeData, body.jobDescription)
  res.status(result.status).json(result.body)
}
