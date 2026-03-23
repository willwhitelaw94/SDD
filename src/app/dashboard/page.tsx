import { Suspense } from "react";
import { getInitiatives } from "@/lib/initiatives";
import { DashboardShell } from "./dashboard-client";

export default function DashboardPage() {
  const initiatives = getInitiatives();
  return (
    <Suspense>
      <DashboardShell initiatives={initiatives} />
    </Suspense>
  );
}
