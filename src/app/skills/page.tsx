import { InternalHeader } from '@/components/internal-header'
import { Badge } from '@/components/ui/badge'
import { PHASES, getAllSkills } from '@/lib/skills'
import { SkillsTimeline } from '@/components/skills-timeline'

export default function SkillsPage() {
  const allSkills = getAllSkills()
  const coreCount = allSkills.filter((s) => s.type === 'core').length
  const supportCount = allSkills.filter((s) => s.type === 'support').length
  const contextualCount = allSkills.filter((s) => s.type === 'contextual').length

  return (
    <div className="min-h-screen bg-background">
      <InternalHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          {/* Header */}
          <div className="mb-12 max-w-3xl">
            <Badge variant="outline" className="mb-3">Skills Catalogue</Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Workflow Skills Deep Dive
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              {allSkills.length} skills across {PHASES.length} phases — from research to release.
              Every skill maps to a specific point in the SDD timeline.
            </p>

            {/* Quick stats */}
            <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-primary" />
                {coreCount} core
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-muted-foreground" />
                {supportCount} support
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-amber-500" />
                {contextualCount} contextual
              </span>
            </div>
          </div>

          {/* Interactive timeline */}
          <SkillsTimeline phases={PHASES} />
        </div>
      </main>
    </div>
  )
}
