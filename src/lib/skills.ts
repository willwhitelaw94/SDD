export type Skill = {
  name: string;
  description: string;
  phase: string;
  prefix: "speckit" | "trilogy" | "hod" | "dev" | "other";
  type: "core" | "support" | "contextual";
};

export type Phase = {
  id: string;
  title: string;
  gate?: string;
  gateNumber?: number;
  color: string;
  skills: Skill[];
};

export const PHASES: Phase[] = [
  {
    id: "research",
    title: "Research",
    color: "text-slate-500 bg-slate-500/10 border-slate-500/20",
    skills: [
      { name: "trilogy-research", description: "Spawn parallel agents to gather context from Linear, Teams, Fireflies, and codebase", phase: "research", prefix: "trilogy", type: "core" },
      { name: "trilogy-learn", description: "Interactive context loading — ask what you want to learn from Features, Code, Teams, Linear, Fireflies", phase: "research", prefix: "trilogy", type: "core" },
      { name: "trilogy-teams-chat", description: "Fetch and analyze Teams chat by URL — extracts decisions, action items, discussions", phase: "research", prefix: "trilogy", type: "support" },
      { name: "teams-chat-summarizer", description: "Structured analysis of Teams chat history to extract key decisions and progress updates", phase: "research", prefix: "other", type: "support" },
      { name: "trilogy-brp", description: "Plan and prepare Big Room Planning sessions with context from last BRP and roadmap", phase: "research", prefix: "trilogy", type: "support" },
    ],
  },
  {
    id: "ideation",
    title: "Ideation",
    gate: "Idea Gate",
    gateNumber: 0,
    color: "text-pink-500 bg-pink-500/10 border-pink-500/20",
    skills: [
      { name: "trilogy-idea", description: "Create publication-ready idea briefs for new features or epics", phase: "ideation", prefix: "trilogy", type: "core" },
      { name: "trilogy-idea-spawn", description: "Generate an interactive ideas board from an idea brief and meeting transcript", phase: "ideation", prefix: "trilogy", type: "support" },
      { name: "hod-problem-statement", description: "Transform messy context into clear, solution-agnostic problem statements", phase: "ideation", prefix: "hod", type: "core" },
      { name: "hod-hmw", description: "Generate 'How Might We' prompts that reframe problems as creative opportunities", phase: "ideation", prefix: "hod", type: "support" },
      { name: "hod-humanise", description: "Transform technical PRDs into designer-friendly documentation using plain language", phase: "ideation", prefix: "hod", type: "support" },
      { name: "trilogy-raci", description: "Create RACI matrices to define roles, decision authority, and responsibilities", phase: "ideation", prefix: "trilogy", type: "support" },
    ],
  },
  {
    id: "spec",
    title: "Specification",
    gate: "Business Gate",
    gateNumber: 1,
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    skills: [
      { name: "speckit-specify", description: "Generate publication-ready feature specifications from user descriptions", phase: "spec", prefix: "speckit", type: "core" },
      { name: "trilogy-clarify", description: "Run specs through stakeholder lenses (spec, business, development, db) to catch blind spots", phase: "spec", prefix: "trilogy", type: "core" },
      { name: "speckit-checklist", description: "Generate requirements quality checklists — unit tests for English specifications", phase: "spec", prefix: "speckit", type: "support" },
    ],
  },
  {
    id: "design",
    title: "Design",
    gate: "Design Gate",
    gateNumber: 2,
    color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    skills: [
      { name: "trilogy-design-kickoff", description: "Kick off design phase and create design.md — UX decisions, UI patterns, components, accessibility", phase: "design", prefix: "trilogy", type: "core" },
      { name: "trilogy-mockup", description: "Generate 5-10 ASCII UI mockup variations to explore design options", phase: "design", prefix: "trilogy", type: "support" },
      { name: "trilogy-image", description: "Create visual assets for epics — hero images, storyboards, prompts", phase: "design", prefix: "trilogy", type: "support" },
      { name: "speckit-erd", description: "Generate Entity-Relationship Diagrams (ASCII and Mermaid) from db-spec", phase: "design", prefix: "speckit", type: "support" },
      { name: "trilogy-flow", description: "Generate user flow diagrams showing paths, decision points, and error handling", phase: "design", prefix: "trilogy", type: "support" },
    ],
  },
  {
    id: "planning",
    title: "Planning",
    gate: "Architecture Gate",
    gateNumber: 3,
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    skills: [
      { name: "speckit-plan", description: "Create technical implementation plans with architecture, phases, and constraints", phase: "planning", prefix: "speckit", type: "core" },
      { name: "speckit-tasks", description: "Generate implementation tasks organized by user story with dependencies", phase: "planning", prefix: "speckit", type: "core" },
      { name: "trilogy-estimate", description: "Estimate effort at any level — idea briefs (T-shirt), stories (days), tasks (points)", phase: "planning", prefix: "trilogy", type: "support" },
      { name: "speckit-analyze", description: "Identify inconsistencies, duplications, and gaps across spec artifacts", phase: "planning", prefix: "speckit", type: "support" },
      { name: "trilogy-raci", description: "Create RACI matrices to define roles, decision authority, and responsibilities", phase: "planning", prefix: "trilogy", type: "support" },
    ],
  },
  {
    id: "dev",
    title: "Implementation",
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    skills: [
      { name: "speckit-implement", description: "Execute implementation following tasks.md — interactive or autonomous Ralph mode", phase: "dev", prefix: "speckit", type: "core" },
      { name: "pest-testing", description: "PHP testing — write tests, debug failures, architecture testing, mocking", phase: "dev", prefix: "dev", type: "contextual" },
      { name: "inertia-vue-development", description: "Vue pages, forms, navigation, Inertia.js patterns", phase: "dev", prefix: "dev", type: "contextual" },
      { name: "tailwindcss-development", description: "CSS, responsive design, dark mode, Tailwind utilities", phase: "dev", prefix: "dev", type: "contextual" },
      { name: "pennant-development", description: "Feature toggles, A/B testing, conditional features", phase: "dev", prefix: "dev", type: "contextual" },
      { name: "playwright-browser", description: "Browser automation — UI testing, debugging frontend, web automation", phase: "dev", prefix: "dev", type: "contextual" },
    ],
  },
  {
    id: "review",
    title: "Code Review",
    gate: "Code Gate",
    gateNumber: 4,
    color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    skills: [
      { name: "trilogy-dev-pr", description: "Lint, format, simplify, type-check, test, run dev review, and create PR", phase: "review", prefix: "trilogy", type: "core" },
      { name: "trilogy-dev-handover", description: "Full Gate 4 validation with Linear transition (Dev → QA) and meta.yaml update", phase: "review", prefix: "trilogy", type: "core" },
      { name: "trilogy-dev-review", description: "Review changed files against Gate 3 and Gate 4 checklists", phase: "review", prefix: "trilogy", type: "support" },
      { name: "laravel-simplifier", description: "Simplify and refine PHP/Laravel code for clarity", phase: "review", prefix: "other", type: "support" },
    ],
  },
  {
    id: "qa",
    title: "QA",
    gate: "QA Gate",
    gateNumber: 5,
    color: "text-teal-500 bg-teal-500/10 border-teal-500/20",
    skills: [
      { name: "trilogy-qa", description: "Generate QA test plan from spec.md acceptance criteria — no browser needed", phase: "qa", prefix: "trilogy", type: "core" },
      { name: "trilogy-qa-test-agent", description: "Execute the test plan in the browser, fix failures, generate test-report.md with evidence", phase: "qa", prefix: "trilogy", type: "core" },
      { name: "trilogy-qa-test-codify", description: "Convert passing browser tests into deterministic Playwright E2E tests for CI", phase: "qa", prefix: "trilogy", type: "support" },
      { name: "trilogy-qa-handover", description: "Run Gate 5 checks, confirm no open Sev 1-3 issues, transition Linear to Release", phase: "qa", prefix: "trilogy", type: "core" },
    ],
  },
  {
    id: "release",
    title: "Release",
    gate: "Release Gate",
    gateNumber: 6,
    color: "text-green-500 bg-green-500/10 border-green-500/20",
    skills: [
      { name: "trilogy-ship", description: "Ship to production — analyze changes, Linear ticket, branch, commit, PR, changelog, tags", phase: "release", prefix: "trilogy", type: "core" },
      { name: "trilogy-release-notes", description: "Generate stakeholder-friendly release notes from spec and git history", phase: "release", prefix: "trilogy", type: "support" },
    ],
  },
  {
    id: "docs",
    title: "Documentation",
    color: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    skills: [
      { name: "trilogy-docs-build", description: "Build and preview the docs site", phase: "docs", prefix: "trilogy", type: "support" },
      { name: "trilogy-docs-write", description: "Structure guide for where to put docs — file conventions and placement", phase: "docs", prefix: "trilogy", type: "support" },
      { name: "trilogy-docs-feature", description: "Document feature domains by exploring codebase and synthesizing knowledge", phase: "docs", prefix: "trilogy", type: "support" },
    ],
  },
];

export function getAllSkills(): Skill[] {
  return PHASES.flatMap((p) => p.skills);
}

export function getSkillsByPrefix(prefix: string): Skill[] {
  return getAllSkills().filter((s) => s.prefix === prefix);
}

export const PREFIX_LABELS: Record<string, string> = {
  speckit: "SpecKit — Workflow",
  trilogy: "Trilogy — TC Portal",
  hod: "HOD — Design Thinking",
  dev: "Development — Contextual",
  other: "Other",
};
