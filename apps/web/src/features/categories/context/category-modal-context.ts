"use client";

import type { Category } from "@gestor-finanzas/contracts";
import { createModalContext } from "../../shell/context/create-modal-context";

export const {
  Provider: CategoryModalProvider,
  useModalContext: useCategoryModal,
} = createModalContext<Category>();
