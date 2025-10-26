/**
 * Common API Response Types
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

/**
 * Authentication Types
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  role?: UserRole;
}

/**
 * User Types
 */
export enum UserRole {
  ADMIN = "admin",
  TEACHER = "teacher",
  STUDENT = "student",
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Lesson Types
 */
export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  grade: number;
  subject: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLessonRequest {
  title: string;
  description: string;
  content: string;
  grade: number;
  subject: string;
}

export interface UpdateLessonRequest extends Partial<CreateLessonRequest> {}

/**
 * Question Types
 */
export enum QuestionType {
  MULTIPLE_CHOICE = "multiple_choice",
  TRUE_FALSE = "true_false",
  SHORT_ANSWER = "short_answer",
  ESSAY = "essay",
}

export enum DifficultyLevel {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export interface Question {
  id: string;
  lessonId: string;
  question: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionRequest {
  lessonId: string;
  question: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export interface UpdateQuestionRequest extends Partial<CreateQuestionRequest> {}

/**
 * Practice Types
 */
export interface PracticeSession {
  id: string;
  userId: string;
  lessonId: string;
  questions: Question[];
  startedAt: string;
  completedAt?: string;
  score?: number;
}

export interface StartPracticeRequest {
  lessonId: string;
  questionCount?: number;
  difficulty?: DifficultyLevel;
}

export interface SubmitPracticeRequest {
  sessionId: string;
  answers: {
    questionId: string;
    answer: string | string[];
  }[];
}

export interface PracticeResult {
  sessionId: string;
  score: number;
  totalPoints: number;
  correctAnswers: number;
  totalQuestions: number;
  answers: {
    questionId: string;
    question: Question;
    userAnswer: string | string[];
    correctAnswer: string | string[];
    isCorrect: boolean;
    pointsEarned: number;
  }[];
  completedAt: string;
}

/**
 * Query Parameters
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FilterParams {
  search?: string;
  [key: string]: any;
}

export type QueryParams = PaginationParams & SortParams & FilterParams;
