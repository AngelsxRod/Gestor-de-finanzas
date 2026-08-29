import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/get-categories";

export const categoriesQueryKey = ["categories"] as const;

export function useCategoriesQuery() {
  return useQuery({ queryKey: categoriesQueryKey, queryFn: getCategories });
}
