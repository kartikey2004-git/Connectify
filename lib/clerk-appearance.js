/**
 * Clerk theme built from the design tokens (styles/tokens.css).
 * Clerk accepts CSS variables, so light/dark follows the `.dark` class automatically.
 */
export const clerkAppearance = {
  variables: {
    colorPrimary: "var(--primary)",
    colorBackground: "var(--card)",
    colorForeground: "var(--foreground)",
    colorText: "var(--foreground)",
    colorTextSecondary: "var(--muted-foreground)",
    colorTextOnPrimaryBackground: "var(--primary-foreground)",
    colorMuted: "var(--muted)",
    colorMutedForeground: "var(--muted-foreground)",
    colorNeutral: "var(--foreground)",
    colorInput: "var(--input)",
    colorInputBackground: "transparent",
    colorInputForeground: "var(--foreground)",
    colorInputText: "var(--foreground)",
    colorBorder: "var(--border)",
    colorRing: "var(--ring)",
    colorDanger: "var(--destructive)",
    colorSuccess: "var(--success)",
    colorWarning: "var(--warning)",
    colorShadow: "transparent",
    borderRadius: "0.5rem",
    fontFamily: "var(--font-geist-sans)",
    fontFamilyButtons: "var(--font-geist-sans)",
    fontSize: "0.875rem",
    fontWeight: { normal: 400, medium: 500, semibold: 500, bold: 600 },
  },
  elements: {
    // Flat surfaces with a soft border; shadows only on floating UI (the user menu popover).
    cardBox: "border border-border/60 shadow-none",
    card: "shadow-none",
    userButtonPopoverCard: "border border-border shadow-popover",
    modalContent: "shadow-overlay",
    formButtonPrimary: "shadow-none",
    headerTitle: "font-[450] tracking-tight",
  },
};
