import Link from "next/link";
import { Button } from "./ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import UserMenu from "./user-menu";
import ThemeToggle from "./theme-toggle";
import CreateEventLink from "./create-event-link";

const Header = async () => {
  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="app-container flex h-16 items-center justify-between gap-4">
        <Link href={"/"} className="flex items-center">
          <span className="text-xl font-semibold tracking-tight sm:text-2xl">
            Connectify
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <CreateEventLink />

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant={"outline"}>Login</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserMenu />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Header;

/* 

Jab user login nahi hota ya sign out ( not loggedIn ) hota hai, tab jo bhi tum SignedOut ke andar likhte ho, wo hi dikhai deta hai.

Jab user login  hota ya sign In ( loggedIn ) hota hai, tab jo bhi tum SignedIn ke andar likhte ho, wo hi dikhai deta hai.


 "Jab user sign in ya sign up successfully kar le, to usko kis URL ( dashboard ) pe redirect karna hai."

 we can also configure to change username in user 
 dropdown

 forceRedirectUrl ➔ Auto redirect URL after successful auth
(super handy in Clerk flows!)

*/
