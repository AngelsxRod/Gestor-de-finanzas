"use client";

import type { ReactNode } from "react";
import { useShell } from "../context/shell-context";

export function MainRegion({ children }: { children: ReactNode }) {
  const { isMobileNavOpen } = useShell();

  return (
    <div
      className="flex min-w-0 flex-1 flex-col"
      inert={isMobileNavOpen || undefined}
    >
      {children}
    </div>
  );
}
