"use client";

import { Text } from "@gestor-finanzas/ui";
import { useEffect, useRef, type ReactNode } from "react";
import { NAV_ITEMS } from "../config/nav-items";
import { useShell } from "../context/shell-context";
import { NavLink } from "./nav-link";

const availableItems = NAV_ITEMS.filter((item) => item.status === "available");
const comingSoonItems = NAV_ITEMS.filter(
  (item) => item.status === "coming-soon",
);

export type SidebarProps = {
  footer?: ReactNode;
};

export function Sidebar({ footer }: SidebarProps = {}) {
  const { isMobileNavOpen, closeMobileNav } = useShell();
  const navRef = useRef<HTMLElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isMobileNavOpen) {
      previouslyFocusedElementRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      navRef.current?.querySelector<HTMLElement>("a")?.focus();
    } else {
      previouslyFocusedElementRef.current?.focus();
    }
  }, [isMobileNavOpen]);

  useEffect(() => {
    if (!isMobileNavOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeMobileNav();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileNavOpen, closeMobileNav]);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={closeMobileNav}
        className={`fixed inset-0 z-20 bg-black/60 transition-opacity lg:hidden ${
          isMobileNavOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      <nav
        ref={navRef}
        id="app-sidebar-nav"
        aria-label="Navegación principal"
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-[var(--ui-color-surface)] transition-transform duration-200 lg:static lg:z-auto lg:visible lg:translate-x-0 ${
          isMobileNavOpen
            ? "visible translate-x-0"
            : "invisible -translate-x-full"
        }`}
      >
        <div className="border-b border-[var(--ui-color-border)]/60 px-[var(--ui-space-6)] py-[var(--ui-space-5)]">
          <Text
            as="span"
            variant="lead"
            className="font-semibold tracking-[var(--ui-letter-spacing-tight)] text-[var(--ui-color-text)]"
          >
            Gestor de finanzas
          </Text>
        </div>

        <div className="flex flex-1 flex-col gap-[var(--ui-space-6)] overflow-y-auto p-[var(--ui-space-4)]">
          <ul className="grid gap-[var(--ui-space-1)]">
            {availableItems.map((item) => (
              <li key={item.href}>
                <NavLink item={item} onNavigate={closeMobileNav} />
              </li>
            ))}
          </ul>

          <div className="grid gap-[var(--ui-space-1)]">
            <Text
              as="span"
              variant="caption"
              tone="muted"
              className="px-[var(--ui-space-3)] font-medium uppercase tracking-[var(--ui-letter-spacing-eyebrow)]"
            >
              Próximamente
            </Text>
            <ul className="grid gap-[var(--ui-space-1)]">
              {comingSoonItems.map((item) => (
                <li key={item.href}>
                  <NavLink item={item} onNavigate={closeMobileNav} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {footer ? (
          <div className="border-t border-[var(--ui-color-border)]/60 p-[var(--ui-space-4)]">
            {footer}
          </div>
        ) : null}
      </nav>
    </>
  );
}
