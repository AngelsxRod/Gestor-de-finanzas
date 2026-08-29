"use client";

import { Button } from "@gestor-finanzas/ui";
import { useTransactionModal } from "../context/transaction-modal-context";

export function CreateTransactionTriggerButton() {
  const { open } = useTransactionModal();

  return (
    <Button type="button" onClick={open}>
      Nuevo movimiento
    </Button>
  );
}
