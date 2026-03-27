"use client";

import { useMemo, useState, useCallback, useRef } from "react";
import type { DragEvent } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { Initiative, Epic } from "@/lib/initiatives";
import type { StrategicContext } from "@/lib/strategy";
import { InternalHeader } from "@/components/internal-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  LayoutGridIcon,
  CalendarDaysIcon,
  SearchIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  TargetIcon,
  UsersIcon,
  LayersIcon,
  BanknoteIcon,
  FilterIcon,
} from "lucide-react";

/* ── Constants ── */

const GATE_ORDER = ["idea", "spec", "design", "dev", "qa"] as const;

type PriorityColumn = "P0" | "P1" | "P2" | "P3" | "P4" | "unranked";

const PRIORITY_COLUMNS: {
  id: PriorityColumn;
  label: string;
  dotColor: string;
  bgTint: string;
}[] = [
  { id: "P0", label: "Urgent", dotColor: "bg-rose-500", bgTint: "bg-rose-500/5" },
  { id: "P1", label: "High", dotColor: "bg-red-500", bgTint: "bg-red-500/5" },
  { id: "P2", label: "Medium", dotColor: "bg-amber-500", bgTint: "bg-amber-500/5" },
  { id: "P3", label: "Low", dotColor: "bg-emerald-500", bgTint: "bg-emerald-500/5" },
  { id: "P4", label: "Backlog", dotColor: "bg-slate-500", bgTint: "bg-slate-500/5" },
  { id: "unranked", label: "Unranked", dotColor: "bg-zinc-500", bgTint: "bg-zinc-500/5" },
];

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

const INITIATIVE_BAR_COLORS: Record<string, string> = {
  "Budgets-And-Finance": "bg-amber-500/80",
  "Clinical-And-Care-Plan": "bg-rose-500/80",
  "Consumer-Lifecycle": "bg-blue-500/80",
  "Consumer-Mobile": "bg-violet-500/80",
  "Coordinator-Management": "bg-emerald-500/80",
  Infrastructure: "bg-slate-500/80",
  "Supplier-Management": "bg-orange-500/80",
  "Work-Management": "bg-cyan-500/80",
  ADHOC: "bg-pink-500/80",
};

/* ── Helpers ── */

function normalizePriority(raw?: string): PriorityColumn {
  if (!raw) return "unranked";
  const v = raw.trim().toLowerCase();
  if (v === "p0" || v === "urgent") return "P0";
  if (v === "p1" || v === "high") return "P1";
  if (v === "p2" || v === "medium") return "P2";
  if (v === "p3" || v === "low") return "P3";
  if (v === "p4" || v === "nth" || v === "backlog") return "P4";
  return "unranked";
}

function getGateDates(epic: Epic): { first: string | null; last: string | null } {
  let first: string | null = null;
  let last: string | null = null;
  for (const gateId of GATE_ORDER) {
    const gate = epic.gates[gateId];
    if (gate?.date) {
      if (!first) first = gate.date;
      last = gate.date;
    }
  }
  return { first, last };
}

function parseMonth(dateStr: string): number {
  const d = new Date(dateStr);
  return d.getFullYear() * 12 + d.getMonth();
}

function monthLabel(monthIndex: number): string {
  const year = Math.floor(monthIndex / 12);
  const month = monthIndex % 12;
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${names[month]} ${year}`;
}

type FlatEpic = Epic & {
  initiativeTitle: string;
  initiativeSlug: string;
  priorityCol: PriorityColumn;
};

/* ── Gate dots component ── */

function GateDots({ epic }: { epic: Epic }) {
  return (
    <div className="flex items-center gap-1">
      {GATE_ORDER.map((gateId) => {
        const passed = epic.gates[gateId]?.passed === true;
        return (
          <Tooltip key={gateId}>
            <TooltipTrigger>
              <span
                className={cn(
                  "block size-1.5 rounded-full",
                  passed ? "bg-emerald-500" : "bg-muted-foreground/30",
                )}
              />
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs capitalize">
              {gateId} {passed ? "(passed)" : ""}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}

/* ── Epic card for Kanban ── */

function EpicCard({ epic }: { epic: FlatEpic }) {
  return (
    <Card className="group/card cursor-grab active:cursor-grabbing border-border/40 bg-card transition-all hover:border-border hover:shadow-md">
      <CardContent className="p-3">
        <div className="mb-2 flex items-center gap-2">
          {epic.prefix && (
            <Badge variant="secondary" className="text-[10px] font-mono shrink-0">
              {epic.prefix}
            </Badge>
          )}
          <span className="truncate text-sm font-medium leading-tight">
            {epic.title}
          </span>
        </div>
        <p className="mb-2 truncate text-xs text-muted-foreground">
          {epic.initiativeTitle}
        </p>
        <div className="flex items-center justify-between">
          <GateDots epic={epic} />
          {epic.bountyValue != null && epic.bountyValue > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] font-medium text-amber-500">
              <BanknoteIcon className="size-3" />
              ${epic.bountyValue}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Priority Kanban Column (droppable) ── */

function PriorityKanbanColumn({
  column,
  epics,
  onDrop,
}: {
  column: (typeof PRIORITY_COLUMNS)[number];
  epics: FlatEpic[];
  onDrop: (epicSlug: string, targetColumn: PriorityColumn, targetIndex: number) => void;
}) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const columnRef = useRef<HTMLDivElement>(null);

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";

      const columnEl = columnRef.current;
      if (!columnEl) return;

      const cards = columnEl.querySelectorAll("[data-epic-card]");
      const mouseY = e.clientY;
      let insertIndex = epics.length;

      for (let i = 0; i < cards.length; i++) {
        const rect = cards[i].getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        if (mouseY < midY) {
          insertIndex = i;
          break;
        }
      }

      setDragOverIndex(insertIndex);
    },
    [epics.length],
  );

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    const columnEl = columnRef.current;
    if (columnEl && relatedTarget && columnEl.contains(relatedTarget)) return;
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const epicSlug = e.dataTransfer.getData("text/plain");
      if (epicSlug) {
        onDrop(epicSlug, column.id, dragOverIndex ?? epics.length);
      }
      setDragOverIndex(null);
    },
    [column.id, dragOverIndex, epics.length, onDrop],
  );

  return (
    <div
      className={cn("flex flex-col rounded-lg p-3 min-w-[200px]", column.bgTint)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      ref={columnRef}
    >
      {/* Column header */}
      <div className="mb-3 flex items-center gap-2">
        <span className={cn("size-2.5 rounded-full shrink-0", column.dotColor)} />
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {column.label}
        </span>
        <Badge variant="secondary" className="ml-auto text-[10px]">
          {epics.length}
        </Badge>
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-2" data-column={column.id}>
        {epics.map((epic, i) => (
          <div key={epic.slug}>
            {dragOverIndex === i && (
              <div className="mb-1 h-0.5 rounded-full bg-blue-500" />
            )}
            <div
              data-epic-card
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", epic.slug);
                e.dataTransfer.effectAllowed = "move";
                requestAnimationFrame(() => {
                  (e.currentTarget as HTMLElement).style.opacity = "0.5";
                });
              }}
              onDragEnd={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "1";
              }}
            >
              <EpicCard epic={epic} />
            </div>
          </div>
        ))}
        {dragOverIndex === epics.length && epics.length > 0 && (
          <div className="h-0.5 rounded-full bg-blue-500" />
        )}
        {epics.length === 0 && (
          <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border/30 py-8">
            <p className="text-xs text-muted-foreground/50">Drop epics here</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Priority Kanban view ── */

function PriorityKanbanView({ epics }: { epics: FlatEpic[] }) {
  const [epicOrder, setEpicOrder] = useState<FlatEpic[]>(epics);

  // Sync when upstream epics change (search filter)
  const epicSlugsKey = epics.map((e) => e.slug).join(",");
  const [prevKey, setPrevKey] = useState(epicSlugsKey);
  if (epicSlugsKey !== prevKey) {
    setPrevKey(epicSlugsKey);
    // Preserve order of existing epics, append new ones
    const ordered: FlatEpic[] = [];
    const incoming = new Map(epics.map((e) => [e.slug, e]));
    for (const e of epicOrder) {
      if (incoming.has(e.slug)) {
        ordered.push(incoming.get(e.slug)!);
        incoming.delete(e.slug);
      }
    }
    for (const e of incoming.values()) ordered.push(e);
    setEpicOrder(ordered);
  }

  const columnEpics = useMemo(() => {
    const map: Record<PriorityColumn, FlatEpic[]> = {
      P0: [], P1: [], P2: [], P3: [], P4: [], unranked: [],
    };
    for (const epic of epicOrder) {
      map[epic.priorityCol].push(epic);
    }
    return map;
  }, [epicOrder]);

  const handleDrop = useCallback(
    (epicSlug: string, targetColumn: PriorityColumn, targetIndex: number) => {
      setEpicOrder((prev) => {
        const epic = prev.find((e) => e.slug === epicSlug);
        if (!epic) return prev;

        // Remove from current position
        const without = prev.filter((e) => e.slug !== epicSlug);
        const updated = { ...epic, priorityCol: targetColumn };

        // Find the correct position in the flat array
        // Count how many epics in the target column come before targetIndex
        let insertAt = 0;
        let colCount = 0;
        for (let i = 0; i < without.length; i++) {
          if (without[i].priorityCol === targetColumn) {
            if (colCount === targetIndex) {
              insertAt = i;
              break;
            }
            colCount++;
          }
          insertAt = i + 1;
        }

        const result = [...without];
        result.splice(insertAt, 0, updated);
        return result;
      });
    },
    [],
  );

  return (
    <div className="overflow-x-auto pb-4">
      <div className="inline-flex min-w-full gap-3">
        {PRIORITY_COLUMNS.map((col) => (
          <div key={col.id} className="flex-1 min-w-[200px]">
            <PriorityKanbanColumn
              column={col}
              epics={columnEpics[col.id]}
              onDrop={handleDrop}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Priority Kanban with swimlanes ── */

function PriorityKanbanSwimlaneView({
  epics,
  initiatives,
}: {
  epics: FlatEpic[];
  initiatives: Initiative[];
}) {
  const initiativeRows = useMemo(() => {
    return initiatives
      .map((init) => {
        const initEpics = epics.filter((e) => e.initiativeSlug === init.slug);
        const colMap: Record<PriorityColumn, FlatEpic[]> = {
          P0: [], P1: [], P2: [], P3: [], P4: [], unranked: [],
        };
        for (const epic of initEpics) {
          colMap[epic.priorityCol].push(epic);
        }
        return { initiative: init, epics: initEpics, colMap };
      })
      .filter((r) => r.epics.length > 0);
  }, [initiatives, epics]);

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <div className="min-w-[1200px]">
          {/* Column headers */}
          <div className="flex gap-2 mb-4">
            <div className="w-[180px] shrink-0" />
            {PRIORITY_COLUMNS.map((col) => {
              const count = epics.filter((e) => e.priorityCol === col.id).length;
              return (
                <div key={col.id} className="flex-1 min-w-[160px]">
                  <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                    <span className={cn("size-2 rounded-full shrink-0", col.dotColor)} />
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                      {col.label}
                    </span>
                    <Badge variant="secondary" className="ml-auto text-[10px]">
                      {count}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Swimlane rows */}
          {initiativeRows.map(({ initiative, epics: initEpics, colMap }) => (
            <div
              key={initiative.slug}
              className="mb-4 rounded-lg border border-border/30 bg-card/50"
            >
              <div className="flex items-center gap-2.5 border-b border-border/20 px-4 py-2.5">
                <span
                  className={cn(
                    "size-2.5 rounded-full shrink-0",
                    INITIATIVE_COLORS[initiative.slug] || "bg-muted-foreground",
                  )}
                />
                <span className="text-sm font-semibold tracking-tight">
                  {initiative.title}
                </span>
                <Badge variant="secondary" className="text-[10px]">
                  {initEpics.length} epic{initEpics.length !== 1 ? "s" : ""}
                </Badge>
              </div>

              <div className="flex gap-2 p-2">
                <div className="w-[180px] shrink-0" />
                {PRIORITY_COLUMNS.map((col) => (
                  <div key={col.id} className="flex-1 min-w-[160px] space-y-2">
                    {colMap[col.id].map((epic) => (
                      <motion.div
                        key={epic.slug}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 26 }}
                      >
                        <EpicCard epic={epic} />
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Timeline view ── */

function TimelineView({
  epics,
  initiatives,
}: {
  epics: FlatEpic[];
  initiatives: Initiative[];
}) {
  const { months, minMonth, totalMonths } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const epic of epics) {
      const { first, last } = getGateDates(epic);
      if (first) {
        const m = parseMonth(first);
        if (m < min) min = m;
      }
      if (last) {
        const m = parseMonth(last);
        if (m > max) max = m;
      }
    }

    if (min === Infinity) {
      const now = new Date();
      min = now.getFullYear() * 12 + now.getMonth() - 1;
      max = min + 11;
    }

    min -= 1;
    max += 2;

    const total = max - min + 1;
    const monthArr: { index: number; label: string }[] = [];
    for (let i = min; i <= max; i++) {
      monthArr.push({ index: i, label: monthLabel(i) });
    }

    return { months: monthArr, minMonth: min, totalMonths: total };
  }, [epics]);

  const rows = useMemo(() => {
    return initiatives
      .map((init) => ({
        initiative: init,
        epics: epics.filter((e) => e.initiativeSlug === init.slug),
      }))
      .filter((r) => r.epics.length > 0);
  }, [initiatives, epics]);

  const colWidth = 120;

  return (
    <div className="overflow-x-auto pb-4">
      <div style={{ minWidth: totalMonths * colWidth + 200 }}>
        <div className="flex border-b border-border/40">
          <div className="w-[200px] shrink-0 px-3 py-2 text-xs font-medium text-muted-foreground">
            Initiative
          </div>
          <div className="flex flex-1">
            {months.map((m) => (
              <div
                key={m.index}
                className="text-center text-[10px] text-muted-foreground py-2 border-l border-border/20"
                style={{ width: colWidth }}
              >
                {m.label}
              </div>
            ))}
          </div>
        </div>

        {rows.map(({ initiative, epics: rowEpics }) => (
          <div key={initiative.slug} className="flex border-b border-border/20 min-h-[60px]">
            <div className="w-[200px] shrink-0 flex items-start gap-2 px-3 py-3">
              <span
                className={cn(
                  "mt-0.5 size-2 rounded-full shrink-0",
                  INITIATIVE_COLORS[initiative.slug] || "bg-muted-foreground",
                )}
              />
              <span className="text-xs font-medium leading-tight text-foreground">
                {initiative.title}
              </span>
            </div>

            <div className="relative flex-1 py-2">
              {months.map((m) => (
                <div
                  key={m.index}
                  className="absolute top-0 bottom-0 border-l border-border/10"
                  style={{ left: (m.index - minMonth) * colWidth }}
                />
              ))}

              {rowEpics.map((epic, i) => {
                const { first, last } = getGateDates(epic);
                if (!first || !last) return null;

                const startMonth = parseMonth(first);
                const endMonth = parseMonth(last);
                const left = (startMonth - minMonth) * colWidth;
                const width = Math.max((endMonth - startMonth + 1) * colWidth, colWidth * 0.5);

                return (
                  <Tooltip key={epic.slug}>
                    <TooltipTrigger>
                      <div
                        className={cn(
                          "absolute h-6 rounded-md flex items-center px-2 cursor-default",
                          INITIATIVE_BAR_COLORS[epic.initiativeSlug] || "bg-muted-foreground/60",
                        )}
                        style={{ left, width, top: 8 + i * 30 }}
                      >
                        <span className="truncate text-[10px] font-medium text-white">
                          {epic.prefix ? `${epic.prefix} ` : ""}
                          {epic.title}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs max-w-xs">
                      <div className="font-medium">{epic.title}</div>
                      <div className="text-muted-foreground">
                        {first} to {last}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Department objectives ── */

function DepartmentObjectives({ strategy }: { strategy: StrategicContext }) {
  const [open, setOpen] = useState(false);

  if (strategy.departments.length === 0) return null;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg border border-border/40 bg-card px-4 py-3 text-left transition-colors hover:bg-muted/50">
        <UsersIcon className="size-4 text-muted-foreground shrink-0" />
        <span className="text-sm font-medium">Department Objectives</span>
        <Badge variant="secondary" className="text-[10px] ml-1">
          {strategy.departments.length}
        </Badge>
        <ChevronDownIcon
          className={cn(
            "ml-auto size-4 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-2 overflow-x-auto rounded-lg border border-border/40 bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 text-left">
                <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Department</th>
                <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Owner</th>
                <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Focus</th>
                <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Key Targets</th>
              </tr>
            </thead>
            <tbody>
              {strategy.departments.map((dept) => (
                <tr key={dept.department} className="border-b border-border/20 last:border-0">
                  <td className="px-4 py-2.5 font-medium">{dept.department}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{dept.owner}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{dept.focus}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{dept.targets}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {strategy.crossFunctional.length > 0 && (
          <div className="mt-3 overflow-x-auto rounded-lg border border-border/40 bg-card">
            <div className="flex items-center gap-2 border-b border-border/40 px-4 py-2.5">
              <LayersIcon className="size-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                Cross-functional Priorities
              </span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 text-left">
                  <th className="px-4 py-2 text-xs font-medium text-muted-foreground">Initiative</th>
                  <th className="px-4 py-2 text-xs font-medium text-muted-foreground">Lead</th>
                  <th className="px-4 py-2 text-xs font-medium text-muted-foreground">Supporting</th>
                </tr>
              </thead>
              <tbody>
                {strategy.crossFunctional.map((cf) => (
                  <tr key={cf.initiative} className="border-b border-border/20 last:border-0">
                    <td className="px-4 py-2 font-medium">{cf.initiative}</td>
                    <td className="px-4 py-2 text-muted-foreground">{cf.lead}</td>
                    <td className="px-4 py-2 text-muted-foreground">{cf.supporting}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

/* ── Main component ── */

export function StrategyClient({
  initiatives,
  strategy,
}: {
  initiatives: Initiative[];
  strategy: StrategicContext;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [swimlane, setSwimlane] = useState(false);

  // Flatten all epics with initiative metadata and priority
  const allEpics: FlatEpic[] = useMemo(
    () =>
      initiatives.flatMap((init) =>
        init.epics.map((epic) => ({
          ...epic,
          initiativeTitle: init.title,
          initiativeSlug: init.slug,
          priorityCol: normalizePriority(epic.priority),
        })),
      ),
    [initiatives],
  );

  // Filter epics by search
  const filteredEpics = useMemo(() => {
    if (!searchQuery) return allEpics;
    const q = searchQuery.toLowerCase();
    return allEpics.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.initiativeTitle.toLowerCase().includes(q) ||
        (e.prefix && e.prefix.toLowerCase().includes(q)) ||
        (e.summary && e.summary.toLowerCase().includes(q)),
    );
  }, [allEpics, searchQuery]);

  const totalEpics = allEpics.length;

  return (
    <div className="min-h-dvh flex flex-col">
      <InternalHeader>
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <a href="/dashboard" className="rounded-md px-2 py-1 transition-colors hover:text-foreground">Initiatives</a>
          <ChevronRightIcon className="size-3.5" />
          <span className="font-medium text-foreground">Strategy</span>
        </nav>
      </InternalHeader>

      <div className="flex-1 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-7xl">
          {strategy.theme && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 26 }} className="mb-6 rounded-lg border border-border/40 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 px-5 py-4">
              <div className="flex items-center gap-2 mb-1">
                <TargetIcon className="size-4 text-primary" />
                <span className="text-xs font-medium text-primary uppercase tracking-wide">FY26 Strategic Theme</span>
              </div>
              <p className="text-base font-semibold tracking-tight">{strategy.theme}</p>
            </motion.div>
          )}

          <div className="mb-6"><DepartmentObjectives strategy={strategy} /></div>
          <Separator className="mb-6" />

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Roadmap</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {filteredEpics.length}{filteredEpics.length !== totalEpics ? ` of ${totalEpics}` : ""} epics across {initiatives.length} initiatives
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <SearchIcon className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <input type="text" placeholder="Filter epics..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-9 w-full rounded-lg border border-input/50 bg-muted/50 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
              </div>
            </div>
          </div>

          <Tabs defaultValue={0}>
            <div className="mb-4 flex items-center justify-between">
              <TabsList>
                <TabsTrigger value={0}><LayoutGridIcon className="size-3.5" />Kanban</TabsTrigger>
                <TabsTrigger value={1}><CalendarDaysIcon className="size-3.5" />Timeline</TabsTrigger>
              </TabsList>
              <button type="button" onClick={() => setSwimlane((s) => !s)} className={cn("flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors", swimlane ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground")}>
                <LayersIcon className="size-3.5" />Swimlanes
              </button>
            </div>
            <TabsContent value={0}>
              <motion.div key={`kanban-${swimlane}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 26 }}>
                {swimlane ? <PriorityKanbanSwimlaneView epics={filteredEpics} initiatives={initiatives} /> : <PriorityKanbanView epics={filteredEpics} />}
              </motion.div>
            </TabsContent>
            <TabsContent value={1}>
              <motion.div key="timeline" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 26 }}>
                <TimelineView epics={filteredEpics} initiatives={initiatives} />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
