"use client";

import type { BudgetSummary, Category } from "@gestor-finanzas/contracts";
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

function categoryLabel(
  categoryId: string,
  categoriesById: Map<string, Category>,
): string {
  return categoriesById.get(categoryId)?.name ?? "Categoría eliminada";
}

function isOverBudget(remaining: string): boolean {
  return remaining.startsWith("-");
}

export type BudgetsTableProps =
  | { state: "loading" }
  | { state: "error"; isRetrying: boolean; onRetry: () => void }
  | {
      state: "success";
      budgets: BudgetSummary[];
      categoriesById: Map<string, Category>;
      onEdit: (budget: BudgetSummary) => void;
      onToggleActive: (budget: BudgetSummary) => void;
      togglingBudgetId?: string;
    };

export function BudgetsTable(props: BudgetsTableProps) {
  return (
    <Panel aria-labelledby="budgets-table-title" variant="flat">
      <PanelHeader className="grid gap-[var(--ui-space-2)]">
        <Heading id="budgets-table-title" level={2} variant="section">
          Presupuestos del mes
        </Heading>
        <Text variant="small" tone="muted">
          Límite y gasto real por categoría en el mes seleccionado.
        </Text>
      </PanelHeader>

      <PanelContent aria-live="polite">
        {props.state === "loading" ? (
          <Text role="status" variant="small" tone="muted">
            Cargando presupuestos…
          </Text>
        ) : null}

        {props.state === "error" ? (
          <div className="grid gap-[var(--ui-space-4)]">
            <Text role="alert" variant="small" tone="danger">
              No fue posible cargar los presupuestos.
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

        {props.state === "success" && props.budgets.length === 0 ? (
          <Text role="status" variant="small" tone="muted">
            Todavía no tienes presupuestos para este mes. Crea el primero con
            el botón “Nuevo presupuesto”.
          </Text>
        ) : null}

        {props.state === "success" && props.budgets.length > 0 ? (
          <div className="overflow-x-auto">
            <Table aria-label="Presupuestos del mes">
              <TableHeader>
                <TableRow>
                  <TableCell as="th">Categoría</TableCell>
                  <TableCell as="th">Límite</TableCell>
                  <TableCell as="th">Gastado</TableCell>
                  <TableCell as="th">Restante</TableCell>
                  <TableCell as="th">Estado</TableCell>
                  <TableCell as="th">
                    <span className="sr-only">Acciones</span>
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {props.budgets.map((budget) => (
                  <TableRow key={budget.id}>
                    <TableCell>
                      {categoryLabel(budget.categoryId, props.categoriesById)}
                    </TableCell>
                    <TableCell>
                      {budget.currency} {budget.limitAmount}
                    </TableCell>
                    <TableCell>
                      {budget.currency} {budget.spent}
                    </TableCell>
                    <TableCell>
                      <Text
                        as="span"
                        variant="small"
                        tone={
                          isOverBudget(budget.remaining) ? "danger" : "default"
                        }
                      >
                        {budget.currency} {budget.remaining}
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Badge tone={budget.isActive ? "success" : "neutral"}>
                        {budget.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-[var(--ui-space-2)]">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => props.onEdit(budget)}
                        >
                          Editar
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={props.togglingBudgetId === budget.id}
                          onClick={() => props.onToggleActive(budget)}
                        >
                          {props.togglingBudgetId === budget.id
                            ? "Guardando…"
                            : budget.isActive
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
