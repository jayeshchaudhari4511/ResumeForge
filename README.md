# ResumeForge

A modern, browser-based resume builder equipped with an **AI-powered Job Match Analyzer** using Google's Gemini API. Create professional, ATS-friendly resumes and optimize them against target job descriptions.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [AI Job Match Analyzer](#ai-job-match-analyzer)
- [Testing](#testing)
- [PDF Export](#pdf-export)
- [Local Storage Persistence](#local-storage-persistence)
- [Deployment](#deployment)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)
- [Scripts](#scripts)
- [License](#license)
- [Author](#author)

---

## Overview

ResumeForge is a full-featured resume workspace that provides a live, split-screen editing experience alongside an **AI-powered Job Match Analyzer**.

Candidates can create their resume using a tabbed builder, preview it in real time, export to pixel-perfect PDF, and analyze their fit against job descriptions using Google Gemini AI.

---

## Features

### Resume Builder
- Tabbed form covering Personal Details, Education, Work Experience, Skills, and Certifications.
- Live preview that updates on every keystroke.
- Multiple professionally designed templates (ATS-Friendly & Modern).
- Automatic state persistence via `localStorage`.

### AI-Powered Job Match Analyzer (Gemini API)
- **ATS Match Score**: Animated circular progress ring with color-coded match tier.
- **Analysis Summary**: 2-3 sentence overview of candidate fit.
- **Strengths List**: Specific, evidence-backed resume strengths.
- **Missing Skills**: Clear identification of required JD skills absent in resume.
- **Keyword Coverage Grid**: Visual table checking 8-15 critical job keywords.
- **ATS Compatibility Issues**: Detection of parsing risks or formatting gaps.
- **Actionable Improvements**: Grounded recommendations with clear explanations.
- **AI-Improved Professional Summary**: Re-written summary targeting the job without inventing experience.
- **AI-Improved Bullet Points**: Rewritten bullet points with stronger action verbs.

---

## Architecture

To protect the Google Gemini API key, all AI requests are processed **server-side** through an Express proxy backend:

```
[ Browser / Vite App ] ──(POST /api/analyze)──> [ Express Server ] ──(SDK Call)──> [ Google Gemini API ]
        │                                                │                                   │
   localStorage                                     Zod Schema                         gemini-2.0-flash
  Resume Data                                        Validator                           (Structured JSON)
```

- **Development**: Concurrently runs Express API server (`http://localhost:3001`) and Vite dev server (`http://localhost:5173`). Vite proxies `/api/*` requests to Express.
- **Production**: Express server serves static assets built into `dist/` and handles `/api/analyze` requests.

---

## Environment Variables

Store your Gemini API key in `.env.local` at the root of the project:

```env
# .env.local
GEMINI_API_KEY=your_google_gemini_api_key_here
PORT=3001
```

> ⚠️ Never commit `.env.local` to version control. It is listed in `.gitignore`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Backend Proxy | Express 5 + Node.js |
| AI Model SDK | `@google/generative-ai` (Gemini 2.0 Flash) |
| Runtime Validation | Zod 3 / 4 |
| Styling | Tailwind CSS 3 (Glassmorphism & Gradients) |
| Routing | React Router DOM 7 |
| Testing Stack | Vitest + React Testing Library + jsdom |
| PDF Generation | jsPDF 4 + html2canvas 1 |

---

## Project Structure

```
resume-forge/
├── .env.local                        # Environment variables (API Key)
├── tsconfig.json                     # Frontend TypeScript configuration
├── vitest.config.ts                  # Vitest test setup
├── vite.config.js                    # Vite dev server + /api proxy config
├── server/                           # Server-side backend proxy
│   ├── index.ts                      # Express server entry point
│   ├── tsconfig.json                 # Node TypeScript config
│   ├── routes/
│   │   └── analyze.ts                # POST /api/analyze route
│   └── lib/
│       ├── gemini.ts                 # Generative AI SDK wrapper & timeout
│       ├── prompts.ts                # ATS System prompt & serializer
│       └── schema.ts                 # Zod validation schema
└── src/                              # Frontend source
    ├── main.jsx
    ├── App.jsx                       # Router setup (/builder, /analyzer, etc.)
    ├── types/
    │   └── analysis.ts               # Shared TypeScript interfaces
    ├── lib/
    │   └── api.ts                    # API client wrapper
    ├── hooks/
    │   └── useJobAnalysis.ts         # Analysis state management hook
    ├── pages/
    │   ├── Home.jsx
    │   ├── Builder.jsx
    │   └── Analyzer.tsx              # AI Analyzer Dashboard page
    ├── components/
    │   ├── JobMatchAnalyzer.jsx      # Offline analyzer + AI CTA banner
    │   └── analyzer/                 # Dashboard section components
    │       ├── ScoreRing.tsx
    │       ├── StrengthsList.tsx
    │       ├── MissingSkills.tsx
    │       ├── KeywordTable.tsx
    │       ├── AtsIssues.tsx
    │       ├── Improvements.tsx
    │       ├── ImprovedSummary.tsx
    │       ├── ImprovedBullets.tsx
    │       ├── AnalysisError.tsx
    │       └── AnalysisSkeleton.tsx
    └── __tests__/                    # Vitest test suites
        ├── schema.test.ts
        ├── useJobAnalysis.test.ts
        └── Analyzer.test.tsx
```

---

## Getting Started

### 1. Installation
```bash
git clone https://github.com/your-username/resume-forge.git
cd resume-forge
npm install
```

### 2. Configure API Key
Create a `.env.local` file:
```bash
echo "GEMINI_API_KEY=your_key_here" > .env.local
```

### 3. Run Development Servers
To run both the Vite dev server and Express API server concurrently:
```bash
npm run dev:all
```
Open `http://localhost:5173` in your browser.

---

## Testing

Run unit & integration tests using Vitest:

```bash
npm run test
```

### Test Coverage Includes:
- **Zod Schema**: Verification of Gemini response validation rules.
- **`useJobAnalysis` Hook**: Testing success, API failure, network error, and reset behavior.
- **`Analyzer` Component**: Testing page renders, input validation, loading skeletons, dashboard display, error handling, and retry.

---

## AI Job Match Analyzer Philosophy

The AI system prompt enforces strict ATS reviewer guidelines:
1. **No Invented Experience**: Recommendations reference only facts present in the resume.
2. **No Exaggerated Achievements**: Metric scope and numbers are preserved.
3. **No Unlisted Technologies**: Missing skills are flagged rather than dishonestly added.
4. **Actionable Rationale**: Every suggestion explains *why* it helps ATS or recruiters.

---

## Deployment

### Production Build
```bash
npm run build
```

### Run Server in Production Mode
```bash
NODE_ENV=production npm run server
```
The Express server serves the static assets in `dist/` and handles API requests on port 3001.

---

## Known Limitations

- **API Rate Limits**: Requests depend on Gemini API quota limits (429 errors handled gracefully).
- **Network Dependency**: AI features require internet connectivity (offline keyword analyzer remains available as fallback).
- **Single Resume Focus**: Compares current active resume in localStorage.

---

## Future Improvements

- Streaming responses for real-time AI feedback rendering.
- PDF upload to directly extract resume text via Gemini Multimodal.
- Multi-model fallback (e.g. Gemini Pro / Claude).

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev:all` | Run Vite frontend + Express server concurrently |
| `npm run dev` | Run Vite frontend dev server |
| `npm run server` | Run Express backend proxy server |
| `npm run build` | Build production frontend bundle |
| `npm run test` | Run Vitest unit & integration tests |
| `npm run lint` | Run ESLint across codebase |

---

## License

This project is licensed under the MIT License - see the [LICENSE](file:///c:/assignment%20resume/resume-forge/LICENSE) file for details.

---

## Author

Made by Jayesh Chaudhari — [jayesh6056@gmail.com](mailto:jayesh6056@gmail.com)
