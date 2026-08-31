import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../api/login";
import { sessionQueryKey } from "./use-session-query";

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (session) =>
      queryClient.setQueryData(sessionQueryKey, session),
  });
}
