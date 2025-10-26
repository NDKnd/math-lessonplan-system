import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "../api";
import { LoginRequest, RegisterRequest, User } from "../api/types";
import { TokenStorage } from "../api/client";

/**
 * Query Keys
 */
export const authKeys = {
  currentUser: ["auth", "currentUser"] as const,
};

/**
 * Hook to get current user
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.currentUser,
    queryFn: () => AuthService.getCurrentUser(),
    enabled: !!TokenStorage.getToken(),
    retry: false,
  });
}

/**
 * Hook to login
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => AuthService.login(credentials),
    onSuccess: (data) => {
      // Store tokens
      TokenStorage.setToken(data.token);
      if (data.refreshToken) {
        TokenStorage.setRefreshToken(data.refreshToken);
      }

      // Set user data in cache
      queryClient.setQueryData(authKeys.currentUser, data.user);
    },
  });
}

/**
 * Hook to register
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest) => AuthService.register(data),
    onSuccess: (data) => {
      // Store tokens
      TokenStorage.setToken(data.token);
      if (data.refreshToken) {
        TokenStorage.setRefreshToken(data.refreshToken);
      }

      // Set user data in cache
      queryClient.setQueryData(authKeys.currentUser, data.user);
    },
  });
}

/**
 * Hook to logout
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      // Clear tokens
      TokenStorage.clearTokens();

      // Clear all queries
      queryClient.clear();

      // Redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    },
  });
}

/**
 * Hook to forgot password
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => AuthService.forgotPassword(email),
  });
}

/**
 * Hook to reset password
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      AuthService.resetPassword(token, password),
  });
}
