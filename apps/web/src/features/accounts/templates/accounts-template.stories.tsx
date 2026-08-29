import { ContentHeader } from "@gestor-finanzas/ui";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AccountForm } from "../components/account-form";
import { AccountList } from "../components/account-list";
import { AccountsTemplate } from "./accounts-template";

const meta = {
  title: "Templates/Accounts",
  component: AccountsTemplate,
  args: {
    intro: (
      <ContentHeader
        eyebrow="Finanzas personales"
        level={1}
        variant="display"
        title="Organiza tus cuentas"
        description="Registra tus cuentas y conserva un punto de partida claro."
      />
    ),
    content: (
      <div className="grid gap-[var(--ui-space-6)] lg:grid-cols-2">
        <AccountForm isSubmitting={false} onSubmit={async () => undefined} />
        <AccountList state="success" accounts={[]} />
      </div>
    ),
  },
} satisfies Meta<typeof AccountsTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
