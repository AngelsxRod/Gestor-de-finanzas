import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { TransactionsTable } from "./transactions-table";

const account = {
  id: "a7536616-4dd5-45c9-8a95-b94e21936a96",
  name: "Cuenta corriente",
  type: "checking" as const,
  currency: "GTQ",
  openingBalance: "0.0000",
  isActive: true,
  createdAt: "2026-08-29T12:00:00.000Z",
  updatedAt: "2026-08-29T12:00:00.000Z",
};

const savingsAccount = {
  ...account,
  id: "a7536616-4dd5-45c9-8a95-b94e21936a97",
  name: "Cuenta de ahorro",
};

const category = {
  id: "c9f2a1a0-4e9a-4a2e-9b0a-6a5b4d3c2f10",
  name: "Salario",
  type: "income" as const,
  isActive: true,
  createdAt: "2026-08-29T12:00:00.000Z",
  updatedAt: "2026-08-29T12:00:00.000Z",
};

const accountsById = new Map([
  [account.id, account],
  [savingsAccount.id, savingsAccount],
]);
const categoriesById = new Map([[category.id, category]]);

const incomeTransaction = {
  id: "f1700f2a-f1c2-4fc2-8432-ffb13bb24e6e",
  type: "income" as const,
  amount: "1250.5000",
  currency: "GTQ",
  accountId: account.id,
  transferAccountId: null,
  categoryId: category.id,
  occurredAt: "2026-08-15T10:30:00.000Z",
  notes: "Pago mensual",
  isActive: true,
  createdAt: "2026-08-15T10:30:00.000Z",
  updatedAt: "2026-08-15T10:30:00.000Z",
};

const transferTransaction = {
  ...incomeTransaction,
  id: "f1700f2a-f1c2-4fc2-8432-ffb13bb24e6f",
  type: "transfer" as const,
  transferAccountId: savingsAccount.id,
  categoryId: null,
  occurredAt: "2026-08-20T09:00:00.000Z",
  notes: null,
};

const inactiveTransaction = {
  ...incomeTransaction,
  id: "f1700f2a-f1c2-4fc2-8432-ffb13bb24e70",
  isActive: false,
};

const meta = {
  title: "Organisms/Transactions table",
  component: TransactionsTable,
} satisfies Meta<typeof TransactionsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = { args: { state: "loading" } };
export const Empty: Story = {
  args: {
    state: "success",
    transactions: [],
    accountsById,
    categoriesById,
    onEdit: fn(),
    onToggleActive: fn(),
  },
};
export const WithTransactions: Story = {
  args: {
    state: "success",
    transactions: [transferTransaction, incomeTransaction, inactiveTransaction],
    accountsById,
    categoriesById,
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
    transactions: [incomeTransaction],
    accountsById,
    categoriesById,
    onEdit: fn(),
    onToggleActive: fn(),
  },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Editar" }),
    );
    if (args.state === "success") {
      await expect(args.onEdit).toHaveBeenCalledWith(incomeTransaction);
    }
  },
};
export const ToggleActiveInteraction: Story = {
  args: {
    state: "success",
    transactions: [incomeTransaction],
    accountsById,
    categoriesById,
    onEdit: fn(),
    onToggleActive: fn(),
  },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Desactivar" }),
    );
    if (args.state === "success") {
      await expect(args.onToggleActive).toHaveBeenCalledWith(
        incomeTransaction,
      );
    }
  },
};
