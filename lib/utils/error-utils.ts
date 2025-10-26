import { ApiError } from "../api/types";

/**
 * Format API error for display
 */
export function formatApiError(error: unknown): string {
  if (!error) return "An unknown error occurred";

  const apiError = error as ApiError;

  if (apiError.message) {
    return apiError.message;
  }

  if (apiError.errors) {
    // Combine all validation errors
    const errorMessages = Object.entries(apiError.errors)
      .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
      .join("; ");
    return errorMessages;
  }

  return "An error occurred";
}

/**
 * Get field-specific error messages
 */
export function getFieldErrors(error: unknown, field: string): string[] {
  if (!error) return [];

  const apiError = error as ApiError;

  if (apiError.errors && apiError.errors[field]) {
    return apiError.errors[field];
  }

  return [];
}

/**
 * Check if error is a specific status code
 */
export function isErrorStatus(error: unknown, statusCode: number): boolean {
  const apiError = error as ApiError;
  return apiError.statusCode === statusCode;
}

/**
 * Check if error is unauthorized
 */
export function isUnauthorized(error: unknown): boolean {
  return isErrorStatus(error, 401);
}

/**
 * Check if error is forbidden
 */
export function isForbidden(error: unknown): boolean {
  return isErrorStatus(error, 403);
}

/**
 * Check if error is not found
 */
export function isNotFound(error: unknown): boolean {
  return isErrorStatus(error, 404);
}

/**
 * Check if error is validation error
 */
export function isValidationError(error: unknown): boolean {
  return isErrorStatus(error, 422) || isErrorStatus(error, 400);
}
