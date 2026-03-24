import { Suspense } from "react";
import { getInitiatives } from "@/lib/initiatives";
import { DashboardShell } from "./dashboard-client";

export default function DashboardPage() {
  // Strip artifactContent to avoid sending ~3.7MB to the client.
  // Content is loaded on-demand via /api/artifact when the user opens a document.
  const initiatives = getInitiatives().map((init) => ({
    ...init,
    epics: init.epics.map((epic) => ({
      ...epic,
      artifactContent: {},
    })),
  }));

  return (
    <Suspense>
      <DashboardShell initiatives={initiatives} />
    </Suspense>
  );
}
