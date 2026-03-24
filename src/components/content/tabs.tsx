"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export function ContentTabs({
  defaultTab,
  children,
}: {
  defaultTab?: string
  children: React.ReactNode
}) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? "")

  // Extract tab labels from children
  const tabs: { label: string; content: React.ReactNode }[] = []
  const childArray = Array.isArray(children) ? children : [children]

  for (const child of childArray) {
    if (child && typeof child === "object" && "props" in child) {
      if (child.props?.label) {
        tabs.push({ label: child.props.label, content: child.props.children })
      }
    }
  }

  const active = activeTab || tabs[0]?.label || ""

  if (tabs.length === 0) return <>{children}</>

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-border">
      <div className="flex overflow-x-auto border-b border-border bg-muted/30">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActiveTab(tab.label)}
            className={cn(
              "flex-1 whitespace-nowrap px-4 py-2.5 text-[13px] font-medium transition-all",
              "border-b-2 border-transparent",
              active === tab.label
                ? "border-b-primary text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-5">
        {tabs.map((tab) => (
          <div
            key={tab.label}
            className={cn(
              active === tab.label ? "block" : "hidden",
              "prose prose-sm prose-zinc dark:prose-invert max-w-none",
              "prose-headings:font-semibold prose-headings:tracking-tight",
              "prose-p:text-muted-foreground prose-li:text-muted-foreground",
              "prose-strong:text-foreground prose-a:text-primary",
              "prose-h3:first:mt-0 prose-p:first:mt-0"
            )}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  )
}

export function ContentTab({
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  // This component is a data container — rendering is handled by ContentTabs
  return <>{children}</>
}
