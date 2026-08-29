import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCategoryRequestSchema,
  type CreateCategoryRequest,
} from "@gestor-finanzas/contracts";
import { useForm } from "react-hook-form";

export function useCategoryForm(defaultValues?: CreateCategoryRequest) {
  return useForm<CreateCategoryRequest>({
    resolver: zodResolver(createCategoryRequestSchema),
    defaultValues: defaultValues ?? { name: "", type: "expense" },
  });
}
