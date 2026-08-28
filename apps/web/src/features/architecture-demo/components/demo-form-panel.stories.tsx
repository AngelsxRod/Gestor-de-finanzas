import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { DemoFormPanel } from "./demo-form-panel";

const meta = { title: "Organisms/Demo form panel", component: DemoFormPanel } satisfies Meta<typeof DemoFormPanel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const ValidationAndSubmit: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Validar formulario" }));
    await expect(await canvas.findAllByRole("alert")).toHaveLength(2);
    await userEvent.type(canvas.getByLabelText(/Concepto/), "Ahorro mensual");
    await userEvent.type(canvas.getByLabelText(/Monto/), "1250");
    await userEvent.click(canvas.getByRole("button", { name: "Validar formulario" }));
    await expect(await canvas.findByText("Datos válidos")).toBeInTheDocument();
  },
};
