import Header from "@/components/shadcn-studio/blocks/hero-section-40/header";
import MegaFooter from "@/components/shadcn-studio/blocks/mega-footer-04/mega-footer-04";
import { navigationData } from "@/lib/navigation";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header navigationData={navigationData} />
      {children}
      <MegaFooter />
    </>
  );
}
