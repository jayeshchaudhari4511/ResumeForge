import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Navbar from '../components/Navbar'

describe('Navbar component', () => {
  it('renders brand logo and navigation links', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar />
      </MemoryRouter>
    )

    expect(screen.getByText('ResumeForge')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /home/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: /builder/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: /ai analyzer/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: /about/i }).length).toBeGreaterThan(0)
  })

  it('toggles mobile menu on hamburger button click', () => {
    render(
      <MemoryRouter initialEntries={['/builder']}>
        <Navbar />
      </MemoryRouter>
    )

    const toggleBtn = screen.getByRole('button', { name: /open menu/i })
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(toggleBtn)
    expect(screen.getByRole('button', { name: /close menu/i })).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(screen.getByRole('button', { name: /close menu/i }))
    expect(screen.getByRole('button', { name: /open menu/i })).toHaveAttribute('aria-expanded', 'false')
  })
})
