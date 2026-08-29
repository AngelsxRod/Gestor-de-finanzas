"use client";

import type { Account } from "@gestor-finanzas/contracts";
import { createModalContext } from "../../shell/context/create-modal-context";

export const { Provider: AccountModalProvider, useModalContext: useAccountModal } =
  createModalContext<Account>();
