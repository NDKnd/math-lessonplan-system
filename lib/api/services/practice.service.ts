import { ApiClient } from "../client";
import { API_ENDPOINTS } from "../config";
import {
  PracticeSession,
  StartPracticeRequest,
  SubmitPracticeRequest,
  PracticeResult,
  PaginatedResponse,
  QueryParams,
} from "../types";

/**
 * Practice Service
 */
export class PracticeService {
  /**
   * Start a new practice session
   */
  static async startPractice(
    data: StartPracticeRequest
  ): Promise<PracticeSession> {
    return ApiClient.post<PracticeSession>(API_ENDPOINTS.PRACTICE.START, data);
  }

  /**
   * Submit practice answers
   */
  static async submitPractice(
    data: SubmitPracticeRequest
  ): Promise<PracticeResult> {
    return ApiClient.post<PracticeResult>(API_ENDPOINTS.PRACTICE.SUBMIT, data);
  }

  /**
   * Get practice results by session ID
   */
  static async getPracticeResults(sessionId: string): Promise<PracticeResult> {
    return ApiClient.get<PracticeResult>(
      `${API_ENDPOINTS.PRACTICE.RESULTS}/${sessionId}`
    );
  }

  /**
   * Get practice history
   */
  static async getPracticeHistory(
    params?: QueryParams
  ): Promise<PaginatedResponse<PracticeResult>> {
    return ApiClient.get<PaginatedResponse<PracticeResult>>(
      API_ENDPOINTS.PRACTICE.HISTORY,
      { params }
    );
  }
}
