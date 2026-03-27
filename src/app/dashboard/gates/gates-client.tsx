"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import type { Gate, FlatEpic } from "@/lib/gates";
import type { Initiative } from "@/lib/initiatives";
import { InternalHeader } from "@/components/internal-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CircleCheckIcon,
  SmartphoneIcon,
  CodeIcon,
  PaletteIcon,
  FileTextIcon,
  TestTubeIcon,
  RocketIcon,
  LightbulbIcon,
  SearchIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  FilterIcon,
  ShieldCheckIcon,
} from "lucide-react";

/* ── Constants ── */

const INITIATIVE_COLORS: Record<string, string> = {
  "Budgets-And-Finance": "bg-amber-500",
  "Clinical-And-Care-Plan": "bg-rose-500",
  "Consumer-Lifecycle": "bg-blue-500",
  "Consumer-Mobile": "bg-violet-500",
  "Coordinator-Management": "bg-emerald-500",
  Infrastructure: "bg-slate-500",
  "Supplier-Management": "bg-orange-500",
  "Work-Management": "bg-cyan-500",
  ADHOC: "bg-pink-500",
};

const GATE_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  idea: LightbulbIcon,
  spec: FileTextIcon,
  design: PaletteIcon,
  architecture: ShieldCheckIcon,
  "code-quality": CodeIcon,
  qa: TestTubeIcon,
  release: RocketIcon,
};

/** Teal-to-emerald gradient for gate progression */
const GATE_NODE_COLORS: Record<string, string> = {
  idea: "from-teal-500 to-teal-400",
  spec: "from-teal-400 to-cyan-400",
  design: "from-cyan-400 to-sky-400",
  architecture: "from-sky-400 to-blue-400",
  "code-quality": "from-blue-400 to-indigo-400",
  qa: "from-indigo-400 to-emerald-400",
  release: "from-emerald-400 to-emerald-500",
};

const GATE_RING_COLORS: Record<string, string> = {
  idea: "ring-teal-500/30",
  spec: "ring-teal-400/30",
  design: "ring-cyan-400/30",
  architecture: "ring-sky-400/30",
  "code-quality": "ring-blue-400/30",
  qa: "ring-indigo-400/30",
  release: "ring-emerald-400/30",
};

/* ── Pipeline node ── */

function PipelineNode({
  gate,
  epicCount,
  isSelected,
  onSelect,
  index,
}: {
  gate: Gate;
  epicCount: number;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}) {
  const Icon = GATE_ICONS[gate.id] || CircleCheckIcon;
  const hasEpics = epicCount > 0;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 26,
        delay: index * 0.06,
      }}
      className={cn(
        "group relative flex flex-col items-center gap-2 outline-none",
        "focus-visible:outline-none"
      )}
    >
      {/* Node circle */}
      <div
        className={cn(
          "relative flex size-14 items-center justify-center rounded-full bg-gradient-to-br transition-all duration-300",
          GATE_NODE_COLORS[gate.id],
          isSelected && "ring-4 scale-110",
          isSelected && GATE_RING_COLORS[gate.id],
          !isSelected && "hover:scale-105 hover:shadow-lg"
        )}
      >
        <span className="text-lg font-bold text-white">{gate.number}</span>

        {/* Subtle pulse for gates with epics */}
        {hasEpics && !isSelected && (
          <span
            className={cn(
              "absolute inset-0 rounded-full bg-gradient-to-br opacity-40 animate-ping",
              GATE_NODE_COLORS[gate.id]
            )}
            style={{ animationDuration: "3s" }}
          />
        )}
      </div>

      {/* Label */}
      <div className="flex flex-col items-center gap-0.5">
        <span
          className={cn(
            "text-xs font-medium transition-colors",
            isSelected ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {gate.title}
        </span>
        <Badge
          variant={isSelected ? "default" : "secondary"}
          className="text-[10px]"
        >
          {epicCount}
        </Badge>
      </div>
    </motion.button>
  );
}

/* ── Pipeline connector ── */

function PipelineConnector({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 26,
        delay: index * 0.06 + 0.03,
      }}
      className="hidden sm:flex items-center self-start mt-7"
    >
      <div className="h-px w-6 bg-border md:w-10" />
      <ArrowRightIcon className="size-3 -ml-1.5 text-muted-foreground/50" />
    </motion.div>
  );
}

/* ── Gate detail section card ── */

function SectionCard({ section }: { section: Gate["sections"][number] }) {
  const hasThreeCol = section.checks.some((c) => c.how || c.passCriteria);

  return (
    <Card
      className={cn(
        "shadow-none",
        section.isMobile && "border-l-2 border-l-violet-500"
      )}
    >
      <CardContent className="p-4">
        <div className="mb-3 flex items-center gap-2">
          {section.isMobile && (
            <SmartphoneIcon className="size-4 text-violet-500" />
          )}
          <h4 className="text-sm font-semibold">{section.title}</h4>
          {section.isMobile && (
            <Badge variant="secondary" className="text-[10px] text-violet-500">
              Mobile
            </Badge>
          )}
        </div>

        <div className="space-y-1.5">
          {/* Header */}
          <div
            className={cn(
              "grid gap-3 text-[10px] font-medium uppercase tracking-wide text-muted-foreground px-2",
              hasThreeCol ? "grid-cols-3" : "grid-cols-2"
            )}
          >
            <span>{hasThreeCol ? "What's Checked" : "What's Checked"}</span>
            <span>{hasThreeCol ? "How" : "Why"}</span>
            {hasThreeCol && <span>Pass Criteria</span>}
          </div>
          <Separator />

          {/* Rows */}
          {section.checks.map((check, i) => (
            <div
              key={i}
              className={cn(
                "grid gap-3 rounded-md px-2 py-1.5 text-xs transition-colors hover:bg-muted/50",
                hasThreeCol ? "grid-cols-3" : "grid-cols-2"
              )}
            >
              <span className="font-medium text-foreground flex items-start gap-1.5">
                <CircleCheckIcon className="size-3 mt-0.5 shrink-0 text-emerald-500" />
                {check.item}
              </span>
              <span className="text-muted-foreground">
                {hasThreeCol ? check.how : check.why}
              </span>
              {hasThreeCol && (
                <span className="text-muted-foreground">
                  {check.passCriteria}
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Epic card ── */

function EpicCard({ epic }: { epic: FlatEpic }) {
  return (
    <Card className="shadow-none border-border/40 transition-all hover:border-border hover:shadow-sm">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-1">
          {epic.prefix && (
            <Badge variant="secondary" className="text-[10px] font-mono shrink-0">
              {epic.prefix}
            </Badge>
          )}
          <span className="truncate text-sm font-medium">{epic.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "size-2 rounded-full shrink-0",
              INITIATIVE_COLORS[epic.initiativeSlug] || "bg-muted-foreground"
            )}
          />
          <span className="truncate text-xs text-muted-foreground">
            {epic.initiativeTitle}
          </span>
        </div>
        {epic.summary && (
          <p className="mt-1.5 text-xs text-muted-foreground/80 line-clamp-2">
            {epic.summary}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

/* ── Distribution bar ── */

function DistributionBar({
  gates,
  epicsByGate,
}: {
  gates: Gate[];
  epicsByGate: Record<string, FlatEpic[]>;
}) {
  const totalEpics = gates.reduce(
    (sum, g) => sum + (epicsByGate[g.id]?.length || 0),
    0
  );
  const backlogCount = epicsByGate["backlog"]?.length || 0;
  const releaseCount = epicsByGate["release"]?.length || 0;

  if (totalEpics + backlogCount === 0) return null;

  const grandTotal = totalEpics + backlogCount;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="text-sm font-semibold">{grandTotal}</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Backlog</span>
            <span className="text-sm font-medium text-muted-foreground">
              {backlogCount}
            </span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">In Flight</span>
            <span className="text-sm font-medium text-foreground">
              {totalEpics - releaseCount}
            </span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Released</span>
            <span className="text-sm font-medium text-emerald-500">
              {releaseCount}
            </span>
          </div>
        </div>
      </div>

      {/* Segmented bar */}
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted/50">
        {backlogCount > 0 && (
          <Tooltip>
            <TooltipTrigger
              className="h-full bg-zinc-400/50 transition-all hover:brightness-110"
              style={{ width: `${(backlogCount / grandTotal) * 100}%` }}
            />
            <TooltipContent side="top" className="text-xs">
              Backlog: {backlogCount} epics
            </TooltipContent>
          </Tooltip>
        )}
        {gates.map((gate) => {
          const count = epicsByGate[gate.id]?.length || 0;
          if (count === 0) return null;
          return (
            <Tooltip key={gate.id}>
              <TooltipTrigger
                className={cn(
                  "h-full bg-gradient-to-r transition-all hover:brightness-110",
                  GATE_NODE_COLORS[gate.id]
                )}
                style={{ width: `${(count / grandTotal) * 100}%` }}
              />
              <TooltipContent side="top" className="text-xs">
                {gate.title}: {count} epic{count !== 1 ? "s" : ""}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {backlogCount > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-zinc-400/50" />
            <span className="text-[10px] text-muted-foreground">
              Backlog ({backlogCount})
            </span>
          </div>
        )}
        {gates.map((gate) => {
          const count = epicsByGate[gate.id]?.length || 0;
          if (count === 0) return null;
          return (
            <div key={gate.id} className="flex items-center gap-1.5">
              <span
                className={cn(
                  "size-2 rounded-full bg-gradient-to-r",
                  GATE_NODE_COLORS[gate.id]
                )}
              />
              <span className="text-[10px] text-muted-foreground">
                {gate.title} ({count})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Gate detail panel ── */

function GateDetail({
  gate,
  epics,
  mobileOnly,
}: {
  gate: Gate;
  epics: FlatEpic[];
  mobileOnly: boolean;
}) {
  const Icon = GATE_ICONS[gate.id] || CircleCheckIcon;
  const filteredSections = mobileOnly
    ? gate.sections.filter((s) => s.isMobile)
    : gate.sections;

  return (
    <motion.div
      key={gate.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="space-y-6"
    >
      {/* Gate header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br",
              GATE_NODE_COLORS[gate.id]
            )}
          >
            <Icon className="size-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Gate {gate.number}: {gate.title}
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground italic">
              &ldquo;{gate.question}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Metadata row */}
      <div className="flex flex-wrap gap-3">
        <Badge variant="outline" className="text-xs">
          {gate.owner}
        </Badge>
        {gate.skill && (
          <Badge variant="secondary" className="text-xs font-mono">
            {gate.skill}
          </Badge>
        )}
        <Badge variant="secondary" className="text-xs">
          {gate.linearTransition}
        </Badge>
      </div>

      <Separator />

      {/* Sections */}
      {filteredSections.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Checklist
          </h3>
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredSections.map((section, i) => (
              <SectionCard key={i} section={section} />
            ))}
          </div>
        </div>
      ) : (
        mobileOnly && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No mobile-specific checks for this gate.
          </p>
        )
      )}

      {/* Failed advice */}
      {gate.failedAdvice && (
        <Card className="shadow-none border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">
              What if it fails?
            </p>
            <p className="text-sm text-muted-foreground">
              {gate.failedAdvice}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Epics at this gate */}
      {epics.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Epics at this gate
            </h3>
            <Badge variant="secondary" className="text-[10px]">
              {epics.length}
            </Badge>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {epics.map((epic) => (
              <EpicCard key={`${epic.initiativeSlug}-${epic.slug}`} epic={epic} />
            ))}
          </div>
        </div>
      )}

      {epics.length === 0 && (
        <div className="rounded-lg border border-dashed border-border/50 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            No epics currently at this gate.
          </p>
        </div>
      )}
    </motion.div>
  );
}

/* ── Main component ── */

export function GatesClient({
  gates,
  epicsByGate,
  initiatives,
}: {
  gates: Gate[];
  epicsByGate: Record<string, FlatEpic[]>;
  initiatives: Initiative[];
}) {
  const [selectedGateId, setSelectedGateId] = useState<string>(
    gates[0]?.id || "idea"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOnly, setMobileOnly] = useState(false);

  const selectedGate = gates.find((g) => g.id === selectedGateId) || gates[0];

  // Filter gates by search query
  const filteredGates = useMemo(() => {
    if (!searchQuery) return gates;
    const q = searchQuery.toLowerCase();
    return gates.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.question.toLowerCase().includes(q) ||
        g.owner.toLowerCase().includes(q) ||
        g.sections.some(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.checks.some(
              (c) =>
                c.item.toLowerCase().includes(q) ||
                c.why.toLowerCase().includes(q)
            )
        )
    );
  }, [gates, searchQuery]);

  // Get epics for the selected gate, optionally filtered by search
  const selectedEpics = useMemo(() => {
    const epics = epicsByGate[selectedGateId] || [];
    if (!searchQuery) return epics;
    const q = searchQuery.toLowerCase();
    return epics.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.initiativeTitle.toLowerCase().includes(q) ||
        (e.prefix && e.prefix.toLowerCase().includes(q))
    );
  }, [epicsByGate, selectedGateId, searchQuery]);

  const totalEpics = Object.values(epicsByGate).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  // Check if selected gate is still in filtered results
  const isSelectedVisible = filteredGates.some(
    (g) => g.id === selectedGateId
  );

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Sticky header */}
      <InternalHeader>
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <a
            href="/dashboard"
            className="rounded-md px-2 py-1 transition-colors hover:text-foreground"
          >
            Initiatives
          </a>
          <ChevronRightIcon className="size-3.5" />
          <span className="font-medium text-foreground">Quality Gates</span>
        </nav>
      </InternalHeader>

      {/* Content */}
      <div className="flex-1 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-6xl">
          {/* Page title */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Gates Explorer
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                7 quality gates &middot; {totalEpics} epics in the pipeline
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileOnly((m) => !m)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                  mobileOnly
                    ? "bg-violet-500/10 text-violet-500"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <FilterIcon className="size-3.5" />
                Mobile only
              </button>
              <div className="relative w-full sm:w-64">
                <SearchIcon className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search gates & checks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-full rounded-lg border border-input/50 bg-muted/50 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
              </div>
            </div>
          </div>

          {/* Pipeline visualization */}
          <Card className="mb-6 shadow-none">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-start justify-center gap-2 sm:gap-0">
                {filteredGates.map((gate, i) => (
                  <div key={gate.id} className="flex items-start">
                    <PipelineNode
                      gate={gate}
                      epicCount={epicsByGate[gate.id]?.length || 0}
                      isSelected={gate.id === selectedGateId}
                      onSelect={() => setSelectedGateId(gate.id)}
                      index={i}
                    />
                    {i < filteredGates.length - 1 && (
                      <PipelineConnector index={i} />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Distribution bar */}
          <Card className="mb-6 shadow-none">
            <CardContent className="p-4">
              <DistributionBar gates={gates} epicsByGate={epicsByGate} />
            </CardContent>
          </Card>

          {/* Gate detail panel */}
          <AnimatePresence mode="wait">
            {selectedGate && isSelectedVisible && (
              <GateDetail
                gate={selectedGate}
                epics={selectedEpics}
                mobileOnly={mobileOnly}
              />
            )}
          </AnimatePresence>

          {!isSelectedVisible && searchQuery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <p className="text-sm text-muted-foreground">
                No gates match &ldquo;{searchQuery}&rdquo;
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
