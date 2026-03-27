import { Suspense } from "react";
import { getGates, getEpicsByGate } from "@/lib/gates";
import { getInitiatives } from "@/lib/initiatives";
import { GatesClient } from "./gates-client";

export default function GatesPage() {
  const gates = getGates();
  const initiatives = getInitiatives().map((init) => ({
    ...init,
    epics: init.epics.map((epic) => ({
      ...epic,
      artifactContent: {},
    })),
  }));
  const epicsByGate = getEpicsByGate(initiatives);

  return (
    <Suspense>
      <GatesClient
        gates={gates}
        epicsByGate={epicsByGate}
        initiatives={initiatives}
      />
    </Suspense>
  );
}
