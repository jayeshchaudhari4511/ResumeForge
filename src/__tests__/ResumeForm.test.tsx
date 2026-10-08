import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ResumeForm from '../components/ResumeForm'

const initialData = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  linkedin: '',
  github: '',
}

describe('ResumeForm component', () => {
  it('renders Personal Details section header and input fields', () => {
    const onChange = vi.fn()
    render(<ResumeForm data={initialData} onChange={onChange} />)

    expect(screen.getByText('Personal Details')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument()
  })

  it('calls onChange when typing into personal detail inputs', () => {
    const onChange = vi.fn()
    render(<ResumeForm data={initialData} onChange={onChange} />)

    const nameInput = screen.getByPlaceholderText('John Doe')
    fireEvent.change(nameInput, { target: { value: 'Alex Smith' } })

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ fullName: 'Alex Smith' })
    )
  })

  it('displays progress bar according to filled field count', () => {
    const data = { ...initialData, fullName: 'Alex', email: 'alex@example.com' }
    const onChange = vi.fn()

    render(<ResumeForm data={data} onChange={onChange} />)

    expect(screen.getByText('2 of 6 fields filled')).toBeInTheDocument()
    expect(screen.getByText('33% complete')).toBeInTheDocument()
  })
})
