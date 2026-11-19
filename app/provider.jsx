"use client";

import { ThemeProvider } from "next-themes";

export function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      storageKey="theme"
      themes={["light", "dark", "system"]}
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
