import { ApiClient } from "../client";
import { API_ENDPOINTS } from "../config";
import {
  Lesson,
  CreateLessonRequest,
  UpdateLessonRequest,
  PaginatedResponse,
  QueryParams,
} from "../types";

/**
 * Lesson Service
 */
export class LessonService {
  /**
   * Get list of lessons with pagination and filters
   */
  static async getLessons(
    params?: QueryParams
  ): Promise<PaginatedResponse<Lesson>> {
    return ApiClient.get<PaginatedResponse<Lesson>>(
      API_ENDPOINTS.LESSONS.LIST,
      { params }
    );
  }

  /**
   * Get lesson by ID
   */
  static async getLessonById(id: string): Promise<Lesson> {
    return ApiClient.get<Lesson>(API_ENDPOINTS.LESSONS.DETAIL(id));
  }

  /**
   * Create new lesson
   */
  static async createLesson(data: CreateLessonRequest): Promise<Lesson> {
    return ApiClient.post<Lesson>(API_ENDPOINTS.LESSONS.CREATE, data);
  }

  /**
   * Update lesson
   */
  static async updateLesson(
    id: string,
    data: UpdateLessonRequest
  ): Promise<Lesson> {
    return ApiClient.put<Lesson>(API_ENDPOINTS.LESSONS.UPDATE(id), data);
  }

  /**
   * Delete lesson
   */
  static async deleteLesson(id: string): Promise<void> {
    return ApiClient.delete<void>(API_ENDPOINTS.LESSONS.DELETE(id));
  }
}
