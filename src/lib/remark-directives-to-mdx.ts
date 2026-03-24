/**
 * Remark plugin that transforms Nuxt MDC directive syntax into MDX component nodes.
 *
 * Converts:
 *   ::tabs{default="Business View"}
 *   :::tab{label="Business View"}
 *   content
 *   :::
 *   ::
 *
 * Into JSX component calls for ContentTabs / ContentTab.
 */
import { visit } from "unist-util-visit"
import type { Plugin } from "unified"

// Maps directive names to component names
const COMPONENT_MAP: Record<string, string> = {
  tabs: "ContentTabs",
  tab: "ContentTab",
  steps: "ContentSteps",
  step: "ContentStep",
}

const remarkDirectivesToMdx: Plugin = () => {
  return (tree) => {
    visit(tree, (node) => {
      // remark-directive creates nodes with types:
      // "containerDirective" for ::name (2 colons — container with children)
      // "leafDirective" for ::name (2 colons — no children, self-closing)
      // "textDirective" for :name (1 colon — inline)
      if (
        node.type === "containerDirective" ||
        node.type === "leafDirective" ||
        node.type === "textDirective"
      ) {
        const directive = node as {
          type: string
          name: string
          attributes?: Record<string, string>
          data?: Record<string, unknown>
          children?: unknown[]
        }

        const componentName = COMPONENT_MAP[directive.name]
        if (!componentName) return

        // Transform the directive node into an mdxJsxFlowElement
        // This is what MDX uses to represent JSX components in the AST
        const attributes = directive.attributes || {}
        const jsxAttributes = Object.entries(attributes).map(([key, value]) => ({
          type: "mdxJsxAttribute" as const,
          name: key === "default" ? "defaultTab" : key,
          value: value,
        }))

        // Mutate the node in-place to become a JSX element
        Object.assign(directive, {
          type: "mdxJsxFlowElement",
          name: componentName,
          attributes: jsxAttributes,
          children: directive.children || [],
          data: { _mdxExplicitJsx: true },
        })
      }
    })
  }
}

export default remarkDirectivesToMdx
