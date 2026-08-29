import { Badge, Button, MetricCard, Text } from "@gestor-finanzas/ui";
import type { ReactNode } from "react";

export type MetricState =
  | { state: "loading" }
  | { state: "error"; isRetrying: boolean; onRetry: () => void }
  | { state: "success"; count: number };

export type OverviewSummaryProps = {
  accounts: MetricState;
  categories: MetricState;
};

function renderValue(metric: MetricState): ReactNode {
  if (metric.state === "loading") return "…";
  if (metric.state === "error") return "—";
  return metric.count;
}

function renderDescription(metric: MetricState, successLabel: string): ReactNode {
  if (metric.state === "loading") return "Cargando…";
  if (metric.state === "error") {
    return (
      <Text as="span" variant="caption" tone="danger" role="alert">
        No se pudo cargar.
      </Text>
    );
  }
  return successLabel;
}

function renderAction(metric: MetricState): ReactNode {
  if (metric.state !== "error") return undefined;
  return (
    <Button
      type="button"
      variant="secondary"
      disabled={metric.isRetrying}
      onClick={metric.onRetry}
      className="min-h-0 px-[var(--ui-space-2)] py-[var(--ui-space-1)] text-[length:var(--ui-font-size-caption)]"
    >
      {metric.isRetrying ? "Reintentando…" : "Reintentar"}
    </Button>
  );
}

export function OverviewSummary({ accounts, categories }: OverviewSummaryProps) {
  return (
    <section
      aria-label="Resumen financiero"
      aria-live="polite"
      className="grid gap-[var(--ui-space-6)] sm:grid-cols-2 lg:grid-cols-4"
    >
      <MetricCard
        label="Cuentas"
        value={renderValue(accounts)}
        description={renderDescription(accounts, "Cuentas registradas")}
        action={renderAction(accounts)}
      />
      <MetricCard
        label="Categorías"
        value={renderValue(categories)}
        description={renderDescription(categories, "Categorías registradas")}
        action={renderAction(categories)}
      />
      <MetricCard
        label="Movimientos"
        value={<Badge tone="neutral">Próximamente</Badge>}
        description="Aún no disponible"
      />
      <MetricCard
        label="Presupuestos"
        value={<Badge tone="neutral">Próximamente</Badge>}
        description="Aún no disponible"
      />
    </section>
  );
}
