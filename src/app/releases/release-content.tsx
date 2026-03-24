import { renderMdxContent } from "@/lib/mdx"

/**
 * Server Component that renders release markdown content through the MDX pipeline.
 * Supports directive syntax (::tabs, :::tab) used in TC Portal release notes.
 */
export async function ReleaseContent({ content }: { content: string }) {
  const rendered = await renderMdxContent(content)
  return <>{rendered}</>
}
