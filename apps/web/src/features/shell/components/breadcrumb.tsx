import { Text } from "@gestor-finanzas/ui";
import Link from "next/link";
import type { NavHref } from "../config/nav-items";

export type BreadcrumbItem = {
  href?: NavHref;
  label: string;
};

export type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Ruta de navegación">
      <ol className="flex flex-wrap items-center gap-[var(--ui-space-2)]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-[var(--ui-space-2)]">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-[length:var(--ui-font-size-small)] text-[var(--ui-color-text-muted)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-color-focus)]"
                >
                  {item.label}
                </Link>
              ) : (
                <Text
                  as="span"
                  variant="small"
                  tone="muted"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </Text>
              )}
              {!isLast ? (
                <span aria-hidden="true" className="text-[var(--ui-color-text-muted)]">
                  /
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
