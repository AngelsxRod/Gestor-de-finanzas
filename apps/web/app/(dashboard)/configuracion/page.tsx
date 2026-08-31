import type { Metadata } from "next";
import { EmptyState } from "@gestor-finanzas/ui";
import { SectionHeader } from "@/src/features/shell/components/section-header";
import { SectionTemplate } from "@/src/features/shell/templates/section-template";

export const metadata: Metadata = {
  title: "Configuración · Gestor de finanzas",
};

export default function ConfiguracionPage() {
  return (
    <SectionTemplate
      header={
        <SectionHeader
          title="Configuración"
          description="Preferencias de la aplicación."
          breadcrumbItems={[
            { label: "Resumen", href: "/" },
            { label: "Configuración" },
          ]}
        />
      }
      content={
        <EmptyState
          level={2}
          title="Todavía no disponible"
          description="Las preferencias de la aplicación estarán disponibles cuando se definan autenticación y ajustes de cuenta."
        />
      }
    />
  );
}
