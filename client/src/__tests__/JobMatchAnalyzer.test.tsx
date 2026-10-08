import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import JobMatchAnalyzer from '../components/JobMatchAnalyzer'

describe('JobMatchAnalyzer component', () => {
  it('renders section header, input textarea, and AI CTA banner', () => {
    render(<JobMatchAnalyzer skills={['React', 'TypeScript']} />)

    expect(screen.getByText('Job Description Match Analyzer')).toBeInTheDocument()
    expect(screen.getByText('Try Gemini AI Analyzer')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/paste the complete job description here/i)).toBeInTheDocument()
  })

  it('shows empty waiting state when job description is empty', () => {
    render(<JobMatchAnalyzer skills={['React']} />)
    expect(screen.getByText('Waiting for analysis')).toBeInTheDocument()
  })

  it('computes ATS match score, matched skills, and suggestions when job description is pasted', () => {
    const skills = ['React', 'TypeScript', 'Docker']
    render(<JobMatchAnalyzer skills={skills} />)

    const textarea = screen.getByPlaceholderText(/paste the complete job description here/i)
    fireEvent.change(textarea, {
      target: { value: 'We are seeking a React and TypeScript engineer with Docker experience.' },
    })

    expect(screen.getAllByText('100%').length).toBeGreaterThan(0)
    expect(screen.getByText('ATS MATCH')).toBeInTheDocument()
    expect(screen.getAllByText('Matched Skills').length).toBeGreaterThan(0)
  })

  it('clears job description when clicking Clear button', () => {
    render(<JobMatchAnalyzer skills={['React']} />)

    const textarea = screen.getByPlaceholderText(/paste the complete job description here/i)
    fireEvent.change(textarea, { target: { value: 'Software engineer role' } })

    const clearBtn = screen.getByRole('button', { name: /clear/i })
    fireEvent.click(clearBtn)

    expect(textarea).toHaveValue('')
  })
})
