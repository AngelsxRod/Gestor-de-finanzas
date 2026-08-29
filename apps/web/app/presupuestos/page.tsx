import type { Metadata } from "next";
import { EmptyState } from "@gestor-finanzas/ui";
import { SectionHeader } from "@/src/features/shell/components/section-header";
import { SectionTemplate } from "@/src/features/shell/templates/section-template";

export const metadata: Metadata = {
  title: "Presupuestos · Gestor de finanzas",
};

export default function PresupuestosPage() {
  return (
    <SectionTemplate
      header={
        <SectionHeader
          title="Presupuestos"
          description="Límites y seguimiento por categoría."
          breadcrumbItems={[
            { label: "Resumen", href: "/" },
            { label: "Presupuestos" },
          ]}
        />
      }
      content={
        <EmptyState
          level={2}
          title="Todavía no disponible"
          description="Los presupuestos y resúmenes mensuales están planificados para una próxima versión."
        />
      }
    />
  );
}
