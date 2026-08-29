import {
  updateCategoryResponseSchema,
  type UpdateCategoryRequest,
} from "@gestor-finanzas/contracts";
import { httpClient } from "@/src/lib/api/http-client";
import { toCategoryApiError } from "./category-api-error";

export type UpdateCategoryInput = {
  id: string;
  input: UpdateCategoryRequest;
};

export async function updateCategory({ id, input }: UpdateCategoryInput) {
  try {
    const response = await httpClient.patch(`/categories/${id}`, input);

    return updateCategoryResponseSchema.parse(response.data);
  } catch (error) {
    throw toCategoryApiError(error);
  }
}
