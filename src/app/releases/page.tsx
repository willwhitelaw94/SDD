import { getReleases } from "@/lib/releases";
import { ReleasesTimeline } from "./releases-client";

export default function ReleasesPage() {
  const releases = getReleases();
  return <ReleasesTimeline releases={releases} />;
}
