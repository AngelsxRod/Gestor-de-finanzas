export type NavHref =
  | "/"
  | "/cuentas"
  | "/categorias"
  | "/movimientos"
  | "/presupuestos"
  | "/configuracion";

export type NavItemStatus = "available" | "coming-soon";

export type NavItem = {
  description: string;
  href: NavHref;
  label: string;
  status: NavItemStatus;
};

export const NAV_ITEMS: readonly NavItem[] = [
  {
    href: "/",
    label: "Resumen",
    description: "Vista general de tus finanzas",
    status: "available",
  },
  {
    href: "/cuentas",
    label: "Cuentas",
    description: "Administra tus cuentas",
    status: "available",
  },
  {
    href: "/categorias",
    label: "Categorías",
    description: "Clasifica tus ingresos y gastos",
    status: "available",
  },
  {
    href: "/movimientos",
    label: "Movimientos",
    description: "Registra ingresos, gastos y transferencias",
    status: "available",
  },
  {
    href: "/presupuestos",
    label: "Presupuestos",
    description: "Límites y seguimiento por categoría",
    status: "coming-soon",
  },
  {
    href: "/configuracion",
    label: "Configuración",
    description: "Preferencias de la aplicación",
    status: "coming-soon",
  },
];
