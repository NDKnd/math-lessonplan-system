import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QuestionService } from "../api";
import {
  CreateQuestionRequest,
  UpdateQuestionRequest,
  QueryParams,
} from "../api/types";

/**
 * Query Keys
 */
export const questionKeys = {
  all: ["questions"] as const,
  lists: () => [...questionKeys.all, "list"] as const,
  list: (params?: QueryParams) => [...questionKeys.lists(), params] as const,
  byLesson: (lessonId: string, params?: QueryParams) =>
    [...questionKeys.all, "lesson", lessonId, params] as const,
  details: () => [...questionKeys.all, "detail"] as const,
  detail: (id: string) => [...questionKeys.details(), id] as const,
};

/**
 * Hook to get questions list
 */
export function useQuestions(params?: QueryParams) {
  return useQuery({
    queryKey: questionKeys.list(params),
    queryFn: () => QuestionService.getQuestions(params),
  });
}

/**
 * Hook to get question by ID
 */
export function useQuestion(id: string) {
  return useQuery({
    queryKey: questionKeys.detail(id),
    queryFn: () => QuestionService.getQuestionById(id),
    enabled: !!id,
  });
}

/**
 * Hook to get questions by lesson ID
 */
export function useQuestionsByLesson(lessonId: string, params?: QueryParams) {
  return useQuery({
    queryKey: questionKeys.byLesson(lessonId, params),
    queryFn: () => QuestionService.getQuestionsByLessonId(lessonId, params),
    enabled: !!lessonId,
  });
}

/**
 * Hook to create question
 */
export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuestionRequest) =>
      QuestionService.createQuestion(data),
    onSuccess: (_, variables) => {
      // Invalidate questions list and lesson questions
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: [...questionKeys.all, "lesson", variables.lessonId],
      });
    },
  });
}

/**
 * Hook to update question
 */
export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQuestionRequest }) =>
      QuestionService.updateQuestion(id, data),
    onSuccess: (_, variables) => {
      // Invalidate questions list and detail
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: questionKeys.detail(variables.id),
      });

      // If lessonId is in data, invalidate lesson questions
      if (variables.data.lessonId) {
        queryClient.invalidateQueries({
          queryKey: [...questionKeys.all, "lesson", variables.data.lessonId],
        });
      }
    },
  });
}

/**
 * Hook to delete question
 */
export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => QuestionService.deleteQuestion(id),
    onSuccess: () => {
      // Invalidate questions list
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
    },
  });
}
