/**
 * Linear Sync Script
 *
 * Pulls status and priority from Linear projects and updates epic meta.yaml files.
 *
 * Usage:
 *   LINEAR_API_KEY=lin_api_xxx npx tsx scripts/sync-linear.ts
 *   LINEAR_API_KEY=lin_api_xxx npx tsx scripts/sync-linear.ts --dry-run
 */

import fs from "fs";
import path from "path";

const LINEAR_API = "https://api.linear.app/graphql";
const CONTENT_DIR = path.join(process.cwd(), "content/initiatives");
const DRY_RUN = process.argv.includes("--dry-run");

const API_KEY = process.env.LINEAR_API_KEY;
if (!API_KEY) {
  console.error("ERROR: Set LINEAR_API_KEY environment variable");
  process.exit(1);
}

type ProjectData = {
  id: string;
  name: string;
  state: string; // backlog, started, planned, paused, completed, canceled
  priority: number; // 0=none, 1=urgent, 2=high, 3=medium, 4=low
};

async function fetchLinearProjects(
  projectIds: string[]
): Promise<Map<string, ProjectData>> {
  const results = new Map<string, ProjectData>();

  // Batch in groups of 50
  for (let i = 0; i < projectIds.length; i += 50) {
    const batch = projectIds.slice(i, i + 50);
    const filter = `{ id: { in: [${batch.map((id) => `"${id}"`).join(",")}] } }`;

    const query = `{
      projects(filter: ${filter}, first: 50) {
        nodes {
          id
          name
          state
          priority
        }
      }
    }`;

    const res = await fetch(LINEAR_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: API_KEY!,
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      console.error(`Linear API error: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.error(text);
      continue;
    }

    const json = await res.json();
    for (const project of json.data?.projects?.nodes ?? []) {
      results.set(project.id, project);
    }
  }

  return results;
}

function linearStateToStatus(state: string): string {
  const map: Record<string, string> = {
    backlog: "backlog",
    started: "in progress",
    planned: "planned",
    paused: "on hold",
    completed: "release",
    canceled: "blocked",
  };
  return map[state] || state;
}

function linearPriorityToLabel(priority: number): string {
  const map: Record<number, string> = {
    0: "nth",
    1: "urgent",
    2: "P1",
    3: "P2",
    4: "P3",
  };
  return map[priority] ?? "nth";
}

function updateYamlField(
  content: string,
  field: string,
  value: string
): string {
  const regex = new RegExp(`^${field}:.*$`, "m");
  if (regex.test(content)) {
    return content.replace(regex, `${field}: ${value}`);
  }
  // Insert before gates/phases/stories or at end
  const insertPoint = content.search(/\n(gates|phases|stories)/m);
  if (insertPoint > 0) {
    return (
      content.slice(0, insertPoint) +
      `\n${field}: ${value}` +
      content.slice(insertPoint)
    );
  }
  return content.trimEnd() + `\n${field}: ${value}\n`;
}

async function main() {
  console.log(DRY_RUN ? "DRY RUN — no files will be modified\n" : "");

  // Collect all epics with linear_project_id
  const epics: { dir: string; projectId: string; metaPath: string }[] = [];

  const initDirs = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  for (const initDir of initDirs) {
    const initPath = path.join(CONTENT_DIR, initDir.name);
    const epicDirs = fs
      .readdirSync(initPath, { withFileTypes: true })
      .filter((d) => d.isDirectory());

    for (const epicDir of epicDirs) {
      const metaPath = path.join(initPath, epicDir.name, "meta.yaml");
      if (!fs.existsSync(metaPath)) continue;

      const content = fs.readFileSync(metaPath, "utf-8");
      const match = content.match(/^linear_project_id:\s*(.+)$/m);
      if (match) {
        epics.push({
          dir: `${initDir.name}/${epicDir.name}`,
          projectId: match[1].trim(),
          metaPath,
        });
      }
    }
  }

  console.log(`Found ${epics.length} epics with Linear project IDs\n`);

  // Fetch from Linear
  const projectIds = epics.map((e) => e.projectId);
  const projects = await fetchLinearProjects(projectIds);

  console.log(`Fetched ${projects.size} projects from Linear\n`);

  let updated = 0;
  let skipped = 0;

  for (const epic of epics) {
    const project = projects.get(epic.projectId);
    if (!project) {
      console.log(`  SKIP ${epic.dir} — not found in Linear`);
      skipped++;
      continue;
    }

    let content = fs.readFileSync(epic.metaPath, "utf-8");
    const newStatus = linearStateToStatus(project.state);
    const newPriority = linearPriorityToLabel(project.priority);

    // Check current values
    const currentStatus = content.match(/^status:\s*'?(.+?)'?$/m)?.[1] || "";
    const currentPriority =
      content.match(/^priority:\s*'?(.+?)'?$/m)?.[1] || "";

    if (
      currentStatus.toLowerCase() === newStatus.toLowerCase() &&
      currentPriority.toLowerCase() === newPriority.toLowerCase()
    ) {
      skipped++;
      continue;
    }

    content = updateYamlField(content, "status", newStatus);
    content = updateYamlField(content, "priority", newPriority);
    content = updateYamlField(
      content,
      "last_synced",
      `'${new Date().toISOString()}'`
    );

    const changes: string[] = [];
    if (currentStatus.toLowerCase() !== newStatus.toLowerCase())
      changes.push(`status: ${currentStatus} → ${newStatus}`);
    if (currentPriority.toLowerCase() !== newPriority.toLowerCase())
      changes.push(`priority: ${currentPriority} → ${newPriority}`);

    console.log(`  UPDATE ${epic.dir} — ${changes.join(", ")}`);

    if (!DRY_RUN) {
      fs.writeFileSync(epic.metaPath, content, "utf-8");
    }
    updated++;
  }

  console.log(
    `\nDone: ${updated} updated, ${skipped} skipped${DRY_RUN ? " (dry run)" : ""}`
  );
}

main().catch(console.error);
