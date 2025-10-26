import { ApiClient } from "../client";
import { API_ENDPOINTS } from "../config";
import { User, PaginatedResponse, QueryParams } from "../types";

/**
 * User Service
 */
export class UserService {
  /**
   * Get list of users with pagination and filters
   */
  static async getUsers(
    params?: QueryParams
  ): Promise<PaginatedResponse<User>> {
    return ApiClient.get<PaginatedResponse<User>>(API_ENDPOINTS.USERS.LIST, {
      params,
    });
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string): Promise<User> {
    return ApiClient.get<User>(API_ENDPOINTS.USERS.DETAIL(id));
  }

  /**
   * Create new user
   */
  static async createUser(data: Partial<User>): Promise<User> {
    return ApiClient.post<User>(API_ENDPOINTS.USERS.CREATE, data);
  }

  /**
   * Update user
   */
  static async updateUser(id: string, data: Partial<User>): Promise<User> {
    return ApiClient.put<User>(API_ENDPOINTS.USERS.UPDATE(id), data);
  }

  /**
   * Delete user
   */
  static async deleteUser(id: string): Promise<void> {
    return ApiClient.delete<void>(API_ENDPOINTS.USERS.DELETE(id));
  }
}
