"use client";

import { Button, Text } from "@gestor-finanzas/ui";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "../hooks/use-logout-mutation";
import { useSessionQuery } from "../hooks/use-session-query";

export function SidebarFooter() {
  const router = useRouter();
  const sessionQuery = useSessionQuery();
  const logoutMutation = useLogoutMutation();

  async function handleLogout() {
    await logoutMutation.mutateAsync();
    router.replace("/login");
  }

  return (
    <div className="grid gap-[var(--ui-space-2)]">
      {sessionQuery.isSuccess ? (
        <Text variant="caption" tone="muted">
          {sessionQuery.data.username}
        </Text>
      ) : null}
      <Button
        type="button"
        variant="secondary"
        disabled={logoutMutation.isPending}
        onClick={() => void handleLogout()}
      >
        {logoutMutation.isPending ? "Cerrando sesión…" : "Cerrar sesión"}
      </Button>
    </div>
  );
}
