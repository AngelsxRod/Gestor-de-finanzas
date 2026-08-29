import { Button, EmptyState } from "@gestor-finanzas/ui";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Molecules/EmptyState",
  component: EmptyState,
  args: {
    level: 2,
    title: "Movimientos",
    description:
      "Todavía no puedes registrar movimientos. Esta sección estará disponible próximamente.",
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithAction: Story = {
  args: {
    action: <Button variant="secondary">Volver al resumen</Button>,
  },
};
