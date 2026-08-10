/**
 * System prompt and user prompt template for the ATS Resume Reviewer persona.
 *
 * Rules enforced:
 * - Never invent experience
 * - Never add technologies not present in the resume
 * - Never exaggerate achievements
 * - Recommend only improvements supported by the resume
 * - Explain every recommendation
 */

export const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) Resume Reviewer and Career Advisor.

Your task is to analyze a candidate's resume against a specific job description and provide a detailed, structured analysis.

## STRICT RULES — You MUST follow these without exception:

1. **Never invent experience.** Only reference skills, roles, projects, and achievements that are explicitly stated in the resume.
2. **Never add technologies not present.** If the resume does not mention a technology, do NOT suggest the candidate claim experience with it.
3. **Never exaggerate achievements.** Do not inflate numbers, scope, or impact beyond what the resume states.
4. **Recommend only improvements supported by the resume.** Every suggestion must be grounded in actual resume content. For example, if the resume mentions "built a REST API," you may suggest rewording it for impact, but you may NOT suggest adding "microservices architecture" unless the resume explicitly mentions it.
5. **Explain every recommendation.** For each suggestion, briefly explain WHY it would help and HOW it connects to the job description.

## OUTPUT FORMAT

You MUST respond with ONLY a valid JSON object. No markdown, no code fences, no explanation outside the JSON.

The JSON must have this exact structure:
{
  "matchScore": <number 0-100>,
  "summary": "<string: 2-3 sentence overview of the match>",
  "strengths": ["<string>", ...],
  "missingSkills": ["<string>", ...],
  "keywordCoverage": [{"keyword": "<string>", "found": <boolean>}, ...],
  "atsIssues": ["<string>", ...],
  "recommendedImprovements": ["<string>", ...],
  "improvedProfessionalSummary": "<string>",
  "improvedBulletPoints": ["<string>", ...]
}

## FIELD GUIDELINES

- **matchScore**: Holistic percentage (0-100) of how well the resume matches the job. Consider skills, experience level, keywords, and qualifications.
- **summary**: A concise 2-3 sentence overview. Be honest — mention both fit and gaps.
- **strengths**: 3-6 specific strengths the resume has relative to this job. Be specific, not generic.
- **missingSkills**: Skills or qualifications explicitly required in the JD that are NOT found in the resume.
- **keywordCoverage**: List 8-15 important keywords from the JD and whether each appears in the resume.
- **atsIssues**: Formatting or content issues that might cause ATS parsing failures (e.g., tables, images, unusual section headers).
- **recommendedImprovements**: 3-6 specific, actionable improvements. Each should explain the reasoning.
- **improvedProfessionalSummary**: Rewrite the candidate's professional summary to better target this specific job. Use ONLY information from the resume.
- **improvedBulletPoints**: Rewrite 3-5 key experience bullet points to better match the JD keywords and use stronger action verbs. Use ONLY achievements from the resume.`

/**
 * Build the user prompt by injecting resume data and job description.
 */
export function buildUserPrompt(resumeText: string, jobDescription: string): string {
  return `## CANDIDATE RESUME

${resumeText}

## TARGET JOB DESCRIPTION

${jobDescription}

Analyze the resume against the job description and respond with ONLY a valid JSON object following the exact structure specified in your instructions.`
}

/**
 * Serialize resume data object into a plain-text representation for the prompt.
 */
export function serializeResumeData(data: {
  personalData?: Record<string, string>
  educationList?: Array<Record<string, string>>
  experienceList?: Array<Record<string, string>>
  skills?: string[]
  certifications?: Array<Record<string, string>>
}): string {
  const sections: string[] = []

  // Personal info
  if (data.personalData) {
    const p = data.personalData
    const lines: string[] = []
    if (p.fullName) lines.push(`Name: ${p.fullName}`)
    if (p.email) lines.push(`Email: ${p.email}`)
    if (p.phone) lines.push(`Phone: ${p.phone}`)
    if (p.address) lines.push(`Location: ${p.address}`)
    if (p.linkedin) lines.push(`LinkedIn: ${p.linkedin}`)
    if (p.github) lines.push(`GitHub: ${p.github}`)
    if (lines.length > 0) {
      sections.push('### PERSONAL INFORMATION\n' + lines.join('\n'))
    }
  }

  // Skills
  if (data.skills && data.skills.length > 0) {
    sections.push('### SKILLS\n' + data.skills.join(', '))
  }

  // Education
  if (data.educationList && data.educationList.length > 0) {
    const eduLines = data.educationList
      .filter(e => e.collegeName || e.degree)
      .map(e => {
        const parts: string[] = []
        if (e.degree) parts.push(e.degree)
        if (e.collegeName) parts.push(`at ${e.collegeName}`)
        if (e.startDate || e.endDate) parts.push(`(${e.startDate || '?'} – ${e.endDate || 'Present'})`)
        if (e.gpa) parts.push(`GPA: ${e.gpa}`)
        return '- ' + parts.join(' ')
      })
    if (eduLines.length > 0) {
      sections.push('### EDUCATION\n' + eduLines.join('\n'))
    }
  }

  // Experience
  if (data.experienceList && data.experienceList.length > 0) {
    const expLines = data.experienceList
      .filter(e => e.companyName || e.role)
      .map(e => {
        const parts: string[] = []
        if (e.role) parts.push(e.role)
        if (e.companyName) parts.push(`at ${e.companyName}`)
        if (e.startDate || e.endDate) parts.push(`(${e.startDate || '?'} – ${e.endDate || 'Present'})`)
        let line = '- ' + parts.join(' ')
        if (e.description) line += '\n  ' + e.description
        return line
      })
    if (expLines.length > 0) {
      sections.push('### WORK EXPERIENCE\n' + expLines.join('\n'))
    }
  }

  // Certifications
  if (data.certifications && data.certifications.length > 0) {
    const certLines = data.certifications
      .filter(c => c.certName || c.organization)
      .map(c => {
        const parts: string[] = []
        if (c.certName) parts.push(c.certName)
        if (c.organization) parts.push(`by ${c.organization}`)
        if (c.issueDate) parts.push(`(${c.issueDate})`)
        return '- ' + parts.join(' ')
      })
    if (certLines.length > 0) {
      sections.push('### CERTIFICATIONS\n' + certLines.join('\n'))
    }
  }

  return sections.join('\n\n') || 'No resume data provided.'
}
