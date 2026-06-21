# ResumeForge

A free, browser-based resume builder that lets you create professional, ATS-friendly resumes without signing up, without paying, and without sending your data anywhere. Everything runs locally in the browser.

Built for Digital Heroes — [digitalheroesco.com](https://digitalheroesco.com)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [Resume Templates](#resume-templates)
- [Job Description Match Analyzer](#job-description-match-analyzer)
- [PDF Export](#pdf-export)
- [Local Storage Persistence](#local-storage-persistence)
- [Scripts](#scripts)
- [Author](#author)

---

## Overview

ResumeForge is a single-page React application that provides a live, split-screen resume editing experience. The left panel contains a tabbed form where users fill in their details. The right panel renders a formatted resume preview that updates in real time. When ready, users can export their resume as a pixel-perfect PDF with one click.

No backend. No account required. No data leaves the browser.

---

## Features

**Resume Builder**
- Tabbed form covering Personal Details, Education, Work Experience, Skills, and Certifications
- Live preview that reflects every keystroke without a page refresh
- Two professionally designed resume templates with an in-preview switcher
- Field-level validation with inline error messages
- Progress indicator showing how many sections are complete

**PDF Export**
- One-click PDF download powered by html2canvas and jsPDF
- Captures the resume at 2x resolution for crisp, print-ready output
- Automatically pages content that exceeds a single A4 sheet
- Dynamic filename derived from the user's entered name

**Job Description Match Analyzer**
- Paste any job description and instantly see an ATS match score
- Circular SVG progress ring with color-coded scoring
- Side-by-side matched and missing skills breakdown
- Keyword extraction from the job description with fuzzy matching
- Actionable suggestions for improving the match score
- Highlights additional JD keywords not yet in the resume
- Entirely offline — no API calls, no external services

**Persistence**
- All form data is automatically saved to localStorage
- Survives page refreshes and browser restarts
- Namespaced under a `resumeforge_` prefix to avoid key collisions
- Full reset clears all stored keys at once

**Design**
- Dark theme with glassmorphism cards and gradient accents
- Responsive layout that works on mobile, tablet, and desktop
- Smooth micro-animations on entry, hover, and state changes
- Custom scrollbar, floating background orbs, and glow effects
- Inter typeface loaded from Google Fonts

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 3 |
| Routing | React Router DOM 7 |
| PDF generation | jsPDF 4 + html2canvas 1 |
| State persistence | Browser localStorage (custom hook) |
| Language | JavaScript (JSX) |
| Linting | ESLint 10 with react-hooks and react-refresh plugins |

---

## Project Structure

```
resume-forge/
├── index.html                        # HTML entry point with meta tags and font links
├── vite.config.js
├── tailwind.config.js                # Custom color palette, animations, and shadow tokens
├── postcss.config.js
├── package.json
└── src/
    ├── main.jsx                      # React root mount
    ├── App.jsx                       # Router, Navbar, Footer shell
    ├── index.css                     # Global styles, utility classes, scrollbar
    ├── pages/
    │   ├── Home.jsx                  # Landing page with hero, features, and CTA sections
    │   ├── Builder.jsx               # Main builder page with tab switcher and preview
    │   └── About.jsx
    ├── components/
    │   ├── Navbar.jsx                # Fixed top navigation with mobile hamburger menu
    │   ├── Footer.jsx                # Always-visible footer with maker credit and CTA
    │   ├── ResumeForm.jsx            # Personal details tab
    │   ├── EducationSection.jsx      # Education entries tab
    │   ├── ExperienceSection.jsx     # Work experience entries tab
    │   ├── SkillsSection.jsx         # Skills tag input with quick-add suggestions
    │   ├── CertificationsSection.jsx # Certifications tab
    │   ├── ResumePreview.jsx         # Live preview panel with template switcher and download button
    │   ├── JobMatchAnalyzer.jsx      # Job description match analyzer feature
    │   └── templates/
    │       ├── TemplateATS.jsx       # Template 1: black and white, single-column, ATS safe
    │       └── TemplateModern.jsx    # Template 2: blue header, card layout, visual style
    ├── hooks/
    │   └── useLocalStorage.js        # Drop-in useState replacement with localStorage sync
    └── utils/
        └── downloadPdf.js            # html2canvas capture and jsPDF multi-page export
```

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/resume-forge.git
cd resume-forge
npm install
```

### Development

Start the local development server with hot module replacement:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production build

```bash
npm run build
```

Output is placed in the `dist/` directory and can be served from any static host.

### Preview the production build

```bash
npm run preview
```

---

## Usage Guide

1. Open the app and navigate to the Builder page.
2. Fill in your details across the Personal, Education, Experience, Skills, and Certs tabs.
3. Watch the live preview on the right update as you type.
4. Switch templates using the dropdown in the preview panel header.
5. When satisfied, click Download Resume to export as a PDF.
6. To analyze a job posting, click the Analyze tab, paste the job description, and review your match score.

---

## Resume Templates

### Template 1 — ATS Friendly

- Single-column layout
- Black and white only, no background colors
- Arial / Helvetica font stack
- Plain text nodes readable by all ATS parsers
- Sections: Work Experience, Education, Projects, Skills, Certifications

### Template 2 — Modern

- Blue header with candidate name and contact chips
- Card-style section dividers
- Visual design suited for direct recruiter submission or portfolio use
- Same section coverage as the ATS template

---

## Job Description Match Analyzer

The Analyze tab provides an offline keyword-matching engine that compares your resume skills against any job description you paste.

**How the analysis works:**

1. The job description is tokenised into single words, two-word phrases, and three-word phrases.
2. Common English stop words and generic recruitment language are filtered out.
3. Each resume skill is matched against the extracted tokens using case-insensitive comparison and substring fuzzy matching.
4. A match score is computed as `(matched skills / total skills) * 100`.

**Output:**

- Circular SVG progress ring showing the ATS match percentage
- Color-coded score label: Excellent (75%+), Good (50%+), Partial (25%+), Low (below 25%)
- Matched skills list with green indicators
- Missing skills list with red indicators
- Actionable suggestions for each missing skill and relevant JD-only keyword
- Additional keywords spotted in the JD that are not yet in the resume

Everything runs synchronously in the browser. No network requests are made.

---

## PDF Export

The export pipeline in `src/utils/downloadPdf.js` works as follows:

1. `html2canvas` captures the `#resume-paper` DOM element at 2x device pixel ratio.
2. The canvas dimensions are converted from pixels to millimetres at 96 dpi.
3. A jsPDF document is created in A4 portrait format.
4. If the resume fits on one page it is placed directly. If it is taller than A4, the canvas is sliced into page-height segments and added as separate pages.
5. The resulting PDF is saved using the candidate's name as the filename (e.g. `john_doe_resume.pdf`).

---

## Local Storage Persistence

All builder state is persisted automatically through the `useLocalStorage` hook located at `src/hooks/useLocalStorage.js`.

The hook is a drop-in replacement for `useState`. It reads from storage on the first render using a lazy initialiser and writes back on every state change via `useEffect`. JSON parse failures and storage quota errors are caught silently with a console warning, and the state falls back to the provided default value.

Keys stored:

| Key | Content |
|---|---|
| `resumeforge_activeTab` | Last active builder tab |
| `resumeforge_personalData` | Name, email, phone, address, LinkedIn, GitHub |
| `resumeforge_educationList` | Array of education entries |
| `resumeforge_experienceList` | Array of work experience entries |
| `resumeforge_certifications` | Array of certification entries |
| `resumeforge_skills` | Array of skill strings |

Clicking Reset in the builder header calls `clearResumeStorage()`, which removes all keys sharing the `resumeforge_` prefix.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server with HMR |
| `npm run build` | Compile and bundle for production |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across all source files |

---

## Author

Made by Jayesh Chaudhari

Contact: [jayesh6056@gmail.com](mailto:jayesh6056@gmail.com)

Built for Digital Heroes — [digitalheroesco.com](https://digitalheroesco.com)
