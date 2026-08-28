import { z } from "zod";

export const demoFormSchema = z.object({
  concept: z
    .string()
    .trim()
    .min(2, "Escribe al menos 2 caracteres.")
    .max(80, "Usa 80 caracteres o menos."),
  amount: z
    .number({ error: "Escribe un monto válido." })
    .positive("El monto debe ser mayor que cero.")
    .max(1_000_000_000, "El monto excede el máximo permitido."),
});

export type DemoFormValues = z.infer<typeof demoFormSchema>;
