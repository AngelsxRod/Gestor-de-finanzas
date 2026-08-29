"use client";

import type { Transaction } from "@gestor-finanzas/contracts";
import { createModalContext } from "../../shell/context/create-modal-context";

export const {
  Provider: TransactionModalProvider,
  useModalContext: useTransactionModal,
} = createModalContext<Transaction>();
