"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";

/** Section navigation for the signed-in app: underline-on-hover text links, active link underlined. */
export function SectionNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Sections"
      className="allow-motion thin-scrollbar mb-8 flex items-center gap-4 overflow-x-auto border-b border-border/60 sm:gap-6"
    >
      {NAV_ITEMS.map(({ href, label }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group relative shrink-0 py-2 text-copy-14 font-medium transition-colors duration-150 hover:text-foreground",
              isActive ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <span>{label}</span>
            <span
              className={cn(
                "pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left bg-current transition-transform duration-300 ease-out group-hover:scale-x-100",
                isActive ? "scale-x-100" : "scale-x-0",
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}
