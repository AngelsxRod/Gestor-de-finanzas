import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@gestor-finanzas/ui";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const rows = [
  { id: "1", name: "Cuenta principal", type: "Cuenta corriente", isActive: true },
  { id: "2", name: "Ahorros", type: "Ahorro", isActive: false },
];

function TablePreview() {
  return (
    <Table aria-label="Cuentas de ejemplo">
      <TableHeader>
        <TableRow>
          <TableCell as="th">Nombre</TableCell>
          <TableCell as="th">Tipo</TableCell>
          <TableCell as="th">Estado</TableCell>
          <TableCell as="th">Acciones</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.type}</TableCell>
            <TableCell>
              <Badge tone={row.isActive ? "success" : "neutral"}>
                {row.isActive ? "Activa" : "Inactiva"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-[var(--ui-space-2)]">
                <Button variant="secondary">Editar</Button>
                <Button variant="secondary">
                  {row.isActive ? "Desactivar" : "Reactivar"}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const meta = {
  title: "Molecules/Table",
  component: TablePreview,
} satisfies Meta<typeof TablePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
