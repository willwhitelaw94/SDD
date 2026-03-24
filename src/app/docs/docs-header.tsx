"use client";

import { InternalNav } from "@/components/internal-nav";
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
    <header className="bg-card sticky top-0 z-50 flex h-14 items-center justify-between border-b px-4 sm:px-6">
      <SidebarTrigger />
      <div className="ml-auto flex items-center gap-2">
        <GlobalSearch docs={docs} />
        <ThemeToggle />
        <span className="text-muted-foreground/30">|</span>
        <InternalNav />
      </div>
    </header>
  );
}
