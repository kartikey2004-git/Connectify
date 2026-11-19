import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import CreateEventLink from "@/components/events/create-event-link";
import { NavbarFrame } from "@/components/layout/navbar-frame";
import ThemeToggle from "@/components/layout/theme-toggle";
import UserMenu from "@/components/layout/user-menu";
import { NAV_LINKS, POST_AUTH_URL } from "@/lib/constants";

export function Navbar() {
  return (
    <NavbarFrame>
      <div className="section-shell flex h-14 items-center justify-between sm:h-16">
        <nav className="allow-motion flex items-center gap-3 sm:gap-5 lg:gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="group relative py-2 text-copy-14 font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              <span>{link.title}</span>
              <span className="pointer-events-none absolute -inset-x-1 bottom-0 h-0.5 origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <CreateEventLink />
          <SignedOut>
            <SignInButton forceRedirectUrl={POST_AUTH_URL}>
              <Button variant="outline" size="sm">
                Login
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserMenu />
          </SignedIn>
        </div>
      </div>
    </NavbarFrame>
  );
}
