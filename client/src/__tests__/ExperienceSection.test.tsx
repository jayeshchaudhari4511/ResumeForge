import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ExperienceSection from '../components/ExperienceSection'

describe('ExperienceSection component', () => {
  it('renders existing experience records', () => {
    const experienceList = [
      { companyName: 'Google', role: 'Software Engineer', duration: '2022-Present', description: 'Built React apps.' },
    ]
    const onChange = vi.fn()

    render(<ExperienceSection experienceList={experienceList} onChange={onChange} />)

    expect(screen.getByDisplayValue('Google')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Software Engineer')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2022-Present')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Built React apps.')).toBeInTheDocument()
  })

  it('adds a new experience card when clicking Add Experience', () => {
    const experienceList: Array<Record<string, string>> = []
    const onChange = vi.fn()

    render(<ExperienceSection experienceList={experienceList} onChange={onChange} />)

    const addBtn = screen.getByRole('button', { name: /\+ add experience/i })
    fireEvent.click(addBtn)

    expect(onChange).toHaveBeenCalledWith([
      { companyName: '', role: '', duration: '', description: '' },
    ])
  })

  it('updates experience fields on user input', () => {
    const experienceList = [
      { companyName: 'Meta', role: 'Dev', duration: '', description: '' },
    ]
    const onChange = vi.fn()

    render(<ExperienceSection experienceList={experienceList} onChange={onChange} />)

    const companyInput = screen.getByDisplayValue('Meta')
    fireEvent.change(companyInput, { target: { value: 'Meta Inc' } })

    expect(onChange).toHaveBeenCalledWith([
      { companyName: 'Meta Inc', role: 'Dev', duration: '', description: '' },
    ])
  })

  it('removes experience record when clicking Remove button', () => {
    const experienceList = [
      { companyName: 'Company A', role: 'Role A', duration: '', description: '' },
      { companyName: 'Company B', role: 'Role B', duration: '', description: '' },
    ]
    const onChange = vi.fn()

    render(<ExperienceSection experienceList={experienceList} onChange={onChange} />)

    const removeBtns = screen.getAllByRole('button', { name: /remove/i })
    fireEvent.click(removeBtns[0])

    expect(onChange).toHaveBeenCalledWith([
      { companyName: 'Company B', role: 'Role B', duration: '', description: '' },
    ])
  })
})
