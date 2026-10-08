import express from 'express';
import { processAnalysisRequest } from '../lib/analyzerHandler.ts';

const router = express.Router();

/**
 * POST /api/analyze
 * Body: { resumeData, jobDescription }
 */
router.post('/', async (req, res, next) => {
  try {
    const { resumeData, jobDescription } = req.body || {};
    const result = await processAnalysisRequest(resumeData, jobDescription);
    res.status(result.status).json(result.body);
  } catch (error) {
    next(error);
  }
});

export default router;
