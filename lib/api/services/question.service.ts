import { ApiClient } from "../client";
import { API_ENDPOINTS } from "../config";
import {
  Question,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  PaginatedResponse,
  QueryParams,
} from "../types";

/**
 * Question Service
 */
export class QuestionService {
  /**
   * Get list of questions with pagination and filters
   */
  static async getQuestions(
    params?: QueryParams
  ): Promise<PaginatedResponse<Question>> {
    return ApiClient.get<PaginatedResponse<Question>>(
      API_ENDPOINTS.QUESTIONS.LIST,
      { params }
    );
  }

  /**
   * Get question by ID
   */
  static async getQuestionById(id: string): Promise<Question> {
    return ApiClient.get<Question>(API_ENDPOINTS.QUESTIONS.DETAIL(id));
  }

  /**
   * Get questions by lesson ID
   */
  static async getQuestionsByLessonId(
    lessonId: string,
    params?: QueryParams
  ): Promise<PaginatedResponse<Question>> {
    return ApiClient.get<PaginatedResponse<Question>>(
      API_ENDPOINTS.QUESTIONS.BY_LESSON(lessonId),
      { params }
    );
  }

  /**
   * Create new question
   */
  static async createQuestion(data: CreateQuestionRequest): Promise<Question> {
    return ApiClient.post<Question>(API_ENDPOINTS.QUESTIONS.CREATE, data);
  }

  /**
   * Update question
   */
  static async updateQuestion(
    id: string,
    data: UpdateQuestionRequest
  ): Promise<Question> {
    return ApiClient.put<Question>(API_ENDPOINTS.QUESTIONS.UPDATE(id), data);
  }

  /**
   * Delete question
   */
  static async deleteQuestion(id: string): Promise<void> {
    return ApiClient.delete<void>(API_ENDPOINTS.QUESTIONS.DELETE(id));
  }
}
