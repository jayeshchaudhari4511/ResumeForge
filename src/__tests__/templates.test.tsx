import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TemplateATS from '../components/templates/TemplateATS'
import TemplateModern from '../components/templates/TemplateModern'

const mockResumeData = {
  fullName: 'Jayesh Chaudhari',
  email: 'jayesh@example.com',
  phone: '+1 234 567 890',
  address: 'San Francisco, CA',
  linkedin: 'linkedin.com/in/jayesh',
  summary: 'Experienced Full Stack Developer specializing in React & Node.',
  skills: ['React', 'TypeScript', 'Node.js', 'Express', 'Tailwind'],
  educationList: [
    {
      degree: 'B.S. Computer Science',
      collegeName: 'Stanford University',
      startYear: '2018',
      endYear: '2022',
      cgpa: '3.9 GPA',
    },
  ],
  experienceList: [
    {
      role: 'Senior Software Engineer',
      companyName: 'Tech Corp',
      location: 'Remote',
      startDate: '2022',
      endDate: 'Present',
      description: 'Built high performance web applications.',
    },
  ],
  projects: [
    {
      title: 'ResumeForge',
      techStack: 'React, Vite, Express',
      link: 'github.com/example/resumeforge',
      description: 'AI powered resume builder application.',
    },
  ],
  certifications: [
    {
      certName: 'AWS Certified Developer',
      issuer: 'Amazon Web Services',
      year: '2023',
    },
  ],
}

describe('Template Components', () => {
  describe('TemplateATS', () => {
    it('renders ATS template with full candidate resume data', () => {
      render(<TemplateATS data={mockResumeData} />)

      expect(screen.getByText('Jayesh Chaudhari')).toBeInTheDocument()
      expect(screen.getByText(/jayesh@example.com/i)).toBeInTheDocument()
      expect(screen.getByText(/B.S. Computer Science/i)).toBeInTheDocument()
      expect(screen.getByText(/Senior Software Engineer/i)).toBeInTheDocument()
      expect(screen.getAllByText(/ResumeForge/i).length).toBeGreaterThan(0)
      expect(screen.getByText(/AWS Certified Developer/i)).toBeInTheDocument()
    })

    it('handles default empty data gracefully', () => {
      render(<TemplateATS data={{}} />)
      expect(screen.getByText('Your Name')).toBeInTheDocument()
    })
  })

  describe('TemplateModern', () => {
    it('renders Modern template with full candidate resume data', () => {
      render(<TemplateModern data={mockResumeData} />)

      expect(screen.getByText('Jayesh Chaudhari')).toBeInTheDocument()
      expect(screen.getByText(/jayesh@example.com/i)).toBeInTheDocument()
      expect(screen.getByText(/B.S. Computer Science/i)).toBeInTheDocument()
      expect(screen.getByText(/Senior Software Engineer/i)).toBeInTheDocument()
      expect(screen.getAllByText(/ResumeForge/i).length).toBeGreaterThan(0)
      expect(screen.getByText(/AWS Certified Developer/i)).toBeInTheDocument()
    })

    it('handles default empty data gracefully', () => {
      render(<TemplateModern data={{}} />)
      expect(screen.getByText('Your Name')).toBeInTheDocument()
    })
  })
})
