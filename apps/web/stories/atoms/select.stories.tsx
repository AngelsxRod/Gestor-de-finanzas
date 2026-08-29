import { Select } from "@gestor-finanzas/ui";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Atoms/Select",
  component: Select,
  args: {
    "aria-label": "Tipo de cuenta",
    children: (
      <>
        <option value="cash">Efectivo</option>
        <option value="checking">Cuenta corriente</option>
        <option value="savings">Ahorro</option>
      </>
    ),
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
