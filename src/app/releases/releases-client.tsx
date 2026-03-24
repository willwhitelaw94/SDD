"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import type { Release } from "@/lib/releases";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeftIcon,
  SearchIcon,
  ZapIcon,
  AlertTriangleIcon,
  FlameIcon,
} from "lucide-react";

const impactConfig: Record<
  string,
  { label: string; color: string; icon: React.ComponentType<{ className?: string }> }
> = {
  high: { label: "High Impact", color: "bg-red-500/10 text-red-500 border-red-500/20", icon: FlameIcon },
  medium: { label: "Medium Impact", color: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: AlertTriangleIcon },
  low: { label: "Low Impact", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: ZapIcon },
};

export function ReleasesTimeline({
  releases,
  renderedContent,
}: {
  releases: Release[];
  renderedContent: Record<string, React.ReactNode>;
}) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [impactFilter, setImpactFilter] = useState<string | null>(null);

  const selectedRelease = selectedSlug
    ? releases.find((r) => r.slug === selectedSlug) ?? null
    : null;

  const filtered = releases.filter((r) => {
    if (impactFilter && r.impact !== impactFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.version.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 md:py-16">
      <AnimatePresence mode="wait">
        {selectedRelease ? (
          <motion.div
            key={`release-${selectedRelease.slug}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
          >
            <button
              type="button"
              onClick={() => setSelectedSlug(null)}
              className="mb-6 flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <ArrowLeftIcon className="size-3.5" />
              All Releases
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className="font-mono text-xs">
                  {selectedRelease.version}
                </Badge>
                {impactConfig[selectedRelease.impact] && (
                  <Badge
                    variant="outline"
                    className={cn("text-xs", impactConfig[selectedRelease.impact].color)}
                  >
                    {impactConfig[selectedRelease.impact].label}
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                {selectedRelease.title}
              </h1>
              {selectedRelease.description && (
                <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                  {selectedRelease.description}
                </p>
              )}
            </div>

            <Card className="shadow-none">
              <CardContent className="p-6 sm:p-8">
                <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h2:text-lg prose-h3:text-base prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-primary prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-hr:border-border prose-table:text-sm prose-th:text-left prose-th:font-medium">
                  {renderedContent[selectedRelease.slug]}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="releases-list"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
          >
            {/* Header */}
            <div className="mb-8 space-y-3 text-center md:mb-12">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Release Notes
              </h1>
              <p className="text-muted-foreground text-lg">
                What&apos;s been shipped, fixed, and improved.
              </p>
            </div>

            {/* Search + Filter */}
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:w-72">
                <SearchIcon className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search releases..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-full rounded-lg border border-input/50 bg-muted/50 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div className="flex items-center gap-1 rounded-lg border p-0.5">
                <button
                  onClick={() => setImpactFilter(null)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                    !impactFilter
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  All
                </button>
                {(["high", "medium", "low"] as const).map((level) => {
                  const cfg = impactConfig[level];
                  return (
                    <button
                      key={level}
                      onClick={() => setImpactFilter(impactFilter === level ? null : level)}
                      className={cn(
                        "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                        impactFilter === level
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              {filtered.length === 0 && (
                <p className="py-12 text-center text-sm text-muted-foreground">
                  No releases match your search.
                </p>
              )}
              {filtered.map((release, index) => {
                const impact = impactConfig[release.impact] || impactConfig.low;
                const ImpactIcon = impact.icon;
                const date = release.date
                  ? new Date(release.date).toLocaleDateString("en-AU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "";

                return (
                  <motion.div
                    key={release.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 300,
                      damping: 26,
                    }}
                    className="relative flex gap-3 md:gap-6"
                  >
                    {/* Left column — version + date (desktop) */}
                    <div className="sticky top-20 hidden w-32 shrink-0 self-start pt-1 text-right md:block">
                      <Badge
                        variant="outline"
                        className="mb-1 font-mono text-xs"
                      >
                        {release.version}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{date}</p>
                    </div>

                    {/* Timeline dot + line */}
                    <div className="flex flex-col items-center">
                      <div className="sticky top-20 z-10 flex size-6 items-center justify-center">
                        <span className="bg-primary/20 flex size-4.5 shrink-0 items-center justify-center rounded-full">
                          <span className="bg-primary size-3 rounded-full" />
                        </span>
                      </div>
                      {index < filtered.length - 1 && (
                        <span className="-mt-2.5 w-px flex-1 border-l border-border" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-10 pl-1 md:pl-3">
                      {/* Mobile version + date */}
                      <div className="mb-2 flex items-center gap-2 md:hidden">
                        <Badge variant="outline" className="font-mono text-xs">
                          {release.version}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {date}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedSlug(release.slug)}
                        className="group w-full text-left"
                      >
                        <Card className="shadow-none transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
                          <CardContent className="p-4 sm:p-5">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <h3 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors">
                                {release.title}
                              </h3>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "shrink-0 text-[10px]",
                                  impact.color
                                )}
                              >
                                <ImpactIcon className="size-3" />
                                {impact.label}
                              </Badge>
                            </div>
                            {release.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {release.description}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
