import type { Metadata } from "next";
import { EmptyState } from "@gestor-finanzas/ui";
import { SectionHeader } from "@/src/features/shell/components/section-header";
import { SectionTemplate } from "@/src/features/shell/templates/section-template";

export const metadata: Metadata = {
  title: "Movimientos · Gestor de finanzas",
};

export default function MovimientosPage() {
  return (
    <SectionTemplate
      header={
        <SectionHeader
          title="Movimientos"
          description="Registro de ingresos, gastos y transferencias."
          breadcrumbItems={[
            { label: "Resumen", href: "/" },
            { label: "Movimientos" },
          ]}
        />
      }
      content={
        <EmptyState
          level={2}
          title="Todavía no disponible"
          description="El registro de movimientos está planificado para una próxima versión. Por ahora puedes administrar tus cuentas y categorías."
        />
      }
    />
  );
}
