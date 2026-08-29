import { Badge, MetricCard } from "@gestor-finanzas/ui";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Molecules/MetricCard",
  component: MetricCard,
  args: {
    label: "Cuentas",
    value: "5",
    description: "Cuentas registradas",
  },
} satisfies Meta<typeof MetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const ComingSoon: Story = {
  args: {
    label: "Movimientos",
    value: <Badge tone="neutral">Próximamente</Badge>,
    description: "Aún no disponible",
  },
};
