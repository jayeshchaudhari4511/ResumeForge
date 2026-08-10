import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load .env.local before anything else
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') })

import express from 'express'
import cors from 'cors'
import analyzeRouter from './routes/analyze.js'

const app = express()
const PORT = process.env.PORT || 3001

// ── Middleware ──
app.use(cors())
app.use(express.json({ limit: '1mb' }))

// ── API Routes ──
app.use('/api/analyze', analyzeRouter)

// ── Health check ──
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  })
})

// ── Serve static files in production ──
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '..', 'dist')
  app.use(express.static(distPath))

  // SPA fallback — serve index.html for any non-API route
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

// ── Start server ──
app.listen(PORT, () => {
  console.log(`\n🚀 ResumeForge API server running on http://localhost:${PORT}`)
  console.log(`   Health check: http://localhost:${PORT}/api/health`)
  console.log(`   Gemini API key: ${process.env.GEMINI_API_KEY ? '✓ configured' : '✗ NOT SET'}\n`)
})
