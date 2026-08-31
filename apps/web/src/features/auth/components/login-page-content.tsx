"use client";

import type { LoginRequest } from "@gestor-finanzas/contracts";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthApiError } from "../api/auth-api-error";
import { useLoginMutation } from "../hooks/use-login-mutation";
import { LoginForm } from "./login-form";

function redirectTarget(from: string | null): string {
  return from && from.startsWith("/") && !from.startsWith("//") ? from : "/";
}

export function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLoginMutation();

  async function submit(values: LoginRequest) {
    await loginMutation.mutateAsync(values);
    router.replace(redirectTarget(searchParams.get("from")));
  }

  const errorMessage =
    loginMutation.error instanceof AuthApiError
      ? loginMutation.error.message
      : undefined;

  return (
    <main className="flex min-h-screen items-center justify-center p-[var(--ui-space-6)]">
      <LoginForm
        errorMessage={errorMessage}
        isSubmitting={loginMutation.isPending}
        onSubmit={submit}
      />
    </main>
  );
}
