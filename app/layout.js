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

          <footer className="bg-gray-100 py-12">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p className="text-lg">
                Made with ❤️ by Kartikey 🎀😎
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