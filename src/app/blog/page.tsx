import { getBlogPosts } from "@/lib/blog"
import BlogListing from "./blog-listing"
import FaqComponent from "@/components/shadcn-studio/blocks/faq-component-14/faq-component-14"

export const metadata = {
  title: "Blog — SDD",
  description:
    "Insights on Story-Driven Development, engineering practices, and building better software teams.",
}

export default function BlogPage() {
  const posts = getBlogPosts()

  return (
    <>
      <BlogListing posts={posts} />
      <FaqComponent faqItems={[
        { image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop', title: 'How often do you publish?', description: 'We publish new articles weekly covering engineering practices, SDD methodology updates, and lessons learned from shipping features.' },
        { image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop', title: 'Can I contribute a post?', description: 'Yes — reach out to the dev team. We welcome posts about engineering practices, process improvements, and technical deep-dives.' },
        { image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop', title: 'What topics do you cover?', description: 'We cover Story-Driven Development methodology, engineering culture, shipping practices, and technical architecture decisions.' },
      ]} />
    </>
  )
}
