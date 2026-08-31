import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../api/logout";
import { sessionQueryKey } from "./use-session-query";

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: sessionQueryKey });
    },
  });
}
