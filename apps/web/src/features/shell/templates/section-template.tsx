import type { ReactNode } from "react";

export type SectionTemplateProps = {
  content: ReactNode;
  header: ReactNode;
};

export function SectionTemplate({ content, header }: SectionTemplateProps) {
  return (
    <main className="flex flex-1 flex-col">
      {header}
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-[var(--ui-space-10)] px-6 py-10 sm:px-10">
        {content}
      </div>
    </main>
  );
}
