import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Analyzer from '../pages/Analyzer'

const mockResume = {
  personalData: { fullName: 'John Smith', email: 'john@example.com' },
  skills: ['React', 'JavaScript', 'HTML'],
  experienceList: [{ companyName: 'Tech Co', role: 'Developer' }],
}

describe('Job Match Analyzer Component', () => {
  beforeEach(() => {
    // Setup localStorage mock resume
    window.localStorage.setItem('resumeforge_personalData', JSON.stringify(mockResume.personalData))
    window.localStorage.setItem('resumeforge_skills', JSON.stringify(mockResume.skills))
    window.localStorage.setItem('resumeforge_experienceList', JSON.stringify(mockResume.experienceList))
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  // 1. Initial Render
  describe('1. Initial render', () => {
    it('renders resume status, job description input, and analyze button', () => {
      render(<Analyzer />)

      // Resume indicator / card is visible
      expect(screen.getByRole('heading', { name: /Your Resume/i })).toBeInTheDocument()
      expect(screen.getByText(/Resume Loaded/i)).toBeInTheDocument()

      // Job description field is visible and accessible
      const textarea = screen.getByRole('textbox', { name: /job description/i })
      expect(textarea).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/Paste the complete job description here/i)).toBeInTheDocument()

      // Analyze button is visible
      const analyzeBtn = screen.getByRole('button', { name: /Analyze match between resume and job description/i })
      expect(analyzeBtn).toBeInTheDocument()
    })
  })

  // 2. Validation
  describe('2. Validation', () => {
    it('disables Analyze button when job description is empty and prevents API request', () => {
      render(<Analyzer />)
      const analyzeBtn = screen.getByRole('button', { name: /Analyze match between resume and job description/i })

      // Button is disabled when job description is empty
      expect(analyzeBtn).toBeDisabled()

      // Attempting to click disabled button does not send network call
      fireEvent.click(analyzeBtn)
      expect(fetch).not.toHaveBeenCalled()
    })

    it('shows prompt message for user when job description is missing', () => {
      render(<Analyzer />)
      expect(screen.getByText(/Paste a job description above to analyze/i)).toBeInTheDocument()
      expect(screen.getByText(/Ready to Analyze/i)).toBeInTheDocument()
    })
  })

  // 3. Loading State
  describe('3. Loading state', () => {
    it('displays accessible loading state and disables analyze button during processing', async () => {
      // Return a pending promise to simulate in-flight request
      vi.mocked(fetch).mockReturnValueOnce(new Promise(() => {}))

      render(<Analyzer />)
      const textarea = screen.getByRole('textbox', { name: /job description/i })
      fireEvent.change(textarea, { target: { value: 'Senior React Developer' } })

      const analyzeBtn = screen.getByRole('button', { name: /Analyze match between resume and job description/i })
      expect(analyzeBtn).not.toBeDisabled()

      fireEvent.click(analyzeBtn)

      // Verify button changes text and is disabled while loading
      expect(screen.getByRole('button', { name: /Analyze match between resume and job description/i })).toBeDisabled()
      expect(screen.getByText(/Analyzing\.\.\./i)).toBeInTheDocument()

      // Accessible loading skeleton indicators rendered
      expect(screen.getByText(/AI Analysis in Progress/i)).toBeInTheDocument()
    })
  })

  // 4. Successful Result
  describe('4. Successful result', () => {
    it('parses mocked Gemini/API response and renders full analysis metrics', async () => {
      const mockResult = {
        matchScore: 85,
        summary: 'Great fit for the Senior React role.',
        strengths: ['Expert in React and modern JavaScript', 'Strong frontend architecture experience'],
        missingSkills: ['Kubernetes', 'GraphQL'],
        keywordCoverage: [
          { keyword: 'React', found: true },
          { keyword: 'Kubernetes', found: false },
        ],
        atsIssues: ['File format warning: Ensure standard PDF fonts are used.'],
        recommendedImprovements: ['Add Kubernetes projects to demonstrate competency.'],
        improvedProfessionalSummary: 'Senior React Developer with proven experience building scalable applications.',
        improvedBulletPoints: ['Architected scalable React applications servicing 100k+ active users.'],
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      } as Response)

      render(<Analyzer />)
      const textarea = screen.getByRole('textbox', { name: /job description/i })
      fireEvent.change(textarea, { target: { value: 'Senior React Developer with Kubernetes' } })

      const analyzeBtn = screen.getByRole('button', { name: /Analyze match between resume and job description/i })
      fireEvent.click(analyzeBtn)

      await waitFor(() => {
        // Match score label & meter element
        expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '85')
        expect(screen.getByText(/Excellent Match/i)).toBeInTheDocument()

        // Strengths
        expect(screen.getByText(/Expert in React and modern JavaScript/i)).toBeInTheDocument()

        // Missing skills
        expect(screen.getAllByText(/Kubernetes/i).length).toBeGreaterThan(0)
        expect(screen.getByText(/GraphQL/i)).toBeInTheDocument()

        // Missing ATS keywords (KeywordCoverage table)
        expect(screen.getAllByText('React').length).toBeGreaterThan(0)

        // Recommendations / Improvements
        expect(screen.getByText(/Add Kubernetes projects to demonstrate competency/i)).toBeInTheDocument()
      })
    })
  })

  // 5. API Failure
  describe('5. API failure', () => {
    it('displays user-friendly error on API failure without crashing and allows user to retry', async () => {
      // First attempt fails
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: 'Gemini API key is invalid or quota exceeded.',
          code: 'API_KEY_INVALID',
        }),
      } as Response)

      render(<Analyzer />)
      const textarea = screen.getByRole('textbox', { name: /job description/i })
      fireEvent.change(textarea, { target: { value: 'Frontend Engineer' } })

      const analyzeBtn = screen.getByRole('button', { name: /Analyze match between resume and job description/i })
      fireEvent.click(analyzeBtn)

      // User friendly error display
      await waitFor(() => {
        expect(screen.getByText(/Analysis Failed/i)).toBeInTheDocument()
        expect(screen.getByText(/Gemini API key is invalid or quota exceeded/i)).toBeInTheDocument()
      })

      // Ensure application has not crashed and retry control is rendered
      const retryBtn = screen.getByRole('button', { name: /Try Again/i })
      expect(retryBtn).toBeInTheDocument()

      // Mock secondary successful response on retry
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          matchScore: 90,
          summary: 'Successful retry analysis.',
          strengths: ['Great experience'],
          missingSkills: [],
          keywordCoverage: [],
          atsIssues: [],
          recommendedImprovements: [],
          improvedProfessionalSummary: 'Updated summary.',
          improvedBulletPoints: [],
        }),
      } as Response)

      fireEvent.click(retryBtn)

      await waitFor(() => {
        expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '90')
        expect(screen.getByText(/Successful retry analysis/i)).toBeInTheDocument()
      })
    })
  })

  // 6. Accessibility
  describe('6. Accessibility', () => {
    it('verifies controls have accessible labels and error messages are accessible', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: 'Network error occurred. Please check your connection.',
          code: 'NETWORK_ERROR',
        }),
      } as Response)

      render(<Analyzer />)

      // Accessible form inputs & buttons with ARIA labels
      const textarea = screen.getByRole('textbox', { name: /job description/i })
      expect(textarea).toHaveAttribute('aria-label', 'Job description input')

      const analyzeBtn = screen.getByRole('button', { name: /Analyze match between resume and job description/i })
      expect(analyzeBtn).toHaveAttribute('aria-label', 'Analyze match between resume and job description')

      fireEvent.change(textarea, { target: { value: 'Full Stack Engineer' } })
      fireEvent.click(analyzeBtn)

      // Accessible error alert container
      await waitFor(() => {
        const errorContainer = screen.getByRole('alert')
        expect(errorContainer).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument()
      })
    })
  })
})
