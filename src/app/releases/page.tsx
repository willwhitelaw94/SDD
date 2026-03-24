import { getReleases } from "@/lib/releases"
import { ReleasesTimeline } from "./releases-client"
import { ReleaseContent } from "./release-content"

export default function ReleasesPage() {
  const releases = getReleases()

  // Pre-render MDX content for each release as Server Components
  const renderedContent: Record<string, React.ReactNode> = {}
  for (const release of releases) {
    renderedContent[release.slug] = <ReleaseContent content={release.content} />
  }

  return <ReleasesTimeline releases={releases} renderedContent={renderedContent} />
}
