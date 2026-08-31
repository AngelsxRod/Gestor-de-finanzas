import { zodResolver } from "@hookform/resolvers/zod";
import {
  createBudgetRequestSchema,
  type CreateBudgetRequest,
} from "@gestor-finanzas/contracts";
import { useForm } from "react-hook-form";

export function useBudgetForm(defaultValues: CreateBudgetRequest) {
  return useForm<CreateBudgetRequest>({
    resolver: zodResolver(createBudgetRequestSchema),
    defaultValues,
  });
}
