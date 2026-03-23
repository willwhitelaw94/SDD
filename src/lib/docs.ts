import fs from "fs";
import path from "path";

export type DocPage = {
  slug: string;
  title: string;
  description: string;
  content: string;
  order: number;
  /** Relative path from project root, e.g. "content/architecture/0.overview.md" */
  filePath: string;
};

export type DocSection = {
  slug: string;
  title: string;
  pages: DocPage[];
};

export type DocCategory = {
  slug: string;
  title: string;
  sections: DocSection[];
};

const CONTENT_ROOT = path.join(process.cwd(), "content");

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

function titleFromFilename(filename: string): string {
  return filename
    .replace(/\.md$/, "")
    .replace(/^\d+-/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function orderFromFilename(filename: string): number {
  const match = filename.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 99;
}

/** Read .md files from a directory (non-recursive) */
function readPages(dirPath: string): DocPage[] {
  if (!fs.existsSync(dirPath)) return [];

  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".md"));

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dirPath, file), "utf-8");
    const { data, content } = parseFrontmatter(raw);
    const slug = file.replace(/\.md$/, "");
    const filePath = path.relative(process.cwd(), path.join(dirPath, file));

    return {
      slug,
      title: data.title || titleFromFilename(file),
      description: data.description || "",
      content,
      order: data.order ? parseInt(data.order, 10) : orderFromFilename(file),
      filePath,
    };
  }).sort((a, b) => a.order - b.order);
}

/** Load a section: top-level .md files become pages, subdirectories become sub-sections */
function loadSection(dirRelative: string, title: string): DocSection | null {
  const dirPath = path.join(CONTENT_ROOT, dirRelative);
  if (!fs.existsSync(dirPath)) return null;

  const pages = readPages(dirPath);
  const sectionSlug = dirRelative.replace(/\//g, "-").replace(/^\d+\./, "");

  if (pages.length === 0) return null;
  return { slug: sectionSlug, title, pages };
}

/** Load sub-sections from subdirectories within a section */
function loadSectionWithSubs(
  dirRelative: string,
  title: string,
  subDirs: Record<string, string>
): DocSection[] {
  const results: DocSection[] = [];

  // Top-level pages
  const main = loadSection(dirRelative, title);
  if (main && main.pages.length > 0) results.push(main);

  // Sub-directories as separate sections
  for (const [sub, subTitle] of Object.entries(subDirs)) {
    const subSection = loadSection(`${dirRelative}/${sub}`, subTitle);
    if (subSection && subSection.pages.length > 0) results.push(subSection);
  }

  return results;
}

/** Categories with their sections */
export function getDocCategories(): DocCategory[] {
  const categories: DocCategory[] = [];

  // 1. Getting Started
  const gettingStarted: DocSection[] = [
    ...loadSectionWithSubs("ways-of-working/0.overview", "Overview", {}),
    ...loadSectionWithSubs("ways-of-working/7.spec-driven-development", "SDD Process", {}),
  ];
  if (gettingStarted.length > 0) {
    categories.push({
      slug: "getting-started",
      title: "Getting Started",
      sections: gettingStarted,
    });
  }

  // 2. Guides
  const guides: DocSection[] = [
    ...loadSectionWithSubs("ways-of-working/2.claude-code", "Claude Code", {
      "0.environment-setup": "Environment Setup",
      "advanced": "Advanced",
    }),
    ...loadSectionWithSubs("ways-of-working/6.linear", "Linear Workflow", {}),
    ...loadSectionWithSubs("ways-of-working/4.MCPs", "MCPs", {}),
  ];
  if (guides.length > 0) {
    categories.push({
      slug: "guides",
      title: "Guides",
      sections: guides,
    });
  }

  // 3. Reference
  const reference: DocSection[] = [
    ...loadSectionWithSubs("ways-of-working/tools", "Tools", {}),
    ...loadSectionWithSubs("architecture", "Architecture", {}),
  ];
  if (reference.length > 0) {
    categories.push({
      slug: "reference",
      title: "Reference",
      sections: reference,
    });
  }

  return categories;
}

/** Flat list of all sections (for backward compat) */
export function getDocSections(): DocSection[] {
  return getDocCategories().flatMap((c) => c.sections);
}

export function getDocPage(
  sectionSlug: string,
  pageSlug: string
): { section: DocSection; page: DocPage; category: DocCategory } | undefined {
  const categories = getDocCategories();

  for (const category of categories) {
    const section = category.sections.find((s) => s.slug === sectionSlug);
    if (!section) continue;

    const page = section.pages.find((p) => p.slug === pageSlug);
    if (!page) continue;

    return { section, page, category };
  }

  return undefined;
}
