import { ContentHeader, Field, Input, Panel, PanelContent, PanelHeader, Text } from "@gestor-finanzas/ui";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

function MoleculeComposition() {
  return (
    <Panel className="max-w-2xl">
      <PanelHeader><ContentHeader eyebrow="Molécula" level={2} title="Movimiento" description="Las moléculas resuelven una composición pequeña y sin dominio." /></PanelHeader>
      <PanelContent className="grid gap-[var(--ui-space-5)]">
        <Field htmlFor="story-concept" label="Concepto" description="Descripción accesible del campo" required><Input id="story-concept" /></Field>
        <Text variant="small" tone="muted">El panel, su cabecera y el campo siguen siendo reutilizables fuera de finanzas.</Text>
      </PanelContent>
    </Panel>
  );
}

const meta = { title: "Molecules/Composition", component: MoleculeComposition } satisfies Meta<typeof MoleculeComposition>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
