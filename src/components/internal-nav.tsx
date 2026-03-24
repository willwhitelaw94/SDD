"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { HomeIcon } from "lucide-react";

const LINKS = [
  { href: "/", label: "Home", icon: true },
  { href: "/dashboard", label: "Initiatives", icon: false },
  { href: "/docs", label: "Docs", icon: false },
  { href: "/dashboard/topics", label: "Topics", icon: false },
] as const;

export function InternalNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex items-center gap-0.5", className)}>
      {LINKS.map((link) => {
        const isActive =
          link.href === "/"
            ? pathname === "/"
            : pathname === link.href ||
              (pathname.startsWith(link.href + "/") &&
                !LINKS.some(
                  (other) =>
                    other.href !== link.href &&
                    other.href.startsWith(link.href) &&
                    pathname.startsWith(other.href)
                ));
        return (
          <a
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
              isActive
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {link.icon && <HomeIcon className="size-3.5" />}
            {link.label}
          </a>
        );
      })}
    </nav>
  );
}
