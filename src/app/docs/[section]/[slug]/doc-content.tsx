'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    darkMode: true,
    background: 'transparent',
    primaryColor: '#3b82f6',
    primaryTextColor: '#e4e4e7',
    primaryBorderColor: '#3f3f46',
    lineColor: '#52525b',
    secondaryColor: '#27272a',
    tertiaryColor: '#18181b',
    fontFamily: 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif',
    fontSize: '13px',
  },
})

let mermaidCounter = 0

function MermaidDiagram({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const id = `mermaid-${++mermaidCounter}`
    mermaid
      .render(id, chart)
      .then(({ svg: rendered }) => setSvg(rendered))
      .catch((err) => setError(String(err)))
  }, [chart])

  if (error) {
    return (
      <pre className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-xs text-destructive overflow-x-auto">
        {chart}
      </pre>
    )
  }

  return (
    <div
      ref={containerRef}
      className="my-6 flex justify-center overflow-x-auto rounded-lg border bg-muted/30 p-6 [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const markdownComponents: Record<string, React.ComponentType<any>> = {
  code({ className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '')
    const lang = match?.[1]

    if (lang === 'mermaid') {
      return <MermaidDiagram chart={String(children).trim()} />
    }

    // Inline code vs block code
    if (!className) {
      return <code {...props}>{children}</code>
    }

    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function DocContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={markdownComponents}
    >
      {content}
    </ReactMarkdown>
  )
}

export function DocPageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
    >
      {children}
    </motion.div>
  )
}
