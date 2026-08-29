import { ContentHeader } from "@gestor-finanzas/ui";
import { AccountsDashboard } from "@/src/features/accounts/components/accounts-dashboard";
import { AccountsTemplate } from "@/src/features/accounts/templates/accounts-template";

export default function Home() {
  return (
    <AccountsTemplate
      intro={
        <ContentHeader
          eyebrow="Finanzas personales"
          level={1}
          variant="display"
          title="Organiza tus cuentas"
          description="Registra tus cuentas y conserva un punto de partida claro para los próximos movimientos."
        />
      }
      content={
        <AccountsDashboard />
      }
    />
  );
}
