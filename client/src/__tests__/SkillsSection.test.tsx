import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SkillsSection from '../components/SkillsSection'

describe('SkillsSection component', () => {
  it('renders skill pills and suggestions', () => {
    const skills = ['React', 'TypeScript']
    const onChange = vi.fn()

    render(<SkillsSection skills={skills} onChange={onChange} />)

    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText(/quick add suggestions/i)).toBeInTheDocument()
  })

  it('adds a new skill when typing into input and clicking Add Skill', () => {
    const skills = ['React']
    const onChange = vi.fn()

    render(<SkillsSection skills={skills} onChange={onChange} />)

    const input = screen.getByPlaceholderText(/e\.g\. React, Python, Docker/i)
    fireEvent.change(input, { target: { value: 'Node.js' } })

    const addBtn = screen.getByRole('button', { name: /add skill/i })
    fireEvent.click(addBtn)

    expect(onChange).toHaveBeenCalledWith(['React', 'Node.js'])
  })

  it('adds skill on Enter key press', () => {
    const skills = ['React']
    const onChange = vi.fn()

    render(<SkillsSection skills={skills} onChange={onChange} />)

    const input = screen.getByPlaceholderText(/e\.g\. React, Python, Docker/i)
    fireEvent.change(input, { target: { value: 'Express' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    expect(onChange).toHaveBeenCalledWith(['React', 'Express'])
  })

  it('displays error when attempting to add duplicate skill', () => {
    const skills = ['React']
    const onChange = vi.fn()

    render(<SkillsSection skills={skills} onChange={onChange} />)

    const input = screen.getByPlaceholderText(/e\.g\. React, Python, Docker/i)
    fireEvent.change(input, { target: { value: 'react' } })

    const addBtn = screen.getByRole('button', { name: /add skill/i })
    fireEvent.click(addBtn)

    expect(screen.getByText(/"react" is already added\./i)).toBeInTheDocument()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('removes skill when remove button is clicked', () => {
    const skills = ['React', 'CSS']
    const onChange = vi.fn()

    render(<SkillsSection skills={skills} onChange={onChange} />)

    const removeBtn = screen.getByRole('button', { name: /remove react/i })
    fireEvent.click(removeBtn)

    expect(onChange).toHaveBeenCalledWith(['CSS'])
  })

  it('adds skill when clicking suggestion chip', () => {
    const skills = ['React']
    const onChange = vi.fn()

    render(<SkillsSection skills={skills} onChange={onChange} />)

    const suggestionChip = screen.getByRole('button', { name: /^python$/i })
    fireEvent.click(suggestionChip)

    expect(onChange).toHaveBeenCalledWith(['React', 'Python'])
  })
})
