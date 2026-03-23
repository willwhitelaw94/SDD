import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MotionPreset } from "@/components/ui/motion-preset";

const steps = [
  {
    number: 1,
    title: "Idea Brief Generation",
    description:
      "Capture the initial concept, define the problem space, and outline the high-level vision for the feature or product.",
    loomId: "e9e722e51b394d0aaa27a7b091b03b0c",
  },
  {
    number: 2,
    title: "Speccing the Stories",
    description:
      "Break the idea into user stories with clear acceptance criteria, edge cases, and dependencies.",
    loomId: "cca338813e854c6881c7adbbbcd47499",
  },
  {
    number: 3,
    title: "Design and Mockups",
    description:
      "Translate stories into visual designs — wireframes, mockups, and interactive prototypes.",
    loomId: "6e105da4cc964ef08c66d072c62ea5f9",
  },
  {
    number: 4,
    title: "Planning Technical",
    description:
      "Map out the technical approach — architecture decisions, data models, API contracts, and implementation strategy.",
    loomId: "6926c24eca2c4cc481155e67f281be29",
  },
  {
    number: 5,
    title: "Review Implementation and ADHD Prompting",
    description:
      "Review the built feature, iterate on feedback, and use structured prompting to maintain focus and momentum.",
    loomId: "fe78fd2fb2c440309d3d58035987394f",
  },
  {
    number: 6,
    title: "QA and Browser Tests",
    description:
      "Verify the feature end-to-end — manual QA, automated browser tests, and regression checks.",
    loomId: "9f8f661b1ae74ac89cf8ef6ec0b50af6",
  },
  {
    number: 7,
    title: "Final Video sent to Business",
    description:
      "Record and deliver the final walkthrough to stakeholders, demonstrating the completed feature in action.",
    loomId: "723c7507e78c4b968d4323ec9d1fb118",
  },
];

export default function ProcessPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
        {/* Header */}
        <MotionPreset fade blur slide={{ direction: "up", offset: 30 }} delay={0}>
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">
              Our Process
            </Badge>
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
              Story-Driven Development
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Seven steps from idea to delivery. Each step is recorded so you
              can see exactly how we work.
            </p>
          </div>
        </MotionPreset>

        {/* Steps */}
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div key={step.number}>
              <MotionPreset
                fade
                slide={{ direction: "up", offset: 40 }}
                delay={index * 0.08}
                inViewMargin="-50px"
              >
                <Card className="overflow-hidden border-border/50 p-0 transition-shadow duration-300 hover:shadow-lg">
                  {/* Video Embed */}
                  <div className="relative aspect-video w-full bg-muted">
                    <iframe
                      src={`https://www.loom.com/embed/${step.loomId}`}
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                      title={`Step ${step.number}: ${step.title}`}
                    />
                  </div>

                  {/* Step Info */}
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-sm font-semibold text-primary-foreground">
                        {step.number}
                      </span>
                      <div>
                        <h2 className="text-xl font-semibold tracking-tight">
                          {step.title}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </MotionPreset>

              {index < steps.length - 1 && (
                <MotionPreset fade delay={index * 0.08 + 0.1}>
                  <div className="flex justify-center py-4">
                    <Separator
                      orientation="vertical"
                      className="h-8 w-px bg-border"
                    />
                  </div>
                </MotionPreset>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
