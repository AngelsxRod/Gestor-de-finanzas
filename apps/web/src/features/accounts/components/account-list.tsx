"use client";

import type { Account, AccountType } from "@gestor-finanzas/contracts";
import {
  Button,
  Heading,
  Panel,
  PanelContent,
  PanelHeader,
  Text,
} from "@gestor-finanzas/ui";

const accountTypeLabels: Record<AccountType, string> = {
  cash: "Efectivo",
  checking: "Cuenta corriente",
  savings: "Ahorro",
  credit: "Crédito",
  investment: "Inversión",
};

export type AccountListProps =
  | { state: "loading" }
  | { state: "error"; isRetrying: boolean; onRetry: () => void }
  | { state: "success"; accounts: Account[] };

export function AccountList(props: AccountListProps) {
  return (
    <Panel aria-labelledby="account-list-title">
      <PanelHeader className="grid gap-[var(--ui-space-2)]">
        <Heading id="account-list-title" level={2} variant="section">
          Tus cuentas
        </Heading>
        <Text variant="small" tone="muted">
          Las cuentas se muestran en un orden estable por nombre.
        </Text>
      </PanelHeader>

      <PanelContent aria-live="polite">
        {props.state === "loading" ? (
          <Text role="status" variant="small" tone="muted">
            Cargando cuentas…
          </Text>
        ) : null}

        {props.state === "error" ? (
          <div className="grid gap-[var(--ui-space-4)]">
            <Text role="alert" variant="small" tone="danger">
              No fue posible cargar las cuentas.
            </Text>
            <div>
              <Button
                variant="secondary"
                disabled={props.isRetrying}
                onClick={props.onRetry}
              >
                {props.isRetrying ? "Reintentando…" : "Reintentar"}
              </Button>
            </div>
          </div>
        ) : null}

        {props.state === "success" && props.accounts.length === 0 ? (
          <Text role="status" variant="small" tone="muted">
            Aún no tienes cuentas. Crea la primera con el formulario.
          </Text>
        ) : null}

        {props.state === "success" && props.accounts.length > 0 ? (
          <ul className="grid gap-[var(--ui-space-3)]">
            {props.accounts.map((account) => (
              <li
                key={account.id}
                className="rounded-[var(--ui-radius-control)] border border-[var(--ui-color-border)] bg-[var(--ui-color-surface-subtle)] p-[var(--ui-space-4)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-[var(--ui-space-3)]">
                  <div>
                    <Heading level={3} variant="subsection">
                      {account.name}
                    </Heading>
                    <Text variant="caption" tone="muted">
                      {accountTypeLabels[account.type]}
                    </Text>
                  </div>
                  <Text as="span" variant="small" className="font-medium">
                    {account.openingBalance} {account.currency}
                  </Text>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </PanelContent>
    </Panel>
  );
}
