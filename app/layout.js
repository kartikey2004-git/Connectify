import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import CreateEventDrawerClient from "@/components/create-event-client-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Connectify",
  description: "Meeting Scheduling App",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Header />

          <main className="min-h-screen bg-background">{children}</main>

          <footer className="bg-muted/50 border-t py-8 mt-12">
            <div className="max-w-screen-xl mx-auto px-4 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Made with <span className="text-red-500">❤️</span> by{" "}
                <span className="font-semibold text-foreground">Kartikey</span>{" "}
                🎀😎
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                © {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
          </footer>

          <CreateEventDrawerClient />
        </body>
      </html>
    </ClerkProvider>
  );
}

// layout.js wraps whole our app and contains the layout of our app
