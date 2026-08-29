import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCategoryRequestSchema,
  type CreateCategoryRequest,
} from "@gestor-finanzas/contracts";
import { useForm } from "react-hook-form";

export function useCategoryForm() {
  return useForm<CreateCategoryRequest>({
    resolver: zodResolver(createCategoryRequestSchema),
    defaultValues: { name: "", type: "expense" },
  });
}
