import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { CategoryForm } from "./category-form";

const meta = {
  title: "Organisms/Category form",
  component: CategoryForm,
  args: {
    isSubmitting: false,
    onSubmit: fn().mockResolvedValue(undefined),
  },
} satisfies Meta<typeof CategoryForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Submitting: Story = { args: { isSubmitting: true } };
export const DuplicateName: Story = {
  args: {
    errorMessage: "Ya existe una categoría con ese nombre y tipo.",
    onSubmit: fn(async () => {
      throw new Error("conflicto");
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const name = canvas.getByLabelText(/Nombre/);

    await userEvent.type(name, "Alimentación");
    await userEvent.click(
      canvas.getByRole("button", { name: "Guardar categoría" }),
    );

    await expect(name).toHaveValue("Alimentación");
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Ya existe una categoría con ese nombre y tipo.",
    );
  },
};
export const Success: Story = {
  args: { successMessage: "La categoría se guardó correctamente." },
};
export const Edit: Story = {
  args: {
    mode: "edit",
    initialValues: { name: "Alimentación", type: "expense" },
  },
};
export const ValidationAndCreation: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const name = canvas.getByLabelText(/Nombre/);

    await userEvent.click(
      canvas.getByRole("button", { name: "Guardar categoría" }),
    );
    await expect(await canvas.findByRole("alert")).toHaveTextContent(
      "El nombre es obligatorio.",
    );

    await userEvent.type(name, "  Alimentación  ");
    await userEvent.click(
      canvas.getByRole("button", { name: "Guardar categoría" }),
    );
    await expect(args.onSubmit).toHaveBeenCalledWith({
      name: "Alimentación",
      type: "expense",
    });
  },
};
