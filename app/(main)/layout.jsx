"use client";

import { useUser } from "@clerk/nextjs";
import { BarChart, Calendar, Clock, Users, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarLoader } from "react-spinners";

// define objects which will contains diff routes for layout

const navItems = [
  { id: 1, href: "/dashboard", label: "Dashboard", icon: BarChart },
  { id: 2, href: "/events", label: "Events", icon: Calendar },
  { id: 3, href: "/meetings", label: "Meetings", icon: Users },
  { id: 4, href: "/availability", label: "Availability", icon: Clock },
];

const AppLayout = ({ children }) => {
  const { isLoaded } = useUser();

  /* useUser() is a React hook provided by Clerk for handling authentication. 
  
  It gives you access to the current signed-in user's details, authentication state, and some utility functions

     - isLoaded: Tells you if Clerk finished loading the user state.

     - isSignedIn: true if the user is signed in, false if not.

     - user: Gives you access to user properties like user.id, user.firstName, user.emailAddresses, etc.

  */

  const pathname = usePathname();

  // usePathname() : A Client Component hook that lets you read the current URL's pathname.

  // aside is very important for accessibility , this is not the main content of our page  ( important in interviews )

  return (
    <>
      {!isLoaded && <BarLoader width={"100%"} color="#36d7b7" />}

      <div className="flex flex-col h-screen md:flex-row">
        <aside className="hidden md:block w-64 bg-card border-r">
          <nav className="p-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-3 py-2.5 text-sm rounded-md transition-colors ${
                        pathname === item.href
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      <item.icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-6 bg-background">
          <header className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              {navItems.find((item) => item.href === pathname)?.label ||
                "Dashboard"}
            </h1>
          </header>
          {children}
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50">
          <ul className="flex justify-around items-center py-2">
            {navItems.map((item) => {
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`flex flex-col items-center gap-1 p-2 text-xs rounded-md transition-colors ${
                      pathname === item.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default AppLayout;
