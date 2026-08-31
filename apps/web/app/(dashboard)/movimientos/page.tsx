import type { Metadata } from "next";
import { CreateTransactionTriggerButton } from "@/src/features/transactions/components/create-transaction-trigger-button";
import { TransactionsDashboard } from "@/src/features/transactions/components/transactions-dashboard";
import { TransactionModalProvider } from "@/src/features/transactions/context/transaction-modal-context";
import { SectionHeader } from "@/src/features/shell/components/section-header";
import { SectionTemplate } from "@/src/features/shell/templates/section-template";

export const metadata: Metadata = {
  title: "Movimientos · Gestor de finanzas",
};

export default function MovimientosPage() {
  return (
    <TransactionModalProvider>
      <SectionTemplate
        header={
          <SectionHeader
            title="Movimientos"
            description="Registra ingresos, gastos y transferencias entre cuentas."
            breadcrumbItems={[
              { label: "Resumen", href: "/" },
              { label: "Movimientos" },
            ]}
            action={<CreateTransactionTriggerButton />}
          />
        }
        content={<TransactionsDashboard />}
      />
    </TransactionModalProvider>
  );
}
