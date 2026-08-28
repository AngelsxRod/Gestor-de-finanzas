import { ContentHeader, Text } from "@gestor-finanzas/ui";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DemoFormPanel } from "../components/demo-form-panel";
import { ArchitectureDemoTemplate } from "./architecture-demo-template";

const meta = {
  title: "Templates/Architecture demo",
  component: ArchitectureDemoTemplate,
  args: {
    intro: <ContentHeader eyebrow="Gestor de finanzas" level={1} variant="display" title="Arquitectura preparada para crecer" description="El template distribuye regiones; no conoce consultas ni formularios." />,
    status: <Text>Región del estado de la API</Text>,
    form: <DemoFormPanel />,
  },
} satisfies Meta<typeof ArchitectureDemoTemplate>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
