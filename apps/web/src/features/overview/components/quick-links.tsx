import { Badge, Heading, Panel, Text } from "@gestor-finanzas/ui";
import Link from "next/link";
import { NAV_ITEMS } from "../../shell/config/nav-items";

export function QuickLinks() {
  const sections = NAV_ITEMS.filter((item) => item.href !== "/");

  return (
    <nav aria-label="Accesos a secciones">
      <Heading level={2} variant="section" className="mb-[var(--ui-space-4)]">
        Secciones
      </Heading>
      <ul className="grid gap-[var(--ui-space-4)] sm:grid-cols-2">
        {sections.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block rounded-[var(--ui-radius-panel)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-color-focus)]"
            >
              <Panel className="grid gap-[var(--ui-space-2)] transition-colors hover:bg-[var(--ui-color-surface-subtle)]">
                <div className="flex items-center justify-between gap-[var(--ui-space-2)]">
                  <Heading level={3} variant="subsection">
                    {item.label}
                  </Heading>
                  {item.status === "coming-soon" ? (
                    <Badge tone="neutral">Próximamente</Badge>
                  ) : null}
                </div>
                <Text tone="muted" variant="small">
                  {item.description}
                </Text>
              </Panel>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
