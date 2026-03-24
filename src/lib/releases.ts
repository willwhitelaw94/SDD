import fs from "fs";
import path from "path";

export type Release = {
  slug: string;
  title: string;
  description: string;
  date: string;
  version: string;
  impact: string;
  content: string;
};

const RELEASES_DIR = path.join(process.cwd(), "content/release/2.releases");

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

export function getReleases(): Release[] {
  if (!fs.existsSync(RELEASES_DIR)) return [];

  const files = fs
    .readdirSync(RELEASES_DIR)
    .filter((f) => f.endsWith(".md") && f !== "index.md")
    .sort()
    .reverse(); // newest first

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(RELEASES_DIR, file), "utf-8");
    const { data, content } = parseFrontmatter(raw);

    return {
      slug: file.replace(/\.md$/, ""),
      title: data.title || file,
      description: data.description || "",
      date: data.date || "",
      version: data.version || "",
      impact: data.impact || "low",
      content,
    };
  });
}
