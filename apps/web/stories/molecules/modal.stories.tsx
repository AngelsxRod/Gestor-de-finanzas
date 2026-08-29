import {
  Button,
  Field,
  Heading,
  Input,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@gestor-finanzas/ui";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

function ModalPreview() {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Abrir modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} labelledBy="demo-modal-title">
        <ModalHeader>
          <Heading id="demo-modal-title" level={2} variant="section">
            Nueva cuenta
          </Heading>
        </ModalHeader>
        <ModalContent>
          <Field htmlFor="demo-modal-name" label="Nombre" required>
            <Input id="demo-modal-name" autoFocus />
          </Field>
        </ModalContent>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={() => setOpen(false)}>Guardar</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

const meta = {
  title: "Molecules/Modal",
  component: ModalPreview,
} satisfies Meta<typeof ModalPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};

export const CloseWithButton: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialog = canvasElement.querySelector("dialog");
    await expect(dialog?.open).toBe(true);
    await userEvent.click(canvas.getByRole("button", { name: "Cancelar" }));
    await expect(dialog?.open).toBe(false);
  },
};
