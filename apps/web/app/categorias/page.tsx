import type { Metadata } from "next";
import { CategoriesDashboard } from "@/src/features/categories/components/categories-dashboard";
import { CreateCategoryTriggerButton } from "@/src/features/categories/components/create-category-trigger-button";
import { CategoryModalProvider } from "@/src/features/categories/context/category-modal-context";
import { SectionHeader } from "@/src/features/shell/components/section-header";
import { SectionTemplate } from "@/src/features/shell/templates/section-template";

export const metadata: Metadata = {
  title: "Categorías · Gestor de finanzas",
};

export default function CategoriasPage() {
  return (
    <CategoryModalProvider>
      <SectionTemplate
        header={
          <SectionHeader
            title="Categorías"
            description="Clasifica tus ingresos y gastos."
            breadcrumbItems={[
              { label: "Resumen", href: "/" },
              { label: "Categorías" },
            ]}
            action={<CreateCategoryTriggerButton />}
          />
        }
        content={<CategoriesDashboard />}
      />
    </CategoryModalProvider>
  );
}
