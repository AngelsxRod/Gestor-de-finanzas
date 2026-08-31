"use client";

import { Button } from "@gestor-finanzas/ui";
import { useBudgetModal } from "../context/budget-modal-context";

export function CreateBudgetTriggerButton() {
  const { openCreate } = useBudgetModal();

  return (
    <Button type="button" onClick={openCreate}>
      Nuevo presupuesto
    </Button>
  );
}
