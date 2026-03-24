import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import remarkDirective from "remark-directive"
import remarkDirectivesToMdx from "./remark-directives-to-mdx"
import { ContentTabs, ContentTab } from "@/components/content/tabs"
import { ContentSteps, ContentStep } from "@/components/content/steps"
import { MermaidDiagram } from "@/app/docs/[section]/[slug]/doc-content"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

function HeadingWithAnchor({
  level,
  children,
  ...props
}: {
  level: number
  children: React.ReactNode
  [key: string]: unknown
}) {
  const text = typeof children === "string" ? children : String(children)
  const id = slugify(text)
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements

  return (
    <Tag id={id} className="group" {...props}>
      <a href={`#${id}`} className="no-underline">
        {children}
        <span className="ml-2 opacity-0 transition-opacity group-hover:opacity-50">
          #
        </span>
      </a>
    </Tag>
  )
}

/**
 * MDX components available in all content files.
 * Maps component names used in the remark directive transform to actual React components.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
const mdxComponents: Record<string, React.ComponentType<any>> = {
  ContentTabs,
  ContentTab,
  ContentSteps,
  ContentStep,
  h1: ({ children, ...props }: any) => (
    <HeadingWithAnchor level={1} {...props}>
      {children}
    </HeadingWithAnchor>
  ),
  h2: ({ children, ...props }: any) => (
    <HeadingWithAnchor level={2} {...props}>
      {children}
    </HeadingWithAnchor>
  ),
  h3: ({ children, ...props }: any) => (
    <HeadingWithAnchor level={3} {...props}>
      {children}
    </HeadingWithAnchor>
  ),
  h4: ({ children, ...props }: any) => (
    <HeadingWithAnchor level={4} {...props}>
      {children}
    </HeadingWithAnchor>
  ),
  pre({ children, ...props }: any) {
    // Check if this is a mermaid code block
    const codeChild = children?.props
    if (codeChild?.className === "language-mermaid") {
      return <MermaidDiagram chart={String(codeChild.children).trim()} />
    }
    return <pre {...props}>{children}</pre>
  },
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Compile markdown/MDX content string into a React element.
 * Supports:
 *  - Standard markdown + GFM (tables, strikethrough, task lists)
 *  - Nuxt MDC directive syntax (::tabs, :::tab, ::steps, :::step)
 *  - Mermaid diagrams (```mermaid code blocks)
 *  - Heading anchors with # links
 *  - JSX components via MDX
 */
/**
 * Convert HTML style strings to JSX style objects.
 * MDX requires style={{}} not style="", e.g.:
 *   style="display:flex;gap:12px" → style={{display:"flex",gap:"12px"}}
 */
function convertHtmlStyleToJsx(source: string): string {
  return source.replace(
    /style="([^"]*)"/g,
    (_match, styleStr: string) => {
      const pairs = styleStr
        .split(";")
        .filter((s: string) => s.trim())
        .map((pair: string) => {
          const [prop, ...rest] = pair.split(":")
          const key = prop
            .trim()
            .replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase())
          const value = rest.join(":").trim()
          return `${key}:"${value}"`
        })
      return `style={{${pairs.join(",")}}}`
    }
  )
}

/**
 * Escape bare angle brackets that aren't part of HTML tags or code blocks.
 * MDX tries to parse `<5` or `<$50` as JSX — this escapes them so they render as text.
 */
function escapeBareAngleBrackets(source: string): string {
  const lines = source.split("\n")
  let inCodeBlock = false
  const result: string[] = []

  for (const line of lines) {
    if (line.trimStart().startsWith("```")) {
      inCodeBlock = !inCodeBlock
      result.push(line)
      continue
    }
    if (inCodeBlock) {
      result.push(line)
      continue
    }
    // Replace `<` that is followed by a non-letter, non-! (not an HTML tag or comment)
    // but not already escaped or inside inline code
    result.push(line.replace(/<(?=[^a-zA-Z!/])/g, "&lt;"))
  }

  return result.join("\n")
}

/**
 * Convert Nuxt MDC directive syntax to remark-directive syntax.
 *
 * Nuxt MDC uses:
 *   ::name{attrs}  → container open
 *   :::name{attrs} → nested container open
 *   :::            → nested container close
 *   ::             → container close
 *
 * remark-directive uses:
 *   :::name{attrs}  → container (fence style, 3+ colons)
 *   ::::name{attrs} → nested container (4+ colons)
 *   ::::            → nested container close
 *   :::             → container close
 */
function convertMdcToRemarkDirective(source: string): string {
  const lines = source.split("\n")
  let inCodeBlock = false
  const result: string[] = []

  for (const line of lines) {
    const trimmed = line.trimStart()

    if (trimmed.startsWith("```")) {
      inCodeBlock = !inCodeBlock
      result.push(line)
      continue
    }
    if (inCodeBlock) {
      result.push(line)
      continue
    }

    // Match directive patterns (opening or closing)
    // :::name{...} → nested container open → becomes ::::name{...}
    // ::: (bare) → nested container close → becomes ::::
    // ::name{...} → container open → becomes :::name{...}
    // :: (bare) → container close → becomes :::
    const nestedOpenMatch = trimmed.match(/^:::([\w-]+)(.*)$/)
    const containerOpenMatch = trimmed.match(/^::([\w-]+)(.*)$/)

    if (trimmed === ":::") {
      // Nested container close
      result.push(line.replace(":::", "::::"))
    } else if (trimmed === "::") {
      // Container close
      result.push(line.replace("::", ":::"))
    } else if (nestedOpenMatch) {
      // :::name{...} → ::::name{...}
      result.push(line.replace(/^(\s*):::/, "$1::::"))
    } else if (containerOpenMatch) {
      // ::name{...} → :::name{...}
      result.push(line.replace(/^(\s*)::/, "$1:::"))
    } else {
      result.push(line)
    }
  }

  return result.join("\n")
}

export async function renderMdxContent(source: string) {
  const preprocessed = convertMdcToRemarkDirective(
    escapeBareAngleBrackets(convertHtmlStyleToJsx(source))
  )
  const { content } = await compileMDX({
    source: preprocessed,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkDirective, remarkDirectivesToMdx],
      },
    },
    components: mdxComponents,
  })
  return content
}
