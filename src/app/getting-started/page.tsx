"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MotionPreset } from "@/components/ui/motion-preset";
import {
  CodeIcon,
  PaletteIcon,
  ClipboardListIcon,
  ArrowLeftIcon,
  ClockIcon,
  BookOpenIcon,
  ArrowRightIcon,
  UsersIcon,
} from "lucide-react";

type Role = "developer" | "designer" | "pm";

type Step = {
  title: string;
  href: string;
  description: string;
  readTime: string;
};

const roles: {
  id: Role;
  title: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "developer",
    title: "Developer",
    description: "I write code and build features",
    icon: <CodeIcon className="size-6" />,
  },
  {
    id: "designer",
    title: "Designer",
    description: "I create designs and user experiences",
    icon: <PaletteIcon className="size-6" />,
  },
  {
    id: "pm",
    title: "PM / Stakeholder",
    description: "I manage projects and define requirements",
    icon: <ClipboardListIcon className="size-6" />,
  },
];

const readingPaths: Record<Role, Step[]> = {
  developer: [
    {
      title: "SDD Process Overview",
      href: "/docs/ways-of-working-7.spec-driven-development/00-spec-driven-development",
      description:
        "Understand the full Story-Driven Development lifecycle — the methodology behind every feature we ship.",
      readTime: "5 min",
    },
    {
      title: "Claude Code Setup",
      href: "/docs/ways-of-working-2.claude-code/01-what-is-claude-code",
      description:
        "Get your AI-assisted development environment configured and learn how Claude Code accelerates your workflow.",
      readTime: "4 min",
    },
    {
      title: "Linear Workflow",
      href: "/docs/ways-of-working-6.linear/01-walkthrough",
      description:
        "Learn how we track work in Linear — from issue creation through to delivery and release.",
      readTime: "3 min",
    },
    {
      title: "Architecture Overview",
      href: "/docs/architecture/0.overview",
      description:
        "Get familiar with the system architecture, services, and how everything fits together.",
      readTime: "6 min",
    },
    {
      title: "MCP Servers",
      href: "/docs/ways-of-working-4.MCPs/01-overview",
      description:
        "Discover the Model Context Protocol servers we use and how they integrate into the development process.",
      readTime: "3 min",
    },
  ],
  designer: [
    {
      title: "SDD Process Overview",
      href: "/docs/ways-of-working-7.spec-driven-development/00-spec-driven-development",
      description:
        "Understand the full Story-Driven Development lifecycle and where design fits into each step.",
      readTime: "5 min",
    },
    {
      title: "Design and Mockups (Step 3)",
      href: "/process",
      description:
        "See how designs and mockups are created as part of the SDD process, with video walkthroughs of each step.",
      readTime: "4 min",
    },
    {
      title: "Everyone Can Ship",
      href: "/docs/ways-of-working-0.overview/01-everyone-can-ship",
      description:
        "Learn about the paradigm shift that empowers everyone on the team — including designers — to ship work.",
      readTime: "3 min",
    },
    {
      title: "Speccing Stories",
      href: "/docs/ways-of-working-7.spec-driven-development/01-workflow-map",
      description:
        "Understand how user stories are specced with acceptance criteria, edge cases, and design requirements.",
      readTime: "4 min",
    },
    {
      title: "Design System",
      href: "/design-system",
      description:
        "Explore the living design system — interactive component showcases, tokens, and patterns we use across products.",
      readTime: "5 min",
    },
  ],
  pm: [
    {
      title: "SDD Process Overview",
      href: "/docs/ways-of-working-7.spec-driven-development/00-spec-driven-development",
      description:
        "Understand the full Story-Driven Development lifecycle and how to guide features from idea to delivery.",
      readTime: "5 min",
    },
    {
      title: "Speccing Stories",
      href: "/docs/ways-of-working-7.spec-driven-development/01-workflow-map",
      description:
        "Learn how to break ideas into well-specced stories with clear acceptance criteria and dependencies.",
      readTime: "4 min",
    },
    {
      title: "Linear Workflow",
      href: "/docs/ways-of-working-6.linear/01-walkthrough",
      description:
        "Understand the project management workflow in Linear — statuses, cycles, and how work moves through the pipeline.",
      readTime: "3 min",
    },
    {
      title: "Releases",
      href: "/releases",
      description:
        "See how releases are tracked and communicated, with video walkthroughs sent to stakeholders.",
      readTime: "3 min",
    },
    {
      title: "Review & QA Process",
      href: "/process",
      description:
        "Watch the full review, QA, and sign-off process — including how the final walkthrough is delivered to the business.",
      readTime: "4 min",
    },
  ],
};

const roleLabels: Record<Role, string> = {
  developer: "Developer",
  designer: "Designer",
  pm: "PM / Stakeholder",
};

// ---------------------------------------------------------------------------
// Persona recommendations per role
// ---------------------------------------------------------------------------

type PersonaRef = {
  slug: string;
  title: string;
  summary: string;
  relatedDoc?: { label: string; href: string };
};

const allPersonas: Record<string, PersonaRef> = {
  participant: {
    slug: "participant",
    title: "Participant",
    summary: "Older Australians receiving funded aged care services through Support at Home",
    relatedDoc: { label: "Architecture Overview", href: "/docs/architecture/0.overview" },
  },
  "care-coordinator": {
    slug: "care-coordinator",
    title: "Care Coordinator",
    summary: "Frontline staff handling day-to-day calls, notes, and direct participant contact",
    relatedDoc: { label: "Linear Workflow", href: "/docs/ways-of-working-6.linear/01-walkthrough" },
  },
  "care-partner": {
    slug: "care-partner",
    title: "Care Partner",
    summary: "Case management, approvals, budget oversight, and complex case decisions",
    relatedDoc: { label: "SDD Process", href: "/docs/ways-of-working-7.spec-driven-development/00-spec-driven-development" },
  },
  supplier: {
    slug: "supplier",
    title: "Supplier",
    summary: "Third-party providers delivering care services to participants",
    relatedDoc: { label: "Architecture Overview", href: "/docs/architecture/0.overview" },
  },
  "registered-supporter": {
    slug: "registered-supporter",
    title: "Registered Supporter",
    summary: "Family members and advocates supporting older people with aged care decisions",
  },
  assessor: {
    slug: "assessor",
    title: "Assessor",
    summary: "Healthcare professionals determining eligibility and classification levels",
    relatedDoc: { label: "Architecture Overview", href: "/docs/architecture/0.overview" },
  },
  administrator: {
    slug: "administrator",
    title: "Administrator",
    summary: "Operations and finance staff managing provider-level functions",
  },
  "bill-processor": {
    slug: "bill-processor",
    title: "Bill Processor",
    summary: "Invoice processing specialists managing the supplier bill lifecycle",
  },
  "collections-team": {
    slug: "collections-team",
    title: "Collections Team",
    summary: "Finance specialists managing direct debit and accounts receivable",
  },
};

const personasByRole: Record<Role, { essential: string[]; secondary: string[] }> = {
  developer: {
    essential: ["participant", "care-coordinator", "care-partner", "supplier"],
    secondary: ["assessor", "administrator", "bill-processor", "registered-supporter", "collections-team"],
  },
  designer: {
    essential: ["participant", "registered-supporter", "care-coordinator", "supplier"],
    secondary: ["care-partner", "assessor", "administrator", "bill-processor", "collections-team"],
  },
  pm: {
    essential: ["participant", "care-partner", "care-coordinator", "assessor"],
    secondary: ["supplier", "administrator", "bill-processor", "registered-supporter", "collections-team"],
  },
};

const VALID_ROLES = new Set<string>(["developer", "designer", "pm"]);

export default function GettingStartedPage() {
  return (
    <Suspense>
      <GettingStartedContent />
    </Suspense>
  );
}

function GettingStartedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const roleParam = searchParams.get("role");
  const selectedRole: Role | null =
    roleParam && VALID_ROLES.has(roleParam) ? (roleParam as Role) : null;

  function setSelectedRole(role: Role | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (role) {
      params.set("role", role);
    } else {
      params.delete("role");
    }
    router.push(`/getting-started?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
        {/* Header */}
        <MotionPreset
          fade
          blur
          slide={{ direction: "up", offset: 30 }}
          delay={0}
        >
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">
              Onboarding
            </Badge>
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
              Welcome to SDD
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {selectedRole
                ? `Here's your curated reading path as a ${roleLabels[selectedRole]}.`
                : "Let's get you up to speed. What's your role?"}
            </p>
          </div>
        </MotionPreset>

        {!selectedRole ? (
          /* ── Role Selection ── */
          <div className="grid gap-6 sm:grid-cols-3">
            {roles.map((role, index) => (
              <MotionPreset
                key={role.id}
                fade
                slide={{ direction: "up", offset: 40 }}
                delay={index * 0.1}
              >
                <Card
                  className="group cursor-pointer border-border/50 p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/30"
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/20">
                      {role.icon}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold tracking-tight">
                        {role.title}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {role.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </MotionPreset>
            ))}
          </div>
        ) : (
          /* ── Reading Path ── */
          <div>
            <MotionPreset fade slide={{ direction: "up", offset: 20 }} delay={0}>
              <button
                onClick={() => setSelectedRole(null)}
                className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeftIcon className="size-4" />
                Back to roles
              </button>
            </MotionPreset>

            <div className="space-y-0">
              {readingPaths[selectedRole].map((step, index) => (
                <div key={step.title}>
                  <MotionPreset
                    fade
                    slide={{ direction: "up", offset: 40 }}
                    delay={index * 0.08}
                    inViewMargin="-50px"
                  >
                    <Link href={step.href} className="group/step block">
                      <Card className="border-border/50 p-0 transition-all duration-300 hover:shadow-lg hover:border-primary/30">
                        <div className="p-6">
                          <div className="flex items-start gap-4">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-sm font-semibold text-primary-foreground">
                              {index + 1}
                            </span>
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h2 className="text-xl font-semibold tracking-tight group-hover/step:text-primary transition-colors">
                                  {step.title}
                                </h2>
                                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                  <ClockIcon className="size-3" />
                                  {step.readTime}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {step.description}
                              </p>
                            </div>
                            <ArrowRightIcon className="mt-1 size-4 shrink-0 text-muted-foreground/50 transition-transform duration-200 group-hover/step:translate-x-1 group-hover/step:text-primary" />
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </MotionPreset>

                  {index < readingPaths[selectedRole].length - 1 && (
                    <MotionPreset fade delay={index * 0.08 + 0.1}>
                      <div className="flex justify-center py-3">
                        <Separator
                          orientation="vertical"
                          className="h-6 w-px bg-border"
                        />
                      </div>
                    </MotionPreset>
                  )}
                </div>
              ))}
            </div>

            {/* ── Domain Personas ── */}
            <MotionPreset
              fade
              slide={{ direction: "up", offset: 30 }}
              delay={0.4}
            >
              <div className="mt-16">
                <Separator className="mb-12" />
                <div className="mb-8 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <UsersIcon className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Meet the people you&apos;re building for
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Understanding these personas will give you context for
                      every feature and decision.
                    </p>
                  </div>
                </div>

                {/* Essential personas */}
                <div className="mb-6">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Start here
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {personasByRole[selectedRole].essential.map((slug) => {
                      const p = allPersonas[slug];
                      return (
                        <Link
                          key={slug}
                          href={`/personas/${slug}`}
                          className="group/persona block"
                        >
                          <Card className="border-border/50 p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-md">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h3 className="font-medium transition-colors group-hover/persona:text-primary">
                                  {p.title}
                                </h3>
                                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                                  {p.summary}
                                </p>
                              </div>
                              <ArrowRightIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/40 transition-transform group-hover/persona:translate-x-0.5 group-hover/persona:text-primary" />
                            </div>
                            {p.relatedDoc && (
                              <Link
                                href={p.relatedDoc.href}
                                onClick={(e) => e.stopPropagation()}
                                className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground/50 transition-colors hover:text-primary"
                              >
                                <BookOpenIcon className="size-3" />
                                <span>
                                  Related: {p.relatedDoc.label}
                                </span>
                              </Link>
                            )}
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Secondary personas */}
                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Also relevant
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {personasByRole[selectedRole].secondary.map((slug) => {
                      const p = allPersonas[slug];
                      return (
                        <Link key={slug} href={`/personas/${slug}`}>
                          <Badge
                            variant="outline"
                            className="cursor-pointer transition-colors hover:bg-muted hover:text-foreground"
                          >
                            {p.title}
                          </Badge>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </MotionPreset>

            {/* CTA */}
            <MotionPreset
              fade
              slide={{ direction: "up", offset: 20 }}
              delay={0.5}
            >
              <div className="mt-16 flex justify-center gap-3">
                <Button size="lg" variant="outline" render={<Link href="/personas" />}>
                  <UsersIcon className="size-4" />
                  All Personas
                </Button>
                <Button size="lg" render={<Link href="/docs" />}>
                  <BookOpenIcon className="size-4" />
                  Go to Docs
                </Button>
              </div>
            </MotionPreset>
          </div>
        )}
      </div>
    </div>
  );
}
