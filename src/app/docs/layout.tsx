import type { CSSProperties, ReactNode } from 'react'
import { getDocCategories } from '@/lib/docs'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from '@/components/ui/sidebar'
import OrionLogo from '@/assets/svg/orion-logo'
import { DocsSidebarNav } from './docs-sidebar'
import { DocsHeader } from './docs-header'

export default function DocsLayout({ children }: { children: ReactNode }) {
  const categories = getDocCategories()

  return (
    <div className="flex min-h-dvh w-full">
      <SidebarProvider
        defaultOpen
        style={{ '--sidebar-width': '15rem' } as CSSProperties}
      >
        <Sidebar collapsible="icon" className="[&_[data-slot=sidebar-inner]]:bg-card">
          <SidebarHeader className="h-14 flex-row items-center border-b px-3">
            <a href="/" className="flex items-center gap-2.5">
              <OrionLogo className="size-7" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold">SDD</span>
                <span className="text-muted-foreground text-[11px]">Documentation</span>
              </div>
            </a>
          </SidebarHeader>

          <SidebarContent>
            <DocsSidebarNav categories={categories} />
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-1 flex-col">
          <DocsHeader categories={categories} />

          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-4xl">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}
