"use client";

import type { CreateCategoryRequest } from "@gestor-finanzas/contracts";
import { CategoryApiError } from "../api/category-api-error";
import { useCategoriesQuery } from "../hooks/use-categories-query";
import { useCreateCategoryMutation } from "../hooks/use-create-category-mutation";
import { CategoryForm } from "./category-form";
import { CategoryList } from "./category-list";

export function CategoriesDashboard() {
  const categoriesQuery = useCategoriesQuery();
  const createCategory = useCreateCategoryMutation();

  async function submit(input: CreateCategoryRequest) {
    await createCategory.mutateAsync(input);
  }

  const formError =
    createCategory.error instanceof CategoryApiError
      ? createCategory.error.message
      : undefined;

  return (
    <section
      aria-label="Administración de categorías"
      className="grid gap-[var(--ui-space-6)] lg:grid-cols-2 lg:items-start"
    >
      <CategoryForm
        errorMessage={formError}
        isSubmitting={createCategory.isPending}
        onSubmit={submit}
        successMessage={
          createCategory.isSuccess
            ? "La categoría se guardó correctamente."
            : undefined
        }
      />
      {categoriesQuery.isPending ? <CategoryList state="loading" /> : null}
      {categoriesQuery.isError ? (
        <CategoryList
          state="error"
          isRetrying={categoriesQuery.isFetching}
          onRetry={() => void categoriesQuery.refetch()}
        />
      ) : null}
      {categoriesQuery.isSuccess ? (
        <CategoryList
          state="success"
          categories={categoriesQuery.data.categories}
        />
      ) : null}
    </section>
  );
}
