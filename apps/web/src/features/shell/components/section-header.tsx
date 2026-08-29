import { Heading, Text } from "@gestor-finanzas/ui";
import type { ReactNode } from "react";
import { Breadcrumb, type BreadcrumbItem } from "./breadcrumb";
import { MobileMenuButton } from "./mobile-menu-button";

export type SectionHeaderProps = {
  action?: ReactNode;
  breadcrumbItems: BreadcrumbItem[];
  description?: string;
  title: string;
};

export function SectionHeader({
  action,
  breadcrumbItems,
  description,
  title,
}: SectionHeaderProps) {
  return (
    <header className="grid gap-[var(--ui-space-6)] px-6 pb-8 pt-6 sm:px-10">
      <div className="flex items-center gap-[var(--ui-space-4)]">
        <MobileMenuButton />
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <div className="flex flex-wrap items-start justify-between gap-[var(--ui-space-4)]">
        <div className="grid gap-[var(--ui-space-2)]">
          <Heading level={1} variant="title">
            {title}
          </Heading>
          {description ? <Text tone="muted">{description}</Text> : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
    </header>
  );
}
