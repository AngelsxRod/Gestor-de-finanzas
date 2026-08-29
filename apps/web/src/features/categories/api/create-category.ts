import {
  createCategoryResponseSchema,
  type CreateCategoryRequest,
} from "@gestor-finanzas/contracts";
import { httpClient } from "@/src/lib/api/http-client";
import { toCategoryApiError } from "./category-api-error";

export async function createCategory(input: CreateCategoryRequest) {
  try {
    const response = await httpClient.post("/categories", input);
    return createCategoryResponseSchema.parse(response.data);
  } catch (error) {
    throw toCategoryApiError(error);
  }
}
