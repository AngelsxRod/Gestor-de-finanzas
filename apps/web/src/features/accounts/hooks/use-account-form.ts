import { zodResolver } from "@hookform/resolvers/zod";
import {
  createAccountRequestSchema,
  type CreateAccountRequest,
} from "@gestor-finanzas/contracts";
import { useForm } from "react-hook-form";

export function useAccountForm() {
  return useForm<CreateAccountRequest>({
    resolver: zodResolver(createAccountRequestSchema),
    defaultValues: {
      name: "",
      type: "cash",
      currency: "GTQ",
      openingBalance: "0.0000",
    },
  });
}
