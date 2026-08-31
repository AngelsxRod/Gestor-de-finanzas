import type { ReactNode } from "react";
import { ShellProvider } from "../context/shell-context";
import { MainRegion } from "./main-region";
import { Sidebar } from "./sidebar";

export type AppShellProps = {
  children: ReactNode;
  sidebarFooter?: ReactNode;
};

export function AppShell({ children, sidebarFooter }: AppShellProps) {
  return (
    <ShellProvider>
      <div className="flex min-h-screen">
        <Sidebar footer={sidebarFooter} />
        <MainRegion>{children}</MainRegion>
      </div>
    </ShellProvider>
  );
}
