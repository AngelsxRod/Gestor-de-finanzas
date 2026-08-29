import { setCategoryActiveResponseSchema } from "@gestor-finanzas/contracts";
import { httpClient } from "@/src/lib/api/http-client";
import { toCategoryApiError } from "./category-api-error";

export type SetCategoryActiveInput = {
  id: string;
  isActive: boolean;
};

export async function setCategoryActive({
  id,
  isActive,
}: SetCategoryActiveInput) {
  try {
    const response = await httpClient.patch(`/categories/${id}/active`, {
      isActive,
    });

    return setCategoryActiveResponseSchema.parse(response.data);
  } catch (error) {
    throw toCategoryApiError(error);
  }
}
