import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { AccountsTable } from "./accounts-table";

const account = {
  id: "f1700f2a-f1c2-4fc2-8432-ffb13bb24e6e",
  name: "Cuenta principal",
  type: "checking" as const,
  currency: "GTQ",
  openingBalance: "1250.5000",
  isActive: true,
  createdAt: "2026-08-29T12:00:00.000Z",
  updatedAt: "2026-08-29T12:00:00.000Z",
};

const inactiveAccount = {
  ...account,
  id: "a7536616-4dd5-45c9-8a95-b94e21936a96",
  name: "Cuenta cerrada",
  isActive: false,
};

const meta = {
  title: "Organisms/Accounts table",
  component: AccountsTable,
} satisfies Meta<typeof AccountsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = { args: { state: "loading" } };
export const Empty: Story = {
  args: {
    state: "success",
    accounts: [],
    onEdit: fn(),
    onToggleActive: fn(),
  },
};
export const WithAccounts: Story = {
  args: {
    state: "success",
    accounts: [account, inactiveAccount],
    onEdit: fn(),
    onToggleActive: fn(),
  },
};
export const Error: Story = {
  args: { state: "error", isRetrying: false, onRetry: fn() },
};
export const Retrying: Story = {
  args: { state: "error", isRetrying: true, onRetry: fn() },
};
export const EditInteraction: Story = {
  args: {
    state: "success",
    accounts: [account],
    onEdit: fn(),
    onToggleActive: fn(),
  },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Editar" }),
    );
    if (args.state === "success") {
      await expect(args.onEdit).toHaveBeenCalledWith(account);
    }
  },
};
export const ToggleActiveInteraction: Story = {
  args: {
    state: "success",
    accounts: [account],
    onEdit: fn(),
    onToggleActive: fn(),
  },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Desactivar" }),
    );
    if (args.state === "success") {
      await expect(args.onToggleActive).toHaveBeenCalledWith(account);
    }
  },
};
