import { Suspense } from "react";
import { getInitiatives } from "@/lib/initiatives";
import { getStrategicContext } from "@/lib/strategy";
import { StrategyClient } from "./strategy-client";

export default function StrategyPage() {
  // Strip artifactContent to avoid sending ~3.7MB to the client.
  const initiatives = getInitiatives().map((init) => ({
    ...init,
    epics: init.epics.map((epic) => ({
      ...epic,
      artifactContent: {},
    })),
  }));

  const strategy = getStrategicContext();

  return (
    <Suspense>
      <StrategyClient initiatives={initiatives} strategy={strategy} />
    </Suspense>
  );
}
