import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory } from "../api/update-category";
import { categoriesQueryKey } from "./use-categories-query";

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: categoriesQueryKey }),
  });
}
