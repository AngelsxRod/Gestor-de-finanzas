"use client";

import type { LoginRequest } from "@gestor-finanzas/contracts";
import {
  Button,
  Field,
  Heading,
  Input,
  Panel,
  PanelContent,
  PanelHeader,
  Text,
} from "@gestor-finanzas/ui";
import { useLoginForm } from "../hooks/use-login-form";

export type LoginFormProps = {
  errorMessage?: string;
  isSubmitting: boolean;
  onSubmit: (values: LoginRequest) => Promise<void>;
};

export function LoginForm({
  errorMessage,
  isSubmitting,
  onSubmit,
}: LoginFormProps) {
  const form = useLoginForm();
  const errors = form.formState.errors;

  async function submit(values: LoginRequest) {
    try {
      await onSubmit(values);
    } catch {
      // La mutación conserva el formulario y expone el error público por props.
    }
  }

  return (
    <Panel
      aria-labelledby="login-form-title"
      className="w-full max-w-sm"
    >
      <form
        noValidate
        onSubmit={(event) => void form.handleSubmit(submit)(event)}
      >
        <PanelHeader className="grid gap-[var(--ui-space-2)]">
          <Heading id="login-form-title" level={1} variant="title">
            Gestor de finanzas
          </Heading>
          <Text variant="small" tone="muted">
            Inicia sesión para continuar.
          </Text>
        </PanelHeader>

        <PanelContent className="grid gap-[var(--ui-space-5)]">
          <Field
            htmlFor="login-username"
            label="Usuario"
            error={errors.username?.message}
            required
          >
            <Input
              id="login-username"
              autoComplete="username"
              autoFocus
              aria-invalid={Boolean(errors.username)}
              {...form.register("username")}
            />
          </Field>

          <Field
            htmlFor="login-password"
            label="Contraseña"
            error={errors.password?.message}
            required
          >
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              {...form.register("password")}
            />
          </Field>

          <div aria-live="polite">
            {errorMessage ? (
              <Text role="alert" variant="small" tone="danger">
                {errorMessage}
              </Text>
            ) : null}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Iniciando sesión…" : "Iniciar sesión"}
          </Button>
        </PanelContent>
      </form>
    </Panel>
  );
}
