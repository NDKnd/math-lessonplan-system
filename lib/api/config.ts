/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api",
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "30000", 10),
  HEADERS: {
    "Content-Type": "application/json",
  },
};

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    ME: "/auth/me",
  },

  // Users
  USERS: {
    LIST: "/users",
    DETAIL: (id: string) => `/users/${id}`,
    CREATE: "/users",
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },

  // Lessons
  LESSONS: {
    LIST: "/lessons",
    DETAIL: (id: string) => `/lessons/${id}`,
    CREATE: "/lessons",
    UPDATE: (id: string) => `/lessons/${id}`,
    DELETE: (id: string) => `/lessons/${id}`,
  },

  // Questions
  QUESTIONS: {
    LIST: "/questions",
    DETAIL: (id: string) => `/questions/${id}`,
    CREATE: "/questions",
    UPDATE: (id: string) => `/questions/${id}`,
    DELETE: (id: string) => `/questions/${id}`,
    BY_LESSON: (lessonId: string) => `/questions/lesson/${lessonId}`,
  },

  // Practice
  PRACTICE: {
    START: "/practice/start",
    SUBMIT: "/practice/submit",
    RESULTS: "/practice/results",
    HISTORY: "/practice/history",
  },
};
