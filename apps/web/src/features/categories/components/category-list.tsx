"use client";

import type { Category, CategoryType } from "@gestor-finanzas/contracts";
import {
  Button,
  Heading,
  Panel,
  PanelContent,
  PanelHeader,
  Text,
} from "@gestor-finanzas/ui";

export type CategoryListProps =
  | { state: "loading" }
  | { state: "error"; isRetrying: boolean; onRetry: () => void }
  | { state: "success"; categories: Category[] };

const groups: { type: CategoryType; title: string }[] = [
  { type: "expense", title: "Gastos" },
  { type: "income", title: "Ingresos" },
];

export function CategoryList(props: CategoryListProps) {
  return (
    <Panel aria-labelledby="category-list-title">
      <PanelHeader className="grid gap-[var(--ui-space-2)]">
        <Heading id="category-list-title" level={2} variant="section">
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
            Aún no tienes categorías. Crea la primera con el formulario.
          </Text>
        ) : null}
        {props.state === "success" && props.categories.length > 0 ? (
          <div className="grid gap-[var(--ui-space-6)]">
            {groups.map((group) => {
              const categories = props.categories.filter(
                (category) => category.type === group.type,
              );
              if (categories.length === 0) return null;
              return (
                <section key={group.type} aria-labelledby={`${group.type}-title`}>
                  <Heading
                    id={`${group.type}-title`}
                    level={3}
                    variant="subsection"
                  >
                    {group.title}
                  </Heading>
                  <ul className="mt-[var(--ui-space-3)] grid gap-[var(--ui-space-2)]">
                    {categories.map((category) => (
                      <li
                        key={category.id}
                        className="rounded-[var(--ui-radius-control)] border border-[var(--ui-color-border)] bg-[var(--ui-color-surface-subtle)] px-[var(--ui-space-4)] py-[var(--ui-space-3)]"
                      >
                        <Text>{category.name}</Text>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        ) : null}
      </PanelContent>
    </Panel>
  );
}
