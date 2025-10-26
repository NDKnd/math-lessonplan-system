import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LessonService } from "../api";
import {
  CreateLessonRequest,
  UpdateLessonRequest,
  QueryParams,
} from "../api/types";

/**
 * Query Keys
 */
export const lessonKeys = {
  all: ["lessons"] as const,
  lists: () => [...lessonKeys.all, "list"] as const,
  list: (params?: QueryParams) => [...lessonKeys.lists(), params] as const,
  details: () => [...lessonKeys.all, "detail"] as const,
  detail: (id: string) => [...lessonKeys.details(), id] as const,
};

/**
 * Hook to get lessons list
 */
export function useLessons(params?: QueryParams) {
  return useQuery({
    queryKey: lessonKeys.list(params),
    queryFn: () => LessonService.getLessons(params),
  });
}

/**
 * Hook to get lesson by ID
 */
export function useLesson(id: string) {
  return useQuery({
    queryKey: lessonKeys.detail(id),
    queryFn: () => LessonService.getLessonById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create lesson
 */
export function useCreateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLessonRequest) => LessonService.createLesson(data),
    onSuccess: () => {
      // Invalidate lessons list
      queryClient.invalidateQueries({ queryKey: lessonKeys.lists() });
    },
  });
}

/**
 * Hook to update lesson
 */
export function useUpdateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLessonRequest }) =>
      LessonService.updateLesson(id, data),
    onSuccess: (_, variables) => {
      // Invalidate lessons list and detail
      queryClient.invalidateQueries({ queryKey: lessonKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: lessonKeys.detail(variables.id),
      });
    },
  });
}

/**
 * Hook to delete lesson
 */
export function useDeleteLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => LessonService.deleteLesson(id),
    onSuccess: () => {
      // Invalidate lessons list
      queryClient.invalidateQueries({ queryKey: lessonKeys.lists() });
    },
  });
}
