import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { LoginForm } from "./login-form";

const meta = {
  title: "Organisms/Login form",
  component: LoginForm,
  args: {
    isSubmitting: false,
    onSubmit: fn().mockResolvedValue(undefined),
  },
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Submitting: Story = { args: { isSubmitting: true } };
export const InvalidCredentials: Story = {
  args: {
    errorMessage: "Usuario o contraseña incorrectos.",
    onSubmit: fn(async () => {
      throw new Error("credenciales inválidas");
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText(/Usuario/), "admin");
    await userEvent.type(canvas.getByLabelText(/Contraseña/), "wrong");
    await userEvent.click(
      canvas.getByRole("button", { name: "Iniciar sesión" }),
    );

    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Usuario o contraseña incorrectos.",
    );
  },
};

export const ValidationAndSubmit: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Iniciar sesión" }),
    );
    await expect(
      (await canvas.findAllByRole("alert")).length,
    ).toBeGreaterThan(0);

    await userEvent.type(canvas.getByLabelText(/Usuario/), "admin");
    await userEvent.type(canvas.getByLabelText(/Contraseña/), "secreto");
    await userEvent.click(
      canvas.getByRole("button", { name: "Iniciar sesión" }),
    );

    await expect(args.onSubmit).toHaveBeenCalledWith({
      username: "admin",
      password: "secreto",
    });
  },
};
