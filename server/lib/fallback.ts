import type { AnalysisResponse } from './schema.js'

const STOP_WORDS = new Set([
  'a','an','and','are','as','at','be','been','being','but','by','do','does',
  'did','for','from','had','has','have','he','her','here','him','his','how',
  'i','if','in','into','is','it','its','just','me','more','my','not','of',
  'on','or','our','out','over','own','re','so','some','than','that','the',
  'their','them','then','there','these','they','this','those','to','too',
  'up','us','was','we','were','what','when','where','which','while','who',
  'will','with','would','you','your','about','after','all','also','any',
  'can','could','each','experience','good','great','have','help','including',
  'knowledge','looking','need','new','please','required','role','should',
  'strong','team','understand','work','working','years','year','must','well',
  'ability','background','candidate','company','develop','following','join',
  'minimum','opportunity','position','preferred','qualifications','skills',
  'responsibilities','using','utilize','various','within','without','proven',
  'excellent','proficient','familiarity','understanding','demonstrated',
])

function extractKeywords(text: string): string[] {
  const words = text
    .replace(/[^\w\s]/g, ' ')
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w))

  const unique = Array.from(new Set(words))
  return unique.slice(0, 12)
}

export function generateFallbackAnalysis(
  resumeData: {
    personalData?: Record<string, string>
    educationList?: Array<Record<string, string>>
    experienceList?: Array<Record<string, string>>
    skills?: string[]
    certifications?: Array<Record<string, string>>
  },
  jobDescription: string
): AnalysisResponse {
  const resumeSkills = (resumeData.skills || []).map(s => s.trim())
  const resumeSkillsLower = new Set(resumeSkills.map(s => s.toLowerCase()))
  const jdKeywords = extractKeywords(jobDescription)

  const matchedSkills: string[] = []
  const missingSkills: string[] = []

  // Check JD keywords against resume skills
  const keywordCoverage = jdKeywords.map(kw => {
    const found = resumeSkillsLower.has(kw) || resumeSkills.some(s => s.toLowerCase().includes(kw))
    if (found) {
      if (!matchedSkills.includes(kw)) matchedSkills.push(kw.charAt(0).toUpperCase() + kw.slice(1))
    } else {
      if (!missingSkills.includes(kw)) missingSkills.push(kw.charAt(0).toUpperCase() + kw.slice(1))
    }
    return {
      keyword: kw.charAt(0).toUpperCase() + kw.slice(1),
      found,
    }
  })

  // Add existing resume skills to strengths
  const strengths = [
    ...resumeSkills.slice(0, 3).map(s => `Demonstrated proficiency in ${s}`),
    'Relevant hands-on project and domain experience',
    'Structured resume format suitable for initial ATS scanning',
  ].filter(Boolean).slice(0, 4)

  const matchRatio = keywordCoverage.length > 0
    ? keywordCoverage.filter(k => k.found).length / keywordCoverage.length
    : 0.7

  const matchScore = Math.min(Math.max(Math.round(matchRatio * 100), 55), 92)

  const fullName = resumeData.personalData?.fullName || 'Candidate'
  const primarySkill = resumeSkills[0] || 'software development'

  return {
    matchScore,
    summary: `The candidate demonstrates solid baseline alignment with the role, matching ${matchedSkills.length} key required competencies. Highlighting specific achievements and closing key skill gaps in ${missingSkills.slice(0, 2).join(' and ') || 'advanced tools'} will maximize ATS impact.`,
    strengths,
    missingSkills: missingSkills.slice(0, 5),
    keywordCoverage: keywordCoverage.slice(0, 10),
    atsIssues: [
      'Ensure standard section headings (e.g. "Work Experience" instead of custom titles)',
      'Add quantitative metrics (percentages, user counts, performance gains) to bullet points',
    ],
    recommendedImprovements: [
      `Explicitly include target keywords such as ${missingSkills.slice(0, 2).join(', ') || 'key technologies'} in your Experience bullets.`,
      'Quantify your impact using measurable results (e.g., "improved efficiency by 25%").',
      'Align project descriptions to directly reflect the core responsibilities outlined in the job description.',
    ],
    improvedProfessionalSummary: `Results-driven professional with expertise in ${resumeSkills.slice(0, 4).join(', ') || primarySkill}. Proven track record of delivering high-quality solutions, optimizing workflows, and applying technical skills to solve complex problems in alignment with target role requirements.`,
    improvedBulletPoints: [
      `Engineered scalable solutions leveraging ${primarySkill}, improving overall workflow efficiency by 30%.`,
      `Collaborated with cross-functional teams to implement core features, adhering to modern best practices.`,
      `Optimized content and project deliverables, resulting in enhanced performance and stakeholder satisfaction.`,
    ],
  }
}
