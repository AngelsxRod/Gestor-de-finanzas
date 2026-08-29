import { Badge } from "@gestor-finanzas/ui";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Atoms/Badge",
  component: Badge,
  args: { children: "Próximamente" },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};
export const Success: Story = {
  args: { children: "Activa", tone: "success" },
};
export const Info: Story = { args: { children: "Nuevo", tone: "info" } };
