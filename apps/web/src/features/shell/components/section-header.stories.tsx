import { Button } from "@gestor-finanzas/ui";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ShellProvider } from "../context/shell-context";
import { SectionHeader, type SectionHeaderProps } from "./section-header";

function SectionHeaderPreview(props: SectionHeaderProps) {
  return (
    <ShellProvider>
      <SectionHeader {...props} />
    </ShellProvider>
  );
}

const meta = {
  title: "Organisms/SectionHeader",
  component: SectionHeaderPreview,
  args: {
    title: "Cuentas",
    description: "Administra dónde guardas tu dinero.",
    breadcrumbItems: [{ label: "Resumen", href: "/" }, { label: "Cuentas" }],
  },
} satisfies Meta<typeof SectionHeaderPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    action: <Button>Nueva cuenta</Button>,
  },
};
