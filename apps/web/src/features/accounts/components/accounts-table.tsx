"use client";

import type { Account, AccountType } from "@gestor-finanzas/contracts";
import {
  Badge,
  Button,
  Heading,
  Panel,
  PanelContent,
  PanelHeader,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Text,
} from "@gestor-finanzas/ui";

const accountTypeLabels: Record<AccountType, string> = {
  cash: "Efectivo",
  checking: "Cuenta corriente",
  savings: "Ahorro",
  credit: "Crédito",
  investment: "Inversión",
};

export type AccountsTableProps =
  | { state: "loading" }
  | { state: "error"; isRetrying: boolean; onRetry: () => void }
  | {
      state: "success";
      accounts: Account[];
      onEdit: (account: Account) => void;
      onToggleActive: (account: Account) => void;
      togglingAccountId?: string;
    };

export function AccountsTable(props: AccountsTableProps) {
  return (
    <Panel aria-labelledby="accounts-table-title" variant="flat">
      <PanelHeader className="grid gap-[var(--ui-space-2)]">
        <Heading id="accounts-table-title" level={2} variant="section">
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
            Aún no tienes cuentas. Crea la primera con el botón “Nueva
            cuenta”.
          </Text>
        ) : null}

        {props.state === "success" && props.accounts.length > 0 ? (
          <div className="overflow-x-auto">
            <Table aria-label="Tus cuentas">
              <TableHeader>
                <TableRow>
                  <TableCell as="th">Nombre</TableCell>
                  <TableCell as="th">Tipo</TableCell>
                  <TableCell as="th">Moneda</TableCell>
                  <TableCell as="th">Saldo</TableCell>
                  <TableCell as="th">Estado</TableCell>
                  <TableCell as="th">
                    <span className="sr-only">Acciones</span>
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {props.accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>{account.name}</TableCell>
                    <TableCell>{accountTypeLabels[account.type]}</TableCell>
                    <TableCell>{account.currency}</TableCell>
                    <TableCell>{account.openingBalance}</TableCell>
                    <TableCell>
                      <Badge tone={account.isActive ? "success" : "neutral"}>
                        {account.isActive ? "Activa" : "Inactiva"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-[var(--ui-space-2)]">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => props.onEdit(account)}
                        >
                          Editar
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={props.togglingAccountId === account.id}
                          onClick={() => props.onToggleActive(account)}
                        >
                          {props.togglingAccountId === account.id
                            ? "Guardando…"
                            : account.isActive
                              ? "Desactivar"
                              : "Reactivar"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null}
      </PanelContent>
    </Panel>
  );
}
