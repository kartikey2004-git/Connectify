import Link from "next/link";
import { Button } from "./ui/button";
import { PenBox } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import UserMenu from "./user-menu";

const Header = async () => {
  return (
    <nav className="mx-auto p-4 flex justify-between items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Link href={"/"} className="flex items-center">
        <span className="text-2xl font-semibold tracking-tight">
          Connectify
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <Link href={"/events?create=true"}>
          <Button className="flex items-center gap-2">
            <PenBox size={18} className="block md:hidden" />
            <div className="hidden md:flex items-center gap-2">
              <PenBox size={18} />
              <span>Create Event</span>
            </div>
          </Button>
        </Link>

        <SignedOut>
          <SignInButton forceRedirectUrl="/dashboard">
            <Button variant={"outline"}>Login</Button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserMenu />
        </SignedIn>
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
