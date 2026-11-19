import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ClerkProvider } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";
import "@/styles/globals.css";
import { Providers } from "./provider";
import { Navbar } from "@/components/layout/navbar";
import { AppShell } from "@/components/layout/app-shell";
import Footer from "@/components/layout/footer";
import CreateEventDrawerClient from "@/components/events/create-event-drawer-client";

export const metadata = {
  title: "Connectify | Meeting Scheduling",
  description: "Meeting Scheduling App",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${GeistSans.variable} ${GeistMono.variable}`}
      >
        <body className="font-sans bg-background text-foreground antialiased">
          <Providers>
            {/* Gutter lives on a wrapper, not <body>: Radix scroll-lock overwrites body padding when a dialog opens. */}
            <div className="px-3">
              <Navbar />
              <AppShell>
                <main className="flex-1">{children}</main>
                <Footer />
              </AppShell>
            </div>
            <CreateEventDrawerClient />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
