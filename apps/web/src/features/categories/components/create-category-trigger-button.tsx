"use client";

import { Button } from "@gestor-finanzas/ui";
import { useCategoryModal } from "../context/category-modal-context";

export function CreateCategoryTriggerButton() {
  const { openCreate } = useCategoryModal();

  return (
    <Button type="button" onClick={openCreate}>
      Nueva categoría
    </Button>
  );
}
