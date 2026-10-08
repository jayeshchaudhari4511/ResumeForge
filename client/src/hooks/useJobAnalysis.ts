import { useState, useCallback } from 'react'
import type { AnalysisResult, ResumeData } from '../types/analysis'
import { analyzeResume, AnalysisApiError } from '../lib/api'

interface UseJobAnalysisState {
  result: AnalysisResult | null
  isLoading: boolean
  error: string | null
  errorCode: string | null
}

interface UseJobAnalysisReturn extends UseJobAnalysisState {
  analyze: (resumeData: ResumeData, jobDescription: string) => Promise<void>
  retry: () => Promise<void>
  reset: () => void
}

/**
 * Custom hook encapsulating the AI job match analysis workflow.
 *
 * Manages loading, error, and result state. Exposes `analyze()`, `retry()`, and `reset()`.
 */
export function useJobAnalysis(): UseJobAnalysisReturn {
  const [state, setState] = useState<UseJobAnalysisState>({
    result: null,
    isLoading: false,
    error: null,
    errorCode: null,
  })

  // Store last inputs for retry
  const [lastInputs, setLastInputs] = useState<{
    resumeData: ResumeData
    jobDescription: string
  } | null>(null)

  const analyze = useCallback(async (resumeData: ResumeData, jobDescription: string) => {
    setLastInputs({ resumeData, jobDescription })
    setState({ result: null, isLoading: true, error: null, errorCode: null })

    try {
      const result = await analyzeResume(resumeData, jobDescription)
      setState({ result, isLoading: false, error: null, errorCode: null })
    } catch (err: unknown) {
      if (err instanceof AnalysisApiError) {
        setState({
          result: null,
          isLoading: false,
          error: err.message,
          errorCode: err.code,
        })
      } else if (err instanceof Error) {
        setState({
          result: null,
          isLoading: false,
          error: err.message,
          errorCode: 'UNKNOWN_ERROR',
        })
      } else {
        setState({
          result: null,
          isLoading: false,
          error: 'An unexpected error occurred. Please try again.',
          errorCode: 'UNKNOWN_ERROR',
        })
      }
    }
  }, [])

  const retry = useCallback(async () => {
    if (lastInputs) {
      await analyze(lastInputs.resumeData, lastInputs.jobDescription)
    }
  }, [lastInputs, analyze])

  const reset = useCallback(() => {
    setState({ result: null, isLoading: false, error: null, errorCode: null })
    setLastInputs(null)
  }, [])

  return {
    ...state,
    analyze,
    retry,
    reset,
  }
}
