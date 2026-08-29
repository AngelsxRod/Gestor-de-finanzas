"use client";

import type { Category, CategoryType } from "@gestor-finanzas/contracts";
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

const categoryTypeLabels: Record<CategoryType, string> = {
  expense: "Gasto",
  income: "Ingreso",
};

export type CategoriesTableProps =
  | { state: "loading" }
  | { state: "error"; isRetrying: boolean; onRetry: () => void }
  | {
      state: "success";
      categories: Category[];
      onEdit: (category: Category) => void;
      onToggleActive: (category: Category) => void;
      togglingCategoryId?: string;
    };

export function CategoriesTable(props: CategoriesTableProps) {
  return (
    <Panel aria-labelledby="categories-table-title" variant="flat">
      <PanelHeader className="grid gap-[var(--ui-space-2)]">
        <Heading id="categories-table-title" level={2} variant="section">
          Tus categorías
        </Heading>
        <Text variant="small" tone="muted">
          Ordenadas por tipo y nombre.
        </Text>
      </PanelHeader>

      <PanelContent aria-live="polite">
        {props.state === "loading" ? (
          <Text role="status" variant="small" tone="muted">
            Cargando categorías…
          </Text>
        ) : null}

        {props.state === "error" ? (
          <div className="grid gap-[var(--ui-space-4)]">
            <Text role="alert" variant="small" tone="danger">
              No fue posible cargar las categorías.
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

        {props.state === "success" && props.categories.length === 0 ? (
          <Text role="status" variant="small" tone="muted">
            Aún no tienes categorías. Crea la primera con el botón “Nueva
            categoría”.
          </Text>
        ) : null}

        {props.state === "success" && props.categories.length > 0 ? (
          <div className="overflow-x-auto">
            <Table aria-label="Tus categorías">
              <TableHeader>
                <TableRow>
                  <TableCell as="th">Nombre</TableCell>
                  <TableCell as="th">Tipo</TableCell>
                  <TableCell as="th">Estado</TableCell>
                  <TableCell as="th">
                    <span className="sr-only">Acciones</span>
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {props.categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>
                      <Badge tone="info">
                        {categoryTypeLabels[category.type]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge tone={category.isActive ? "success" : "neutral"}>
                        {category.isActive ? "Activa" : "Inactiva"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-[var(--ui-space-2)]">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => props.onEdit(category)}
                        >
                          Editar
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={props.togglingCategoryId === category.id}
                          onClick={() => props.onToggleActive(category)}
                        >
                          {props.togglingCategoryId === category.id
                            ? "Guardando…"
                            : category.isActive
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
