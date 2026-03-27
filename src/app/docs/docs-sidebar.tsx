"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { DocCategory } from "@/lib/docs";
import {
  ActivityIcon,
  BookOpenIcon,
  BrainCircuitIcon,
  ChevronRightIcon,
  CodeIcon,
  CompassIcon,
  FileTextIcon,
  GraduationCapIcon,
  LayersIcon,
  LibraryIcon,
  PlugIcon,
  ServerIcon,
  TerminalIcon,
  WrenchIcon,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

const sectionIcons: Record<string, React.ReactNode> = {
  "ways-of-working-7.spec-driven-development": <FileTextIcon className="size-3.5" />,
  "ways-of-working-0.overview": <BookOpenIcon className="size-3.5" />,
  "ways-of-working-2.claude-code": <TerminalIcon className="size-3.5" />,
  "ways-of-working-2.claude-code-0.environment-setup": <CodeIcon className="size-3.5" />,
  "ways-of-working-2.claude-code-advanced": <BrainCircuitIcon className="size-3.5" />,
  "ways-of-working-tools": <WrenchIcon className="size-3.5" />,
  "ways-of-working-4.MCPs": <BrainCircuitIcon className="size-3.5" />,
  "ways-of-working-6.linear": <LayersIcon className="size-3.5" />,
  architecture: <ServerIcon className="size-3.5" />,
  "context-integrations": <PlugIcon className="size-3.5" />,
  "tc-claude": <ActivityIcon className="size-3.5" />,
};

const categoryIcons: Record<string, React.ReactNode> = {
  "getting-started": <CompassIcon className="size-3.5" />,
  guides: <GraduationCapIcon className="size-3.5" />,
  reference: <LibraryIcon className="size-3.5" />,
  "tc-claude": <ActivityIcon className="size-3.5" />,
};

export function DocsSidebarNav({ categories }: { categories: DocCategory[] }) {
  const pathname = usePathname();

  // Extract current section slug from URL: /docs/{section}/{page}
  const segments = pathname.split("/").filter(Boolean);
  const activeSection = segments.length >= 2 ? segments[1] : null;

  return (
    <>
      {/* Docs home */}
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname === "/docs"}
                render={<a href="/docs" />}
              >
                <CodeIcon className="size-3.5" />
                <span>Docs Home</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Categories → Sections → Pages */}
      {categories.map((category) => (
        <SidebarGroup key={category.slug}>
          <SidebarGroupLabel className="gap-2 text-[11px] font-semibold uppercase tracking-wider">
            {categoryIcons[category.slug]}
            {category.title}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {category.sections.map((section) => {
                const isActive = activeSection === section.slug;
                return (
                  <SidebarMenuItem key={section.slug}>
                    <SidebarMenuButton
                      isActive={isActive}
                      className="text-xs"
                      render={
                        <a href={`/docs/${section.slug}/${section.pages[0]?.slug}`} />
                      }
                    >
                      {sectionIcons[section.slug] ?? (
                        <FileTextIcon className="size-3.5" />
                      )}
                      <span className="truncate">{section.title}</span>
                      <ChevronRightIcon
                        className={cn(
                          "ml-auto size-3 text-sidebar-foreground/40 transition-transform duration-200",
                          isActive && "rotate-90"
                        )}
                      />
                    </SidebarMenuButton>

                    {/* Only show sub-pages for the active section */}
                    {isActive && (
                      <SidebarMenuSub>
                        {section.pages.map((page) => {
                          const pageHref = `/docs/${section.slug}/${page.slug}`;
                          return (
                            <SidebarMenuSubItem key={page.slug}>
                              <SidebarMenuSubButton
                                isActive={pathname === pageHref}
                                className="text-xs"
                                render={<a href={pageHref} />}
                              >
                                <span className="truncate">{page.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
