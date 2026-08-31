import {
  loginResponseSchema,
  type LoginRequest,
} from "@gestor-finanzas/contracts";
import { httpClient } from "@/src/lib/api/http-client";
import { toAuthApiError } from "./auth-api-error";

export async function login(input: LoginRequest) {
  try {
    const response = await httpClient.post("/auth/login", input);

    return loginResponseSchema.parse(response.data);
  } catch (error) {
    throw toAuthApiError(error);
  }
}
