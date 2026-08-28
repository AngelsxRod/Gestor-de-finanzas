"use client";

import {
  Button,
  Heading,
  Panel,
  PanelContent,
  PanelHeader,
  Text,
} from "@gestor-finanzas/ui";

type HealthStatusPanelProps =
  | { state: "loading" }
  | { state: "success"; service: string }
  | {
      state: "error";
      isRetrying: boolean;
      onRetry: () => void;
    };

export function HealthStatusPanel(props: HealthStatusPanelProps) {
  return (
    <Panel aria-labelledby="health-panel-title">
      <PanelHeader className="grid gap-[var(--ui-space-2)]">
        <Heading id="health-panel-title" level={2} variant="section">
          Estado de la API
        </Heading>
        <Text variant="small" tone="muted">
          React Query consulta Axios y valida la respuesta con el contrato Zod
          compartido.
        </Text>
      </PanelHeader>

      <PanelContent aria-live="polite">
        {props.state === "loading" ? (
          <Text role="status" variant="small" tone="muted">
            Comprobando conexión…
          </Text>
        ) : null}

        {props.state === "error" ? (
          <div className="grid gap-[var(--ui-space-4)]">
            <Text role="alert" variant="small" tone="danger">
              No fue posible conectar con la API.
            </Text>
            <div>
              <Button
                variant="secondary"
                onClick={props.onRetry}
                disabled={props.isRetrying}
              >
                {props.isRetrying ? "Reintentando…" : "Reintentar"}
              </Button>
            </div>
          </div>
        ) : null}

        {props.state === "success" ? (
          <div className="flex items-center gap-[var(--ui-space-3)]">
            <span
              className="size-2.5 rounded-full bg-[var(--ui-color-success-indicator)]"
              aria-hidden="true"
            />
            <Text as="span" variant="small" tone="success" className="font-medium">
              {props.service} está disponible
            </Text>
          </div>
        ) : null}
      </PanelContent>
    </Panel>
  );
}

export type { HealthStatusPanelProps };
