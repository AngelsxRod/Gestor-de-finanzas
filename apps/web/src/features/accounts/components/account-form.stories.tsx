import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { AccountForm } from "./account-form";

const meta = {
  title: "Organisms/Account form",
  component: AccountForm,
  args: {
    isSubmitting: false,
    onSubmit: fn().mockResolvedValue(undefined),
  },
} satisfies Meta<typeof AccountForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Submitting: Story = { args: { isSubmitting: true } };
export const DuplicateName: Story = {
  args: { errorMessage: "Ya existe una cuenta con ese nombre." },
};
export const Success: Story = {
  args: { successMessage: "La cuenta se guardó correctamente." },
};
export const ValidationAndSubmit: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const name = canvas.getByLabelText(/Nombre/);
    const currency = canvas.getByLabelText(/Moneda/);

    await userEvent.clear(name);
    await userEvent.clear(currency);
    await userEvent.click(canvas.getByRole("button", { name: "Guardar cuenta" }));
    await expect(await canvas.findAllByRole("alert")).toHaveLength(2);

    await userEvent.type(name, "Cuenta principal");
    await userEvent.type(currency, "usd");
    await userEvent.click(canvas.getByRole("button", { name: "Guardar cuenta" }));

    await expect(args.onSubmit).toHaveBeenCalledWith({
      name: "Cuenta principal",
      type: "cash",
      currency: "USD",
      openingBalance: "0.0000",
    });
  },
};
