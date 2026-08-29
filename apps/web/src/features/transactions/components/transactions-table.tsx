"use client";

import type {
  Account,
  Category,
  Transaction,
  TransactionType,
} from "@gestor-finanzas/contracts";
import {
  Badge,
  type BadgeTone,
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
  type TextTone,
} from "@gestor-finanzas/ui";

const transactionTypeLabels: Record<TransactionType, string> = {
  income: "Ingreso",
  expense: "Gasto",
  transfer: "Transferencia",
};

const transactionTypeBadgeTones: Record<TransactionType, BadgeTone> = {
  income: "success",
  expense: "neutral",
  transfer: "info",
};

const transactionAmountTones: Record<TransactionType, TextTone> = {
  income: "success",
  expense: "danger",
  transfer: "default",
};

const dateTimeFormatter = new Intl.DateTimeFormat("es-GT", {
  dateStyle: "medium",
  timeStyle: "short",
});

function accountLabel(
  accountId: string,
  accountsById: Map<string, Account>,
): string {
  return accountsById.get(accountId)?.name ?? "Cuenta eliminada";
}

function movementLabel(
  transaction: Transaction,
  accountsById: Map<string, Account>,
  categoriesById: Map<string, Category>,
): string {
  if (transaction.type === "transfer") {
    const destination = transaction.transferAccountId
      ? accountLabel(transaction.transferAccountId, accountsById)
      : "";

    return `→ ${destination}`;
  }

  return transaction.categoryId
    ? (categoriesById.get(transaction.categoryId)?.name ?? "Categoría eliminada")
    : "";
}

export type TransactionsTableProps =
  | { state: "loading" }
  | { state: "error"; isRetrying: boolean; onRetry: () => void }
  | {
      state: "success";
      transactions: Transaction[];
      accountsById: Map<string, Account>;
      categoriesById: Map<string, Category>;
    };

export function TransactionsTable(props: TransactionsTableProps) {
  return (
    <Panel aria-labelledby="transactions-table-title" variant="flat">
      <PanelHeader className="grid gap-[var(--ui-space-2)]">
        <Heading id="transactions-table-title" level={2} variant="section">
          Movimientos
        </Heading>
        <Text variant="small" tone="muted">
          Los movimientos se muestran por fecha, del más reciente al más
          antiguo.
        </Text>
      </PanelHeader>

      <PanelContent aria-live="polite">
        {props.state === "loading" ? (
          <Text role="status" variant="small" tone="muted">
            Cargando movimientos…
          </Text>
        ) : null}

        {props.state === "error" ? (
          <div className="grid gap-[var(--ui-space-4)]">
            <Text role="alert" variant="small" tone="danger">
              No fue posible cargar los movimientos.
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

        {props.state === "success" && props.transactions.length === 0 ? (
          <Text role="status" variant="small" tone="muted">
            Aún no tienes movimientos. Crea el primero con el botón “Nuevo
            movimiento”.
          </Text>
        ) : null}

        {props.state === "success" && props.transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <Table aria-label="Movimientos">
              <TableHeader>
                <TableRow>
                  <TableCell as="th">Fecha</TableCell>
                  <TableCell as="th">Tipo</TableCell>
                  <TableCell as="th">Cuenta</TableCell>
                  <TableCell as="th">Categoría / destino</TableCell>
                  <TableCell as="th">Monto</TableCell>
                  <TableCell as="th">Notas</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {props.transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {dateTimeFormatter.format(
                        new Date(transaction.occurredAt),
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge tone={transactionTypeBadgeTones[transaction.type]}>
                        {transactionTypeLabels[transaction.type]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {accountLabel(transaction.accountId, props.accountsById)}
                    </TableCell>
                    <TableCell>
                      {movementLabel(
                        transaction,
                        props.accountsById,
                        props.categoriesById,
                      )}
                    </TableCell>
                    <TableCell>
                      <Text
                        as="span"
                        variant="small"
                        tone={transactionAmountTones[transaction.type]}
                      >
                        {transaction.currency} {transaction.amount}
                      </Text>
                    </TableCell>
                    <TableCell>{transaction.notes ?? ""}</TableCell>
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
