"use client";

import type {
  Category,
  CreateCategoryRequest,
} from "@gestor-finanzas/contracts";
import { Modal } from "@gestor-finanzas/ui";
import { CategoryApiError } from "../api/category-api-error";
import { useCategoryModal } from "../context/category-modal-context";
import { useCategoriesQuery } from "../hooks/use-categories-query";
import { useCreateCategoryMutation } from "../hooks/use-create-category-mutation";
import { useSetCategoryActiveMutation } from "../hooks/use-set-category-active-mutation";
import { useUpdateCategoryMutation } from "../hooks/use-update-category-mutation";
import { CategoriesTable } from "./categories-table";
import { CategoryForm } from "./category-form";

function toFormValues(category: Category): CreateCategoryRequest {
  return { name: category.name, type: category.type };
}

export function CategoriesDashboard() {
  const categoriesQuery = useCategoriesQuery();
  const { state, close, openEdit } = useCategoryModal();
  const createCategory = useCreateCategoryMutation();
  const updateCategory = useUpdateCategoryMutation();
  const setActive = useSetCategoryActiveMutation();

  const saveMutation =
    state?.mode === "edit" ? updateCategory : createCategory;

  async function submit(values: CreateCategoryRequest) {
    if (state?.mode === "edit") {
      await updateCategory.mutateAsync({ id: state.item.id, input: values });
    } else {
      await createCategory.mutateAsync(values);
    }
    close();
  }

  const formError =
    saveMutation.error instanceof CategoryApiError
      ? saveMutation.error.message
      : undefined;

  return (
    <section
      aria-label="Administración de categorías"
      className="grid gap-[var(--ui-space-6)]"
    >
      {categoriesQuery.isPending ? <CategoriesTable state="loading" /> : null}
      {categoriesQuery.isError ? (
        <CategoriesTable
          state="error"
          isRetrying={categoriesQuery.isFetching}
          onRetry={() => void categoriesQuery.refetch()}
        />
      ) : null}
      {categoriesQuery.isSuccess ? (
        <CategoriesTable
          state="success"
          categories={categoriesQuery.data.categories}
          onEdit={openEdit}
          onToggleActive={(category) =>
            setActive.mutate({
              id: category.id,
              isActive: !category.isActive,
            })
          }
          togglingCategoryId={
            setActive.isPending ? setActive.variables?.id : undefined
          }
        />
      ) : null}

      <Modal
        open={state !== null}
        onClose={close}
        labelledBy="category-form-title"
      >
        {state !== null ? (
          <CategoryForm
            mode={state.mode}
            initialValues={
              state.mode === "edit" ? toFormValues(state.item) : undefined
            }
            isSubmitting={saveMutation.isPending}
            errorMessage={formError}
            onSubmit={submit}
          />
        ) : null}
      </Modal>
    </section>
  );
}
