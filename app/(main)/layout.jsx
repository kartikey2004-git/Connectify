"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { LoadingBar } from "@/components/ui/loading-bar";
import { SectionNav } from "./_components/app-nav";
import { NAV_ITEMS } from "./_components/nav-items";

export default function AppLayout({ children }) {
  const { isLoaded } = useUser();
  const pathname = usePathname();

  const title = NAV_ITEMS.find((item) => item.href === pathname)?.label ?? "Dashboard";

  return (
    <>
      {!isLoaded && <LoadingBar />}
      <div className="page-shell">
        <SectionNav />
        <h1 className="heading-lg mb-6 sm:mb-8">{title}</h1>
        {children}
      </div>
    </>
  );
}
