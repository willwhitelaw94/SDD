import type { Metadata } from "next";
import Header from "@/components/shadcn-studio/blocks/hero-section-40/header";
import MegaFooter from "@/components/shadcn-studio/blocks/mega-footer-04/mega-footer-04";
import { navigationData } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Getting Started — SDD",
  description:
    "Guided onboarding for new team members. Pick your role and get a curated reading path through docs, personas, and process.",
};

export default function GettingStartedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header navigationData={navigationData} />
      {children}
      <MegaFooter />
    </>
  );
}
