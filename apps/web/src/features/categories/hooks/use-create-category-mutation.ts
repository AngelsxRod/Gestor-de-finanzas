import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../api/create-category";
import { categoriesQueryKey } from "./use-categories-query";

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: categoriesQueryKey }),
  });
}
