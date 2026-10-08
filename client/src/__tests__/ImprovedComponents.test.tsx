import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ImprovedSummary from '../components/analyzer/ImprovedSummary'
import ImprovedBullets from '../components/analyzer/ImprovedBullets'

describe('Analyzer AI Improved Components', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    // Mock navigator.clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      writable: true,
      configurable: true,
    })
  })

  describe('ImprovedSummary', () => {
    it('renders null when improvedSummary is empty', () => {
      const { container } = render(<ImprovedSummary improvedSummary="" />)
      expect(container.firstChild).toBeNull()
    })

    it('renders summary text and handles copy to clipboard action', async () => {
      render(<ImprovedSummary improvedSummary="Engineered robust web applications." />)

      expect(screen.getByText('AI-Improved Professional Summary')).toBeInTheDocument()
      expect(screen.getByText('Engineered robust web applications.')).toBeInTheDocument()

      const copyBtn = screen.getByRole('button', { name: /copy summary/i })
      fireEvent.click(copyBtn)

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Engineered robust web applications.')
    })
  })

  describe('ImprovedBullets', () => {
    it('renders null when bullets array is empty', () => {
      const { container } = render(<ImprovedBullets bullets={[]} />)
      expect(container.firstChild).toBeNull()
    })

    it('renders bullet points, copies single bullet point, and copies all bullet points', async () => {
      const bullets = [
        'Optimized frontend render speed by 40%.',
        'Implemented TypeScript strict type checking.',
      ]

      render(<ImprovedBullets bullets={bullets} />)

      expect(screen.getByText('AI-Improved Bullet Points')).toBeInTheDocument()
      expect(screen.getByText('Optimized frontend render speed by 40%.')).toBeInTheDocument()
      expect(screen.getByText('Implemented TypeScript strict type checking.')).toBeInTheDocument()

      // Single copy button click
      const singleCopyBtn = screen.getByRole('button', { name: /copy bullet point 1/i })
      fireEvent.click(singleCopyBtn)
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Optimized frontend render speed by 40%.')

      // Copy all button click
      const copyAllBtn = screen.getByRole('button', { name: /copy all bullet points/i })
      fireEvent.click(copyAllBtn)

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        '• Optimized frontend render speed by 40%.\n• Implemented TypeScript strict type checking.'
      )

      await waitFor(() => {
        expect(screen.getByText(/copied all!/i)).toBeInTheDocument()
      })
    })
  })
})
