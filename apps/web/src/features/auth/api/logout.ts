import { httpClient } from "@/src/lib/api/http-client";
import { toAuthApiError } from "./auth-api-error";

export async function logout() {
  try {
    await httpClient.post("/auth/logout");
  } catch (error) {
    throw toAuthApiError(error);
  }
}
