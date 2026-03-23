import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getBlogPost, getBlogPosts } from "@/lib/blog"
import BlogArticle from "./blog-article"

export async function generateStaticParams() {
  const posts = getBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return { title: "Not Found" }

  return {
    title: `${post.title} — SDD Blog`,
    description: post.description,
  }
}

const categoryColors: Record<string, string> = {
  Process: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Engineering: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Culture: "bg-amber-500/10 text-amber-400 border-amber-500/20",
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    notFound()
  }

  // Extract headings for table of contents
  const headingRegex = /^#{2,3}\s+(.+)$/gm
  const headings: { level: number; text: string; id: string }[] = []
  let match
  while ((match = headingRegex.exec(post.content)) !== null) {
    const level = match[0].startsWith("###") ? 3 : 2
    const text = match[1].trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
    headings.push({ level, text, id })
  }

  const showToc = headings.length >= 3

  return (
    <div className="min-h-screen bg-background">
      <div
        className={`mx-auto px-6 py-16 sm:py-24 ${
          showToc ? "max-w-5xl" : "max-w-3xl"
        }`}
      >
        <div className={showToc ? "flex gap-12" : ""}>
          {/* Main article */}
          <article className={showToc ? "min-w-0 flex-1" : ""}>
            {/* Back link */}
            <Link
              href="/blog"
              className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeftIcon className="size-3.5" />
              Back to Blog
            </Link>

            {/* Meta */}
            <div className="mb-6 flex items-center gap-3">
              <Badge
                variant="outline"
                className={categoryColors[post.category] || ""}
              >
                {post.category}
              </Badge>
              <time
                dateTime={post.date}
                className="text-xs text-muted-foreground font-[family-name:var(--font-geist-mono)]"
              >
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>

            {/* Title */}
            <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl mb-3">
              {post.title}
            </h1>

            {/* Author */}
            <p className="text-sm text-muted-foreground mb-10">
              By{" "}
              <span className="text-foreground font-medium">{post.author}</span>
            </p>

            {/* Content */}
            <BlogArticle content={post.content} />
          </article>

          {/* Table of contents sidebar */}
          {showToc && (
            <aside className="hidden lg:block w-56 shrink-0">
              <div className="sticky top-24">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  On this page
                </p>
                <nav className="space-y-1.5">
                  {headings.map((h) => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      className={`block text-sm text-muted-foreground hover:text-foreground transition-colors ${
                        h.level === 3 ? "pl-3" : ""
                      }`}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
