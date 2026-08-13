import { Router, Request, Response } from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { processAnalysisRequest } from '../lib/analyzerHandler.js'

const router = Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * POST /api/analyze
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  // Reload .env.local dynamically in case the user updated their key locally
  dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env.local'), override: true })

  const body = req.body || {}
  const result = await processAnalysisRequest(body.resumeData, body.jobDescription)
  res.status(result.status).json(result.body)
})

export default router

