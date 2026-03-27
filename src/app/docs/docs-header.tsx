"use client";

import { InternalHeader } from "@/components/internal-header";
import { GlobalSearch } from "@/components/global-search";
import type { DocCategory } from "@/lib/docs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export function DocsHeader({ categories }: { categories: DocCategory[] }) {
  // Flatten docs for search
  const docs = categories.flatMap((cat) =>
    cat.sections.flatMap((section) =>
      section.pages.map((page) => ({
        title: page.title,
        description: page.description,
        section: section.title,
        href: `/docs/${section.slug}/${page.slug}`,
      }))
    )
  );

  return (
    <InternalHeader
      rightSlot={
        <>
          <GlobalSearch docs={docs} />
          <ThemeToggle />
          <span className="text-muted-foreground/30">|</span>
        </>
      }
    >
      <SidebarTrigger />
    </InternalHeader>
  );
}
