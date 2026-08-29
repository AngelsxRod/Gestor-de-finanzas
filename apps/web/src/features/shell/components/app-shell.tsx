import type { ReactNode } from "react";
import { ShellProvider } from "../context/shell-context";
import { MainRegion } from "./main-region";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <ShellProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <MainRegion>{children}</MainRegion>
      </div>
    </ShellProvider>
  );
}
