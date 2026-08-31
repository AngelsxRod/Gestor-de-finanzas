import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginRequestSchema,
  type LoginRequest,
} from "@gestor-finanzas/contracts";
import { useForm } from "react-hook-form";

export function useLoginForm() {
  return useForm<LoginRequest>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: { username: "", password: "" },
  });
}
