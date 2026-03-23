"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { SearchIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MotionPreset } from "@/components/ui/motion-preset"
import type { BlogPost } from "@/lib/blog"

const categories = ["All", "Process", "Engineering", "Culture"] as const

const categoryColors: Record<string, string> = {
  Process: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Engineering: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Culture: "bg-amber-500/10 text-amber-400 border-amber-500/20",
}

function PostCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <MotionPreset
      fade
      slide={{ direction: "up", offset: 30 }}
      delay={index * 0.06}
    >
      <Link href={`/blog/${post.slug}`} className="group block h-full">
        <Card className="h-full border-border/50 shadow-none transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-border">
          <CardContent className="flex h-full flex-col gap-3 pt-1">
            <Badge
              variant="outline"
              className={categoryColors[post.category] || ""}
            >
              {post.category}
            </Badge>
            <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
              {post.description}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-[family-name:var(--font-geist-mono)]">
              <span>{post.author}</span>
              <span className="text-border">·</span>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </div>
          </CardContent>
        </Card>
      </Link>
    </MotionPreset>
  )
}

export default function BlogListing({ posts }: { posts: BlogPost[] }) {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<string>("All")

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        activeTab === "All" || post.category === activeTab
      const matchesSearch =
        search === "" ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.description.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [posts, activeTab, search])

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        {/* Header */}
        <MotionPreset fade blur slide={{ direction: "up", offset: 30 }} delay={0}>
          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-4">
              Blog
            </Badge>
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
              Articles &amp; Guides
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Insights on Story-Driven Development, engineering practices, and
              building better software teams.
            </p>
          </div>
        </MotionPreset>

        {/* Filters */}
        <MotionPreset fade slide={{ direction: "up", offset: 20 }} delay={0.1}>
          <Tabs
            defaultValue="All"
            onValueChange={(value) => setActiveTab(String(value ?? "All"))}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <TabsList>
                {categories.map((cat) => (
                  <TabsTrigger key={cat} value={cat}>
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="relative w-full sm:w-64">
                <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {categories.map((cat) => (
              <TabsContent key={cat} value={cat}>
                {filtered.length === 0 ? (
                  <div className="py-20 text-center text-muted-foreground">
                    No articles found.
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((post, i) => (
                      <PostCard key={post.slug} post={post} index={i} />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </MotionPreset>
      </div>
    </div>
  )
}
