import type { ReactNode } from "react";

export type ArchitectureDemoTemplateProps = {
  form: ReactNode;
  intro: ReactNode;
  status: ReactNode;
};

export function ArchitectureDemoTemplate({
  form,
  intro,
  status,
}: ArchitectureDemoTemplateProps) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-[var(--ui-space-10)] px-6 py-16 sm:px-10 lg:py-24">
      <div className="max-w-2xl">{intro}</div>
      <div className="grid gap-[var(--ui-space-6)] lg:grid-cols-2">
        {status}
        {form}
      </div>
    </main>
  );
}
