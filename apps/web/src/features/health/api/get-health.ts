import { healthResponseSchema } from "@gestor-finanzas/contracts";
import { httpClient } from "@/src/lib/api/http-client";

export async function getHealth() {
  const response = await httpClient.get("/health");

  return healthResponseSchema.parse(response.data);
}
