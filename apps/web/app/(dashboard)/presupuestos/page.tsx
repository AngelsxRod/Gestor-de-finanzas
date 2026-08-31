import type { Metadata } from "next";
import { BudgetsDashboard } from "@/src/features/budgets/components/budgets-dashboard";
import { CreateBudgetTriggerButton } from "@/src/features/budgets/components/create-budget-trigger-button";
import { BudgetModalProvider } from "@/src/features/budgets/context/budget-modal-context";
import { SectionHeader } from "@/src/features/shell/components/section-header";
import { SectionTemplate } from "@/src/features/shell/templates/section-template";

export const metadata: Metadata = {
  title: "Presupuestos · Gestor de finanzas",
};

export default function PresupuestosPage() {
  return (
    <BudgetModalProvider>
      <SectionTemplate
        header={
          <SectionHeader
            title="Presupuestos"
            description="Límites y seguimiento por categoría."
            breadcrumbItems={[
              { label: "Resumen", href: "/" },
              { label: "Presupuestos" },
            ]}
            action={<CreateBudgetTriggerButton />}
          />
        }
        content={<BudgetsDashboard />}
      />
    </BudgetModalProvider>
  );
}
