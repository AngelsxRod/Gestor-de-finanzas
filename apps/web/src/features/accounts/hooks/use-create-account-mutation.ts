import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAccount } from "../api/create-account";
import { accountsQueryKey } from "./use-accounts-query";

export function useCreateAccountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAccount,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: accountsQueryKey }),
  });
}
