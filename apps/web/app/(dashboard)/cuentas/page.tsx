import type { Metadata } from "next";
import { AccountsDashboard } from "@/src/features/accounts/components/accounts-dashboard";
import { CreateAccountTriggerButton } from "@/src/features/accounts/components/create-account-trigger-button";
import { AccountModalProvider } from "@/src/features/accounts/context/account-modal-context";
import { SectionHeader } from "@/src/features/shell/components/section-header";
import { SectionTemplate } from "@/src/features/shell/templates/section-template";

export const metadata: Metadata = {
  title: "Cuentas · Gestor de finanzas",
};

export default function CuentasPage() {
  return (
    <AccountModalProvider>
      <SectionTemplate
        header={
          <SectionHeader
            title="Cuentas"
            description="Registra dónde administras tu dinero."
            breadcrumbItems={[
              { label: "Resumen", href: "/" },
              { label: "Cuentas" },
            ]}
            action={<CreateAccountTriggerButton />}
          />
        }
        content={<AccountsDashboard />}
      />
    </AccountModalProvider>
  );
}
