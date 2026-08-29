import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setAccountActive } from "../api/set-account-active";
import { accountsQueryKey } from "./use-accounts-query";

export function useSetAccountActiveMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setAccountActive,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: accountsQueryKey }),
  });
}
