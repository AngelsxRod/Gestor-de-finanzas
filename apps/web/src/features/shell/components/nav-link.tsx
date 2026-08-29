"use client";

import { Badge } from "@gestor-finanzas/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "../config/nav-items";

export type NavLinkProps = {
  item: NavItem;
  onNavigate?: () => void;
};

export function NavLink({ item, onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={`flex items-center justify-between gap-[var(--ui-space-2)] rounded-[var(--ui-radius-control)] px-[var(--ui-space-3)] py-[var(--ui-space-2)] text-[length:var(--ui-font-size-small)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-color-focus)] ${
        isActive
          ? "bg-[var(--ui-color-primary)] text-[var(--ui-color-on-primary)]"
          : "text-[var(--ui-color-text)] hover:bg-[var(--ui-color-surface-subtle)]"
      }`}
    >
      <span className={isActive ? "font-semibold" : "font-medium"}>
        {item.label}
      </span>
      {item.status === "coming-soon" ? (
        <Badge tone="neutral">Próximamente</Badge>
      ) : null}
    </Link>
  );
}
