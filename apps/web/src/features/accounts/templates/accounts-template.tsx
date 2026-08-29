import type { ReactNode } from "react";

export type AccountsTemplateProps = {
  content: ReactNode;
  intro: ReactNode;
};

export function AccountsTemplate({ content, intro }: AccountsTemplateProps) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-[var(--ui-space-10)] px-6 py-16 sm:px-10 lg:py-24">
      <div className="max-w-2xl">{intro}</div>
      {content}
    </main>
  );
}
