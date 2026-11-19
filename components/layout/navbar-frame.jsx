"use client";

import { useEffect, useState } from "react";

const SCROLL_THRESHOLD_PX = 20;

/** Sticky header chrome; the background firms up once the page is scrolled. Content is server-rendered. */
export function NavbarFrame({ children }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD_PX);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-(--z-sticky) w-full">
      <div
        className={`w-full backdrop-blur-xl ${scrolled ? "bg-background/95" : "bg-background/80"}`}
      >
        {children}
      </div>
    </header>
  );
}
