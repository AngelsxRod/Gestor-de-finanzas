import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setCategoryActive } from "../api/set-category-active";
import { categoriesQueryKey } from "./use-categories-query";

export function useSetCategoryActiveMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setCategoryActive,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: categoriesQueryKey }),
  });
}
