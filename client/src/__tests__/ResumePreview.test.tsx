import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ResumePreview from '../components/ResumePreview'
import * as pdfModule from '../utils/downloadPdf'

vi.mock('../utils/downloadPdf', () => ({
  downloadResumePdf: vi.fn(),
}))

const mockResumeData = {
  fullName: 'John Developer',
  email: 'john@example.com',
  skills: ['React', 'TypeScript'],
}

describe('ResumePreview component', () => {
  it('renders EmptyState when resume data is empty', () => {
    render(<ResumePreview data={{}} />)
    expect(screen.getByText('Resume Preview')).toBeInTheDocument()
    expect(screen.getByText(/your live resume will appear here/i)).toBeInTheDocument()
  })

  it('renders selected template when resume data has content', () => {
    render(<ResumePreview data={mockResumeData} />)
    expect(screen.getByText('John Developer')).toBeInTheDocument()
    expect(screen.getByText('Template 1 — ATS Friendly')).toBeInTheDocument()
  })

  it('toggles template dropdown and selects Template 2 - Modern', () => {
    render(<ResumePreview data={mockResumeData} />)

    const dropdownBtn = screen.getByRole('button', { name: /template 1 — ats friendly/i })
    fireEvent.click(dropdownBtn)

    const modernOption = screen.getByRole('button', { name: /template 2 — modern/i })
    fireEvent.click(modernOption)

    expect(screen.getByText('Template 2 — Modern')).toBeInTheDocument()
  })

  it('triggers downloadResumePdf when clicking Download Resume button', () => {
    render(<ResumePreview data={mockResumeData} />)

    const downloadBtn = screen.getByRole('button', { name: /download resume/i })
    fireEvent.click(downloadBtn)

    expect(pdfModule.downloadResumePdf).toHaveBeenCalledWith(
      'john_developer_resume.pdf',
      expect.any(Function),
      expect.any(Function)
    )
  })
})
