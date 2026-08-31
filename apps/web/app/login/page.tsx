import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginPageContent } from "@/src/features/auth/components/login-page-content";

export const metadata: Metadata = {
  title: "Iniciar sesión · Gestor de finanzas",
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  );
}
