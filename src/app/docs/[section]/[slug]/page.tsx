import { notFound } from 'next/navigation'

import { ExternalLinkIcon, PencilIcon } from 'lucide-react'

import { getDocPage, getDocSections, extractHeadings } from '@/lib/docs'
import { renderMdxContent } from '@/lib/mdx'

const GITHUB_REPO = process.env.GITHUB_REPO || 'willwhitelaw94/SDD'

export async function generateStaticParams() {
  const sections = getDocSections()
  const params: { section: string; slug: string }[] = []

  for (const section of sections) {
    for (const page of section.pages) {
      params.push({ section: section.slug, slug: page.slug })
    }
  }

  return params
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ section: string; slug: string }>
}) {
  const { section: sectionSlug, slug } = await params
  const result = getDocPage(sectionSlug, slug)

  if (!result) notFound()

  const { section, page, category } = result

  // Find prev/next pages
  const pageIndex = section.pages.findIndex((p) => p.slug === page.slug)
  const prevPage = pageIndex > 0 ? section.pages[pageIndex - 1] : null
  const nextPage =
    pageIndex < section.pages.length - 1 ? section.pages[pageIndex + 1] : null

  const githubEditUrl = GITHUB_REPO
    ? `https://github.com/${GITHUB_REPO}/edit/main/${page.filePath}`
    : null
  const isDev = process.env.NODE_ENV === 'development'

  const headings = extractHeadings(page.content)
  const renderedContent = await renderMdxContent(page.content)

  return (
    <div className="flex gap-10">
      <article className="min-w-0 flex-1 space-y-8">
        <div>
          <div className="mb-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <a href="/docs" className="hover:text-foreground transition-colors">Docs</a>
              <span>/</span>
              <span>{category.title}</span>
              <span>/</span>
              <span>{section.title}</span>
            </div>

            {/* Edit links */}
            <div className="flex items-center gap-2">
              {isDev && (
                <a
                  href={`vscode://file/${process.cwd()}/${page.filePath}`}
                  className="flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                  title="Open in VS Code"
                >
                  <PencilIcon className="size-3" />
                  Edit locally
                </a>
              )}
              {githubEditUrl && (
                <a
                  href={githubEditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                  title="Edit on GitHub"
                >
                  <ExternalLinkIcon className="size-3" />
                  Edit on GitHub
                </a>
              )}
            </div>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">{page.title}</h1>
          {page.description && (
            <p className="mt-2 text-lg text-muted-foreground">{page.description}</p>
          )}
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-headings:font-semibold prose-a:text-primary prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:border">
          {renderedContent}
        </div>

        {/* File path hint (dev only) */}
        {isDev && (
          <div className="rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground font-mono">
            {page.filePath}
          </div>
        )}

        {/* Prev / Next navigation */}
        <nav className="flex items-center justify-between gap-4 border-t pt-6">
          {prevPage ? (
            <a
              href={`/docs/${sectionSlug}/${prevPage.slug}`}
              className="group flex flex-col items-start gap-1 text-sm"
            >
              <span className="text-muted-foreground">Previous</span>
              <span className="font-medium group-hover:text-primary transition-colors">
                {prevPage.title}
              </span>
            </a>
          ) : (
            <div />
          )}
          {nextPage ? (
            <a
              href={`/docs/${sectionSlug}/${nextPage.slug}`}
              className="group flex flex-col items-end gap-1 text-sm"
            >
              <span className="text-muted-foreground">Next</span>
              <span className="font-medium group-hover:text-primary transition-colors">
                {nextPage.title}
              </span>
            </a>
          ) : (
            <div />
          )}
        </nav>
      </article>

      {/* Table of Contents — right side */}
      {headings.length > 2 && (
        <aside className="sticky top-20 hidden h-fit w-48 shrink-0 xl:block">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
            On this page
          </p>
          <nav className="flex flex-col gap-1.5 border-l">
            {headings.map((heading) => (
              <a
                key={heading.slug}
                href={`#${heading.slug}`}
                className={`text-xs text-muted-foreground transition-colors hover:text-foreground ${
                  heading.level === 2 ? 'pl-3' : heading.level === 3 ? 'pl-5' : 'pl-7'
                }`}
              >
                {heading.text}
              </a>
            ))}
          </nav>
        </aside>
      )}
    </div>
  )
}
