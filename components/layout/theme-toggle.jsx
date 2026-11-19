"use client";

import { useEffect, useState } from "react";
import { BsMoon, BsSun } from "react-icons/bs";
import { useTheme } from "next-themes";
import { ThemeAnimationType, useModeAnimation } from "react-theme-switch-animation";
import { Button } from "@/components/ui/button";

const THEME_ANIMATION_MS = 650;

/**
 * Light/dark toggle. The new theme is revealed as a circle that expands from the button
 * (View Transitions API, via react-theme-switch-animation), same as the portfolio.
 */
export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { ref, toggleSwitchTheme } = useModeAnimation({
    animationType: ThemeAnimationType.CIRCLE,
    duration: THEME_ANIMATION_MS,
    isDarkMode: resolvedTheme === "dark",
    onDarkModeChange: (isDark) => setTheme(isDark ? "dark" : "light"),
  });

  // Render a placeholder until mounted: the resolved theme is unknown on the server.
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="size-8" aria-hidden="true" />;

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      ref={ref}
      type="button"
      onClick={toggleSwitchTheme}
      variant="ghost"
      size="icon-sm"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="text-muted-foreground hover:bg-accent hover:text-foreground"
    >
      {isDark ? <BsSun className="size-3.5" /> : <BsMoon className="size-3.5" />}
    </Button>
  );
}
