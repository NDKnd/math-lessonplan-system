import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { API_CONFIG } from "./config";
import { ApiError, ApiResponse } from "./types";

/**
 * Token Storage Helper
 */
export const TokenStorage = {
  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  },

  setToken: (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token);
    }
  },

  getRefreshToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("refresh_token");
    }
    return null;
  },

  setRefreshToken: (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("refresh_token", token);
    }
  },

  clearTokens: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  },
};

/**
 * Create Axios Instance
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS,
  });

  // Request Interceptor
  client.interceptors.request.use(
    (config) => {
      // Add authorization token
      const token = TokenStorage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Log request in development
      if (process.env.NODE_ENV === "development") {
        console.log(
          `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
          {
            params: config.params,
            data: config.data,
          }
        );
      }

      return config;
    },
    (error) => {
      console.error("❌ Request Error:", error);
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log response in development
      if (process.env.NODE_ENV === "development") {
        console.log(
          `✅ API Response: ${response.config.method?.toUpperCase()} ${
            response.config.url
          }`,
          {
            status: response.status,
            data: response.data,
          }
        );
      }

      return response;
    },
    async (error: AxiosError<ApiResponse>) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      // Log error in development
      if (process.env.NODE_ENV === "development") {
        console.error("❌ API Error:", {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
        });
      }

      // Handle 401 Unauthorized - Token expired
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = TokenStorage.getRefreshToken();

          if (refreshToken) {
            // Try to refresh token
            const response = await axios.post(
              `${API_CONFIG.BASE_URL}/auth/refresh`,
              { refreshToken }
            );

            const { token, refreshToken: newRefreshToken } = response.data.data;

            // Update tokens
            TokenStorage.setToken(token);
            if (newRefreshToken) {
              TokenStorage.setRefreshToken(newRefreshToken);
            }

            // Retry original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }

            return client(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          TokenStorage.clearTokens();

          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }

          return Promise.reject(refreshError);
        }
      }

      // Transform error to ApiError format
      const apiError: ApiError = {
        message:
          error.response?.data?.message || error.message || "An error occurred",
        statusCode: error.response?.status || 500,
        errors: error.response?.data?.errors,
      };

      return Promise.reject(apiError);
    }
  );

  return client;
};

/**
 * API Client Instance
 */
export const apiClient = createApiClient();

/**
 * Generic API Request Handler
 */
export class ApiClient {
  /**
   * GET request
   */
  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.get<ApiResponse<T>>(url, config);
    return response.data.data as T;
  }

  /**
   * POST request
   */
  static async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await apiClient.post<ApiResponse<T>>(url, data, config);
    return response.data.data as T;
  }

  /**
   * PUT request
   */
  static async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await apiClient.put<ApiResponse<T>>(url, data, config);
    return response.data.data as T;
  }

  /**
   * PATCH request
   */
  static async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
    return response.data.data as T;
  }

  /**
   * DELETE request
   */
  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.delete<ApiResponse<T>>(url, config);
    return response.data.data as T;
  }
}

export default apiClient;
