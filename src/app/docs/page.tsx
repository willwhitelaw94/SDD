import {
  BookOpenIcon,
  BrainCircuitIcon,
  CodeIcon,
  FileTextIcon,
  LayersIcon,
  ServerIcon,
  TerminalIcon,
  WrenchIcon,
} from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getDocCategories } from '@/lib/docs'

import type { ReactNode } from 'react'

const sectionIcons: Record<string, ReactNode> = {
  'ways-of-working-7.spec-driven-development': <FileTextIcon className="size-5" />,
  'ways-of-working-0.overview': <BookOpenIcon className="size-5" />,
  'ways-of-working-2.claude-code': <TerminalIcon className="size-5" />,
  'ways-of-working-2.claude-code-0.environment-setup': <CodeIcon className="size-5" />,
  'ways-of-working-2.claude-code-advanced': <BrainCircuitIcon className="size-5" />,
  'ways-of-working-tools': <WrenchIcon className="size-5" />,
  'ways-of-working-4.MCPs': <BrainCircuitIcon className="size-5" />,
  'ways-of-working-6.linear': <LayersIcon className="size-5" />,
  'architecture': <ServerIcon className="size-5" />,
}

export default function DocsIndexPage() {
  const categories = getDocCategories()

  return (
    <div className="space-y-12">
      <div>
        <Badge variant="outline" className="mb-3">Documentation</Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          TC-Docs
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Everything you need to understand Story-Driven Development — from process
          guides to tools reference and architecture docs.
        </p>
      </div>

      {categories.map((category) => (
        <div key={category.slug} className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">{category.title}</h2>
            <Separator className="mt-2" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {category.sections.map((section) => (
              <a
                key={section.slug}
                href={`/docs/${section.slug}/${section.pages[0]?.slug}`}
              >
                <Card className="group flex h-full flex-col gap-3 p-5 transition-shadow hover:shadow-lg">
                  <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                    {sectionIcons[section.slug] ?? <FileTextIcon className="size-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {section.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {section.pages.length} {section.pages.length === 1 ? 'page' : 'pages'}
                    </p>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
