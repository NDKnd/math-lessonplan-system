import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PracticeService } from "../api";
import {
  StartPracticeRequest,
  SubmitPracticeRequest,
  QueryParams,
} from "../api/types";

/**
 * Query Keys
 */
export const practiceKeys = {
  all: ["practice"] as const,
  results: (sessionId: string) =>
    [...practiceKeys.all, "results", sessionId] as const,
  history: (params?: QueryParams) =>
    [...practiceKeys.all, "history", params] as const,
};

/**
 * Hook to start practice
 */
export function useStartPractice() {
  return useMutation({
    mutationFn: (data: StartPracticeRequest) =>
      PracticeService.startPractice(data),
  });
}

/**
 * Hook to submit practice
 */
export function useSubmitPractice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitPracticeRequest) =>
      PracticeService.submitPractice(data),
    onSuccess: (data) => {
      // Set results in cache
      queryClient.setQueryData(practiceKeys.results(data.sessionId), data);

      // Invalidate history
      queryClient.invalidateQueries({
        queryKey: [...practiceKeys.all, "history"],
      });
    },
  });
}

/**
 * Hook to get practice results
 */
export function usePracticeResults(sessionId: string) {
  return useQuery({
    queryKey: practiceKeys.results(sessionId),
    queryFn: () => PracticeService.getPracticeResults(sessionId),
    enabled: !!sessionId,
  });
}

/**
 * Hook to get practice history
 */
export function usePracticeHistory(params?: QueryParams) {
  return useQuery({
    queryKey: practiceKeys.history(params),
    queryFn: () => PracticeService.getPracticeHistory(params),
  });
}
