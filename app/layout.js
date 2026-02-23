import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import CreateEventDrawerClient from "@/components/create-event-client-wrapper";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Connectify",
  description: "Meeting Scheduling App",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){try{var saved=localStorage.getItem('theme');var systemDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var theme=saved|| (systemDark?'dark':'light');if(theme==='dark'){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})();`,
            }}
          />
        </head>
        <body
          className={`${inter.variable} ${inter.className} flex min-h-screen flex-col bg-background text-foreground antialiased`}
        >
          <ThemeProvider>
            <Header />

            <main>{children}</main>

            <footer className="mt-auto border-t border-border bg-background/95">
              <div className="app-container py-8 sm:py-10">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-base font-semibold tracking-tight text-foreground">
                      Connectify
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Scheduling infrastructure for focused teams.
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Built by Kartikey
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      © {new Date().getFullYear()} All rights reserved.
                    </p>
                  </div>
                </div>
              </div>
            </footer>

            <CreateEventDrawerClient />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

// layout.js wraps whole our app and contains the layout of our app
