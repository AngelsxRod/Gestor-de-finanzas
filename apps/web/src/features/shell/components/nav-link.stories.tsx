import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NavLink } from "./nav-link";

const meta = {
  title: "Organisms/NavLink",
  component: NavLink,
  args: {
    item: {
      href: "/cuentas",
      label: "Cuentas",
      description: "Administra tus cuentas",
      status: "available",
    },
  },
} satisfies Meta<typeof NavLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inactive: Story = {
  parameters: { nextjs: { navigation: { pathname: "/" } } },
};

export const Active: Story = {
  parameters: { nextjs: { navigation: { pathname: "/cuentas" } } },
};

export const ComingSoon: Story = {
  args: {
    item: {
      href: "/movimientos",
      label: "Movimientos",
      description: "Registro de ingresos y gastos",
      status: "coming-soon",
    },
  },
  parameters: { nextjs: { navigation: { pathname: "/" } } },
};
