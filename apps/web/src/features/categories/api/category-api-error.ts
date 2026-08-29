import { categoryErrorResponseSchema } from "@gestor-finanzas/contracts";
import axios from "axios";

export class CategoryApiError extends Error {
  constructor(
    message: string,
    readonly code?: string,
  ) {
    super(message);
    this.name = "CategoryApiError";
  }
}

export function toCategoryApiError(error: unknown): CategoryApiError {
  if (axios.isAxiosError(error)) {
    const parsed = categoryErrorResponseSchema.safeParse(error.response?.data);
    if (parsed.success) {
      return new CategoryApiError(parsed.data.message, parsed.data.code);
    }
  }

  return new CategoryApiError(
    "No fue posible completar la operación. Inténtalo nuevamente.",
  );
}
