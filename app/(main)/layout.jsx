"use client";

import { useUser } from "@clerk/nextjs";
import { BarChart, Calendar, Clock, Users } from "lucide-react";
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

      <div className="flex flex-col h-screen bg-blue-50 md:flex-row">
        <aside className="hidden md:block w-64 bg-white">
          <nav className="mt-8">
            <ul>
              {navItems.map((item) => {
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-4 text-gray-600 hover:bg-gray-100 ${
                        pathname === item.href ? "bg-blue-100" : ""
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <header className="flex justify-between items-center mb-4">
            <h2
              className="text-3xl md:text-4xl font-semibold tracking-tighter pb-4 pr-2 transition-all duration-300 ease-in-out pt-2 md:pt-0 text-center md:text-left w-full"
            >
              {/* to find user on which route/page user currently */}

              {navItems.find((item) => item.href === pathname).label ||
                "Dashboard"}
            </h2>
          </header>
          {children}
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md z-50">
          <ul className="flex justify-around items-center py-2 px-4">
            {navItems.map((item) => {
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`flex flex-col items-center text-xs ${
                      pathname === item.href ? "text-blue-600" : "text-gray-600"
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