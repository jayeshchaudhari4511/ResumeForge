# ResumeForge — Production-Ready MERN Stack Resume Builder & AI Analyzer

ResumeForge is a production-grade **MERN stack** (MongoDB, Express.js, React.js, Node.js) web application designed for creating, storing, and customizing professional resumes. It features a live dual-pane editor, multiple ATS-safe templates, pixel-perfect PDF export, secure JWT user authentication, and an **AI-powered Job Match Analyzer** backed by Google Gemini.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Folder Structure](#folder-structure)
5. [Prerequisites](#prerequisites)
6. [Environment Variables](#environment-variables)
7. [MongoDB Atlas Setup Guide](#mongodb-atlas-setup-guide)
8. [Installation & Local Setup](#installation--local-setup)
9. [Running the Application](#running-the-application)
10. [REST API Documentation](#rest-api-documentation)
11. [Postman API Testing Guide](#postman-api-testing-guide)
12. [Deployment Guide](#deployment-guide)
13. [Data Migration (Local Storage to MongoDB)](#data-migration-local-storage-to-mongodb)
14. [License](#license)

---

## Architecture Overview

ResumeForge follows a decoupled client-server architecture with secure API communication:

```
[ React Client (Vite 8) ]
   ├── Port: 5173 (Dev)
   ├── Auth Context (JWT in localStorage)
   ├── Live Resume Preview & PDF Exporter
   └── AI Job Match Analyzer UI
         │
         │  HTTP / REST (Bearer JWT Auth)
         ▼
[ Express.js REST API Server ]
   ├── Port: 5000
   ├── Auth Middleware (JWT Verification)
   ├── Error Handler & Input Validation
   ├── Gemini AI Proxy & Fallback Engine
         │
         ├── Mongoose ODM
         ▼
[ MongoDB Database (Atlas / Local) ]
   ├── Users Collection (Bcrypt Hashed Passwords)
   └── Resumes Collection (User-Scoped Documents)
```

---

## Features

### 1. User Authentication & Security
- **JWT-Based Authentication**: Secure stateless token issuance on registration and login.
- **Bcrypt Password Hashing**: Passwords salted (10 rounds) and never stored in plain text.
- **Route Protection**: Middleware ensures users can only access and modify their own resumes.
- **Sensitive Data Exclusion**: Passwords automatically stripped from JSON responses.

### 2. Resume Builder & Management
- **Tabbed Editor**: Sections for Personal Info, Education, Experience, Projects, Skills, and Certifications.
- **Cloud Persistence**: Save, load, update, and delete multiple resumes per account.
- **User Dashboard**: Overview of all saved resumes with quick actions to edit or delete.
- **Local Draft Caching**: Offline-tolerant editing with local caching so progress is never lost.

### 3. Professional Templates & Export
- **Template 1 (ATS-Friendly)**: Clean, single-column monochrome design built for ATS parsers.
- **Template 2 (Modern)**: Contemporary card layout with accent styling and timelines.
- **PDF Export**: Print-ready and digital-ready PDF generation using `jsPDF` and `html2canvas`.

### 4. AI Job Match Analyzer (Gemini 2.0 Flash)
- **ATS Match Score**: Evaluates resume fit against any pasted job description.
- **Keyword Coverage Grid**: Compares critical technical keywords found vs. missing.
- **Actionable Recommendations**: Clear, contextual suggestions without fabricated experience.
- **Offline Fallback Engine**: Deterministic keyword engine activates if API quota is reached.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, JavaScript/TypeScript, Vite 8, Tailwind CSS 3, React Router 7 |
| **Backend** | Node.js 24, Express.js 4/5, CORS, Dotenv |
| **Database** | MongoDB, Mongoose 8 ODM |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` |
| **AI Integration** | Google Generative AI SDK (`@google/generative-ai`), Gemini 2.0 Flash |
| **Validation** | Zod 3 / Mongoose Schemas |
| **PDF Generation** | jsPDF 4, html2canvas 1 |
| **Testing** | Vitest 4, React Testing Library, JSDOM |

---

## Folder Structure

```
ResumeForge/
├── client/                     # Frontend Application
│   ├── public/                 # Static public assets
│   ├── src/
│   │   ├── assets/             # Icons and media
│   │   ├── components/         # Reusable UI components
│   │   │   ├── templates/      # ATS and Modern templates
│   │   │   ├── analyzer/       # AI Analyzer widgets
│   │   │   ├── Navbar.jsx      # Navigation with auth status
│   │   │   ├── ProjectsSection.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ...
│   │   ├── context/            # AuthContext (login/register/logout)
│   │   ├── hooks/              # Custom hooks (useLocalStorage, useJobAnalysis)
│   │   ├── pages/              # Pages: Home, Builder, Dashboard, Login, Register, Analyzer, About
│   │   ├── services/           # API service client (auth, resumes, analyze)
│   │   ├── utils/              # PDF generation utilities
│   │   ├── App.jsx             # Main routing and providers
│   │   ├── index.css           # Tailwind design tokens
│   │   └── main.jsx            # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js          # Proxies /api to backend
│   └── tailwind.config.js
│
├── server/                     # Backend Application
│   ├── config/
│   │   └── db.js               # Mongoose MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # User registration, login, profile
│   │   └── resumeController.js # Resume CRUD operations
│   ├── models/
│   │   ├── User.js             # User Mongoose schema & bcrypt hooks
│   │   └── Resume.js           # Resume Mongoose schema & subdocuments
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth endpoints
│   │   ├── resumeRoutes.js     # /api/resumes endpoints
│   │   └── analyzeRoutes.js    # /api/analyze endpoint
│   ├── middleware/
│   │   ├── auth.js             # JWT bearer verification middleware
│   │   └── errorHandler.js     # Centralized 400/401/403/404/500 handler
│   ├── utils/
│   │   └── generateToken.js    # JWT signing helper
│   ├── lib/                    # Gemini AI & fallback analysis logic
│   ├── server.js               # Express application entry point
│   ├── package.json
│   ├── .env                    # Local server environment configuration
│   └── .env.example            # Sample configuration template
│
├── postman_collection.json     # Pre-configured Postman test suite
├── package.json                # Root orchestration scripts
├── .gitignore
└── README.md
```

---

## Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance OR free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster account

---

## Environment Variables

### Backend Configuration (`server/.env`)

Copy `server/.env.example` to `server/.env`:

```bash
cp server/.env.example server/.env
```

| Variable | Description | Example Value |
|---|---|---|
| `PORT` | Express server port | `5000` |
| `NODE_ENV` | Environment mode (`development` / `production`) | `development` |
| `MONGODB_URI` | MongoDB connection URI | `mongodb+srv://user:pass@cluster.mongodb.net/resumeforge?retryWrites=true&w=majority` |
| `JWT_SECRET` | Secret key used for signing JWTs | `a_very_secure_and_long_secret_key_123` |
| `JWT_EXPIRE` | Expiry duration for authentication tokens | `30d` |
| `CLIENT_URL` | Frontend origin for CORS | `http://localhost:5173` |
| `GEMINI_API_KEY` | *(Optional)* Google Gemini API key for AI analyzer | `AIzaSy...` |

> ⚠️ **Security Notice**: Never commit `server/.env` to source control. It is ignored by `.gitignore`.

---

## MongoDB Atlas Setup Guide

To use MongoDB Atlas (recommended for production and deployment):

1. **Sign Up**: Navigate to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and register for a free account.
2. **Create a Free Cluster**: Choose **M0 Free Tier**, pick your nearest AWS/GCP region, and click **Create Deployment**.
3. **Set Up Database User**:
   - Go to **Security > Database Access**.
   - Click **Add New Database User**.
   - Choose **Password** authentication, enter a username and strong password.
   - Assign database role: `Read and write to any database`.
4. **Configure Network Access**:
   - Go to **Security > Network Access**.
   - Click **Add IP Address**.
   - Choose `Allow Access from Anywhere` (`0.0.0.0/0`) for development, or add your specific IP.
5. **Get Connection String**:
   - Go to **Database > Clusters > Connect**.
   - Select **Drivers (Node.js)**.
   - Copy the URI string formatted like:
     ```
     mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/resumeforge?retryWrites=true&w=majority
     ```
6. **Set in `server/.env`**:
   Replace `<username>` and `<password>` with your Atlas user credentials and paste the connection string as `MONGODB_URI`.

---

## Installation & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/jayeshchaudhari4511/ResumeForge.git
cd ResumeForge
```

### 2. Install all dependencies

Install root, client, and server dependencies:

```bash
# Install root orchestration packages
npm install

# Install client packages
npm install --prefix client

# Install server packages
npm install --prefix server
```

---

## Running the Application

### Option A: Run Both Frontend & Backend Concurrently (Recommended)

From the project root:

```bash
npm run dev
```

This starts:
- **Express Backend Server**: `http://localhost:5000`
- **Vite React Frontend**: `http://localhost:5173`

---

### Option B: Run Services Individually

In Terminal 1 (Backend):
```bash
cd server
npm run dev
```

In Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

---

### Production Build & Local Serve

1. Build client bundle:
   ```bash
   npm run build
   ```
2. Run backend in production mode (serves static files from `client/dist`):
   ```bash
   cd server
   NODE_ENV=production npm start
   ```

---

## REST API Documentation

Base URL: `http://localhost:5000/api`

### 1. Authentication Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user with `name`, `email`, `password` |
| `POST` | `/api/auth/login` | Public | Authenticate user with `email`, `password` |
| `GET` | `/api/auth/me` | Private | Retrieve current user profile (requires Bearer token) |

#### Register Request Body
```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "password": "Password123!"
}
```

#### Register / Login Response (201 / 200)
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "_id": "660c1d2e8f1b2c0012345678",
    "name": "Alex Morgan",
    "email": "alex@example.com",
    "profile": {},
    "createdAt": "2026-10-08T16:00:00.000Z"
  },
  "message": "Account created successfully"
}
```

---

### 2. Resume Endpoints (All Protected)

Requires Header: `Authorization: Bearer <token>`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/resumes` | Retrieve all resumes belonging to the authenticated user |
| `POST` | `/api/resumes` | Create a new resume document |
| `GET` | `/api/resumes/:id` | Retrieve single resume by ID (verifies ownership) |
| `PUT` | `/api/resumes/:id` | Update resume by ID (verifies ownership) |
| `DELETE` | `/api/resumes/:id` | Delete resume by ID (verifies ownership) |

#### Create Resume Request Body
```json
{
  "title": "Full Stack Engineer Resume",
  "personal": {
    "fullName": "Alex Morgan",
    "email": "alex@example.com",
    "phone": "+1 (555) 019-2834",
    "address": "San Francisco, CA",
    "linkedin": "linkedin.com/in/alexmorgan",
    "github": "github.com/alexmorgan"
  },
  "education": [
    {
      "collegeName": "Stanford University",
      "degree": "B.S. in Computer Science",
      "cgpa": "3.9",
      "year": "2024"
    }
  ],
  "experience": [
    {
      "companyName": "Tech Corp",
      "role": "Software Engineer",
      "duration": "2024 - Present",
      "description": "Architected microservices and RESTful APIs in Node.js and MongoDB."
    }
  ],
  "projects": [
    {
      "title": "ResumeForge",
      "techStack": "React, Express, MongoDB, Tailwind",
      "link": "https://github.com/alexmorgan/resumeforge",
      "description": "MERN stack resume workspace with real-time preview."
    }
  ],
  "skills": ["JavaScript", "TypeScript", "React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
  "certifications": [
    {
      "certName": "AWS Certified Developer",
      "organization": "Amazon Web Services",
      "year": "2024"
    }
  ],
  "summary": "Full Stack Engineer specializing in scalable web architectures.",
  "template": "ats"
}
```

---

### 3. Health & AI Analysis Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Server status, database connection, timestamp |
| `POST` | `/api/analyze` | Public | Analyzes resume against job description via Gemini |

---

## Postman API Testing Guide

A complete Postman collection is included in the root directory: [`postman_collection.json`](file:///c:/assignment%20resume/resume-forge/postman_collection.json).

### Steps to Test:

1. **Open Postman** and click **Import**.
2. Select or drag-and-drop [`postman_collection.json`](file:///c:/assignment%20resume/resume-forge/postman_collection.json).
3. The collection **ResumeForge MERN API Collection** will appear with pre-configured requests and collection variables (`baseUrl`, `authToken`, `resumeId`).
4. **Execute in order**:
   - **Step 1: Register User** (`POST /api/auth/register`) — Automatically stores the returned JWT in the collection's `{{authToken}}` variable.
   - **Step 2: Login User** (`POST /api/auth/login`) — Refreshes the token.
   - **Step 3: Get Current User** (`GET /api/auth/me`) — Uses `Bearer {{authToken}}` and validates returned profile.
   - **Step 4: Create Resume** (`POST /api/resumes`) — Creates a resume and saves `_id` into `{{resumeId}}`.
   - **Step 5: Get All Resumes** (`GET /api/resumes`) — Returns list of user's resumes.
   - **Step 6: Get Single Resume** (`GET /api/resumes/{{resumeId}}`) — Verifies resume retrieval.
   - **Step 7: Update Resume** (`PUT /api/resumes/{{resumeId}}`) — Modifies resume title/skills.
   - **Step 8: Delete Resume** (`DELETE /api/resumes/{{resumeId}}`) — Removes the resume from MongoDB.
   - **Step 9: Health Check** (`GET /api/health`) — Confirms database connectivity.
   - **Step 10: AI Analyze** (`POST /api/analyze`) — Tests resume match scoring.

---

## Deployment Guide

### Backend Deployment (Render, Railway, Heroku)

1. **Deploying on Render / Railway**:
   - Create a new **Web Service** and link your Git repository.
   - Set **Root Directory** to `server`.
   - Set **Build Command**: `npm install`.
   - Set **Start Command**: `npm start`.
   - Add Environment Variables under service settings:
     ```
     NODE_ENV=production
     PORT=5000
     MONGODB_URI=<your_mongodb_atlas_uri>
     JWT_SECRET=<your_strong_random_secret>
     CLIENT_URL=https://your-frontend.vercel.app
     GEMINI_API_KEY=<your_gemini_api_key>
     ```

### Frontend Deployment (Vercel, Netlify)

1. **Deploying on Vercel**:
   - Import the GitHub repository into Vercel.
   - Set **Root Directory** to `client`.
   - Framework preset will automatically detect **Vite**.
   - Build Command: `npm run build`.
   - Output Directory: `dist`.
   - Add Environment Variable:
     ```
     VITE_API_BASE_URL=https://your-backend-service.onrender.com/api
     ```

---

## Data Migration (Local Storage to MongoDB)

1. **Automatic Hybrid Persistence**:
   - As users create or edit resumes in the Builder, work is automatically kept in local draft cache (`resumeforge_` keys).
   - Once the user logs in or clicks **Save Resume**, the builder posts the resume data to `/api/resumes` in MongoDB.
   - The returned document ID is linked in the URL (`/builder?id=...`), synchronizing all subsequent edits to the cloud database.
2. **Accessing Resumes Across Devices**:
   - On any device, simply log in and navigate to the **Dashboard** (`/dashboard`) to view and edit all cloud-saved resumes.

---

## Testing

Run the full automated test suite (unit tests, component tests, and handler tests):

```bash
npm test
```

Generate test coverage report:

```bash
npm run test:coverage
```

---

## License

This project is licensed under the MIT License. See [LICENSE](file:///c:/assignment%20resume/resume-forge/LICENSE) for details.
