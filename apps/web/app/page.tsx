import { ContentHeader } from "@gestor-finanzas/ui";
import { DemoFormPanel } from "@/src/features/architecture-demo/components/demo-form-panel";
import { ArchitectureDemoTemplate } from "@/src/features/architecture-demo/templates/architecture-demo-template";
import { HealthStatusPanelContainer } from "@/src/features/health/components/health-status-panel-container";

export default function Home() {
  return (
    <ArchitectureDemoTemplate
      intro={
        <ContentHeader
          eyebrow="Scaffold técnico"
          level={1}
          variant="display"
          title="Gestor de finanzas"
          description="Esta pantalla comprueba los contratos compartidos, la conexión con NestJS y la validación de formularios antes de construir la primera feature financiera."
        />
      }
      status={<HealthStatusPanelContainer />}
      form={<DemoFormPanel />}
    />
  );
}
