import { ApiClient } from "../client";
import { API_ENDPOINTS } from "../config";
import { LoginRequest, LoginResponse, RegisterRequest, User } from "../types";

/**
 * Authentication Service
 */
export class AuthService {
  /**
   * Login user
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    return ApiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  }

  /**
   * Register new user
   */
  static async register(data: RegisterRequest): Promise<LoginResponse> {
    return ApiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    return ApiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
  }

  /**
   * Get current user
   */
  static async getCurrentUser(): Promise<User> {
    return ApiClient.get<User>(API_ENDPOINTS.AUTH.ME);
  }

  /**
   * Forgot password
   */
  static async forgotPassword(email: string): Promise<{ message: string }> {
    return ApiClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email }
    );
  }

  /**
   * Reset password
   */
  static async resetPassword(
    token: string,
    password: string
  ): Promise<{ message: string }> {
    return ApiClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      {
        token,
        password,
      }
    );
  }
}
