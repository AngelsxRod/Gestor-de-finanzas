import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { TransactionForm } from "./transaction-form";

const checkingAccount = {
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
  ...checkingAccount,
  id: "a7536616-4dd5-45c9-8a95-b94e21936a97",
  name: "Cuenta de ahorro",
  type: "savings" as const,
};

const salaryCategory = {
  id: "c9f2a1a0-4e9a-4a2e-9b0a-6a5b4d3c2f10",
  name: "Salario",
  type: "income" as const,
  isActive: true,
  createdAt: "2026-08-29T12:00:00.000Z",
  updatedAt: "2026-08-29T12:00:00.000Z",
};

const groceriesCategory = {
  ...salaryCategory,
  id: "c9f2a1a0-4e9a-4a2e-9b0a-6a5b4d3c2f11",
  name: "Alimentación",
  type: "expense" as const,
};

const meta = {
  title: "Organisms/Transaction form",
  component: TransactionForm,
  args: {
    accounts: [checkingAccount, savingsAccount],
    categories: [salaryCategory, groceriesCategory],
    isSubmitting: false,
    onSubmit: fn().mockResolvedValue(undefined),
  },
} satisfies Meta<typeof TransactionForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Submitting: Story = { args: { isSubmitting: true } };
export const WithError: Story = {
  args: { errorMessage: "La cuenta está inactiva." },
};
export const Success: Story = {
  args: { successMessage: "El movimiento se guardó correctamente." },
};
export const Edit: Story = {
  args: {
    mode: "edit",
    initialValues: {
      type: "expense",
      amount: "200.0000",
      accountId: checkingAccount.id,
      categoryId: groceriesCategory.id,
      transferAccountId: "",
      occurredAt: "2026-08-05T12:00",
      notes: "Compra semanal",
    },
  },
};

export const ValidationAndExpenseSubmit: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Guardar movimiento" }),
    );
    await expect((await canvas.findAllByRole("alert")).length).toBeGreaterThan(
      1,
    );

    await userEvent.type(canvas.getByLabelText(/Monto/), "150.5");
    await userEvent.selectOptions(canvas.getByLabelText(/^Cuenta \*/), [
      checkingAccount.id,
    ]);
    await userEvent.selectOptions(canvas.getByLabelText(/^Categoría \*/), [
      groceriesCategory.id,
    ]);
    await userEvent.click(
      canvas.getByRole("button", { name: "Guardar movimiento" }),
    );

    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "expense",
        amount: "150.5000",
        accountId: checkingAccount.id,
        categoryId: groceriesCategory.id,
      }),
    );
  },
};

export const TransferSwitchesFields: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.selectOptions(canvas.getByLabelText(/^Tipo \*/), [
      "transfer",
    ]);

    await expect(
      canvas.queryByLabelText(/^Categoría \*/),
    ).not.toBeInTheDocument();
    await expect(canvas.getByLabelText(/^Cuenta destino \*/)).toBeVisible();
  },
};
