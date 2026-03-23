"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
}

export default function BlogArticle({ content }: { content: string }) {
  return (
    <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h2:text-lg prose-h3:text-base prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-primary prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-hr:border-border prose-table:text-sm prose-th:text-left prose-th:font-medium">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children, ...props }) => {
            const text = typeof children === "string" ? children : String(children)
            const id = generateId(text)
            return (
              <h2 id={id} {...props}>
                {children}
              </h2>
            )
          },
          h3: ({ children, ...props }) => {
            const text = typeof children === "string" ? children : String(children)
            const id = generateId(text)
            return (
              <h3 id={id} {...props}>
                {children}
              </h3>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
