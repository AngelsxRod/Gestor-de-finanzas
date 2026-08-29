import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Breadcrumb } from "./breadcrumb";

const meta = {
  title: "Molecules/Breadcrumb",
  component: Breadcrumb,
  args: {
    items: [{ label: "Resumen", href: "/" }, { label: "Cuentas" }],
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
