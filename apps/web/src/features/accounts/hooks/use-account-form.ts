import { zodResolver } from "@hookform/resolvers/zod";
import {
  createAccountRequestSchema,
  type CreateAccountRequest,
} from "@gestor-finanzas/contracts";
import { useForm } from "react-hook-form";

export function useAccountForm(defaultValues?: CreateAccountRequest) {
  return useForm<CreateAccountRequest>({
    resolver: zodResolver(createAccountRequestSchema),
    defaultValues: defaultValues ?? {
      name: "",
      type: "cash",
      currency: "GTQ",
      openingBalance: "0.0000",
    },
  });
}
