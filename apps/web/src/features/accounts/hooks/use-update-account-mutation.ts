import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAccount } from "../api/update-account";
import { accountsQueryKey } from "./use-accounts-query";

export function useUpdateAccountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAccount,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: accountsQueryKey }),
  });
}
