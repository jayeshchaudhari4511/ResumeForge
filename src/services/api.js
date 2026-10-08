/**
 * API client service for ResumeForge MERN stack
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Helper to get authorization token from localStorage
 */
function getToken() {
  try {
    return localStorage.getItem('resumeforge_token') || localStorage.getItem('token');
  } catch {
    return null;
  }
}

/**
 * Universal fetch wrapper with JSON parsing and error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  let response;
  try {
    response = await fetch(url, config);
  } catch (err) {
    throw new Error('Network error. Please check your internet connection or server status.');
  }

  const contentType = response.headers.get('content-type') || '';
  let data;
  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = {};
    }
  } else {
    data = { message: await response.text().catch(() => '') };
  }

  if (!response.ok) {
    const errorMessage =
      data.error ||
      data.message ||
      (Array.isArray(data.details) ? data.details.join(', ') : null) ||
      `Request failed with status ${response.status}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/* ─────────────────────────────────────────────────────────────
   Auth APIs
───────────────────────────────────────────────────────────── */
export const authApi = {
  /**
   * Register a new user
   * @param {string} name
   * @param {string} email
   * @param {string} password
   */
  register: (name, email, password) =>
    request('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    }),

  /**
   * Log in user
   * @param {string} email
   * @param {string} password
   */
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  /**
   * Get current authenticated user details
   */
  getMe: () =>
    request('/auth/me', {
      method: 'GET',
    }),
};

/* ─────────────────────────────────────────────────────────────
   Resume APIs
───────────────────────────────────────────────────────────── */
export const resumeApi = {
  /**
   * Fetch all resumes for authenticated user
   */
  getAll: () =>
    request('/resumes', {
      method: 'GET',
    }),

  /**
   * Fetch single resume by ID
   * @param {string} id
   */
  getById: (id) =>
    request(`/resumes/${id}`, {
      method: 'GET',
    }),

  /**
   * Create a new resume
   * @param {object} resumeData
   */
  create: (resumeData) =>
    request('/resumes', {
      method: 'POST',
      body: resumeData,
    }),

  /**
   * Update an existing resume
   * @param {string} id
   * @param {object} resumeData
   */
  update: (id, resumeData) =>
    request(`/resumes/${id}`, {
      method: 'PUT',
      body: resumeData,
    }),

  /**
   * Delete a resume
   * @param {string} id
   */
  delete: (id) =>
    request(`/resumes/${id}`, {
      method: 'DELETE',
    }),
};

/* ─────────────────────────────────────────────────────────────
   AI Job Match Analyzer API
───────────────────────────────────────────────────────────── */
export const analyzeApi = {
  /**
   * Analyze resume against job description
   * @param {object} resumeData
   * @param {string} jobDescription
   */
  analyze: (resumeData, jobDescription) =>
    request('/analyze', {
      method: 'POST',
      body: { resumeData, jobDescription },
    }),
};

export default {
  auth: authApi,
  resumes: resumeApi,
  analyze: analyzeApi,
};
