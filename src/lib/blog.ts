import fs from "fs";
import path from "path";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: "Process" | "Engineering" | "Culture";
  author: string;
  date: string;
  content: string;
};

const BLOG_DIR = path.join(process.cwd(), "content/blog");

function parseFrontmatter(raw: string): {
  data: Record<string, string>;
  content: string;
} {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const m = line.match(/^(\w[\w_-]*)\s*:\s*(.+)/);
    if (m) {
      data[m[1]] = m[2].replace(/^['"]|['"]$/g, "").trim();
    }
  }

  return { data, content: match[2].trim() };
}

export function getBlogPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"));

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
    const { data, content } = parseFrontmatter(raw);
    const slug = file.replace(/\.md$/, "");

    return {
      slug,
      title: data.title || slug,
      description: data.description || "",
      category: (data.category || "Engineering") as BlogPost["category"],
      author: data.author || "SDD Team",
      date: data.date || "",
      content,
    };
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getBlogPost(slug: string): BlogPost | undefined {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return undefined;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = parseFrontmatter(raw);

  return {
    slug,
    title: data.title || slug,
    description: data.description || "",
    category: (data.category || "Engineering") as BlogPost["category"],
    author: data.author || "SDD Team",
    date: data.date || "",
    content,
  };
}
