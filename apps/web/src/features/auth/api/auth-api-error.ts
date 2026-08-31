import { authErrorResponseSchema } from "@gestor-finanzas/contracts";
import axios from "axios";

export class AuthApiError extends Error {
  constructor(
    message: string,
    readonly code?: string,
  ) {
    super(message);
    this.name = "AuthApiError";
  }
}

export function toAuthApiError(error: unknown): AuthApiError {
  if (axios.isAxiosError(error)) {
    const parsed = authErrorResponseSchema.safeParse(error.response?.data);

    if (parsed.success) {
      return new AuthApiError(parsed.data.message, parsed.data.code);
    }
  }

  return new AuthApiError(
    "No fue posible completar la operación. Inténtalo nuevamente.",
  );
}
