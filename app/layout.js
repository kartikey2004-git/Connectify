import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import CreateEventDrawer from "@/components/create-event";

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

          <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {children}
          </main>

          <footer className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-8 mt-12 shadow-inner">
            <div className="max-w-screen-xl mx-auto px-4 text-center">
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Made with <span className="text-red-500">❤️</span> by{" "}
                <span className="font-semibold">
                  Kartikey
                </span>{" "}
                🎀😎
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                © {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
          </footer>

          <CreateEventDrawer />
        </body>
      </html>
    </ClerkProvider>
  );
}

// layout.js wraps whole our app and contains the layout of our app
