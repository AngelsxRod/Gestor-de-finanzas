import { SidebarFooter } from "@/src/features/auth/components/sidebar-footer";
import { AppShell } from "@/src/features/shell/components/app-shell";

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return <AppShell sidebarFooter={<SidebarFooter />}>{children}</AppShell>;
}
