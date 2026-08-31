import { sessionResponseSchema } from "@gestor-finanzas/contracts";
import { httpClient } from "@/src/lib/api/http-client";
import { toAuthApiError } from "./auth-api-error";

export async function getSession() {
  try {
    const response = await httpClient.get("/auth/session");

    return sessionResponseSchema.parse(response.data);
  } catch (error) {
    throw toAuthApiError(error);
  }
}
