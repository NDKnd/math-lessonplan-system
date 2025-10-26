/**
 * Main API Export
 *
 * Usage:
 * import { AuthService, UserService, LessonService } from '@/lib/api';
 *
 * // Login
 * const response = await AuthService.login({ email, password });
 *
 * // Get users
 * const users = await UserService.getUsers({ page: 1, pageSize: 10 });
 */

export * from "./client";
export * from "./config";
export * from "./types";
export * from "./services";
