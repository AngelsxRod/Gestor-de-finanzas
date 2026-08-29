"use client";

import { useShell } from "../context/shell-context";

export function MobileMenuButton() {
  const { isMobileNavOpen, toggleMobileNav } = useShell();

  return (
    <button
      type="button"
      onClick={toggleMobileNav}
      aria-expanded={isMobileNavOpen}
      aria-controls="app-sidebar-nav"
      aria-label={
        isMobileNavOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"
      }
      className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--ui-radius-control)] border border-[var(--ui-color-border)] bg-[var(--ui-color-surface)] text-[var(--ui-color-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-color-focus)] lg:hidden"
    >
      <span
        aria-hidden="true"
        className="relative block h-0.5 w-4 bg-current before:absolute before:-top-1.5 before:h-0.5 before:w-4 before:bg-current after:absolute after:top-1.5 after:h-0.5 after:w-4 after:bg-current"
      />
    </button>
  );
}
