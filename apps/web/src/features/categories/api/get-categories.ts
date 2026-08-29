import { listCategoriesResponseSchema } from "@gestor-finanzas/contracts";
import { httpClient } from "@/src/lib/api/http-client";
import { toCategoryApiError } from "./category-api-error";

export async function getCategories() {
  try {
    const response = await httpClient.get("/categories");
    return listCategoriesResponseSchema.parse(response.data);
  } catch (error) {
    throw toCategoryApiError(error);
  }
}
