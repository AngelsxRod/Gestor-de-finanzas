import { Text } from "@gestor-finanzas/ui";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AppShell } from "./app-shell";
import { SectionHeader } from "./section-header";

function AppShellPreview() {
  return (
    <AppShell>
      <SectionHeader
        title="Resumen"
        description="Vista general de tus finanzas"
        breadcrumbItems={[{ label: "Resumen" }]}
      />
      <div className="px-6 py-10 sm:px-10">
        <Text tone="muted">Contenido de la sección.</Text>
      </div>
    </AppShell>
  );
}

const meta = {
  title: "Organisms/AppShell",
  component: AppShellPreview,
} satisfies Meta<typeof AppShellPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const LightTheme: Story = { globals: { theme: "light" } };
export const DarkTheme: Story = { globals: { theme: "dark" } };
