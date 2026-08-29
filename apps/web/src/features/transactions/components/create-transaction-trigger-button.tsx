"use client";

import { Button } from "@gestor-finanzas/ui";
import { useTransactionModal } from "../context/transaction-modal-context";

export function CreateTransactionTriggerButton() {
  const { openCreate } = useTransactionModal();

  return (
    <Button type="button" onClick={openCreate}>
      Nuevo movimiento
    </Button>
  );
}
