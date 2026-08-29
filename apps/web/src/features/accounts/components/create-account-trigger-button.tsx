"use client";

import { Button } from "@gestor-finanzas/ui";
import { useAccountModal } from "../context/account-modal-context";

export function CreateAccountTriggerButton() {
  const { openCreate } = useAccountModal();

  return (
    <Button type="button" onClick={openCreate}>
      Nueva cuenta
    </Button>
  );
}
