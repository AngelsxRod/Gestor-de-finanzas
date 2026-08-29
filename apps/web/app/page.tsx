import type { Metadata } from "next";
import { OverviewMetrics } from "@/src/features/overview/components/overview-metrics";
import { QuickLinks } from "@/src/features/overview/components/quick-links";
import { SectionHeader } from "@/src/features/shell/components/section-header";
import { SectionTemplate } from "@/src/features/shell/templates/section-template";

export const metadata: Metadata = {
  title: "Resumen · Gestor de finanzas",
};

export default function ResumenPage() {
  return (
    <SectionTemplate
      header={
        <SectionHeader
          title="Resumen"
          description="Vista general de tus finanzas."
          breadcrumbItems={[{ label: "Resumen" }]}
        />
      }
      content={
        <div className="grid gap-[var(--ui-space-10)]">
          <OverviewMetrics />
          <QuickLinks />
        </div>
      }
    />
  );
}
