import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  demoFormSchema,
  type DemoFormValues,
} from "../schemas/demo-form-schema";

export function useArchitectureDemoForm() {
  return useForm<DemoFormValues>({
    resolver: zodResolver(demoFormSchema),
    defaultValues: {
      concept: "",
      amount: 0,
    },
  });
}
