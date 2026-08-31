"use client";

import type { BudgetSummary } from "@gestor-finanzas/contracts";
import { createModalContext } from "../../shell/context/create-modal-context";

export const {
  Provider: BudgetModalProvider,
  useModalContext: useBudgetModal,
} = createModalContext<BudgetSummary>();
