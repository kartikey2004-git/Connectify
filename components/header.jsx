import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { PenBox } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import UserMenu from "./user-menu";
import { checkUser } from "@/lib/checkUser";

const Header = async () => {

  await checkUser()

  return (
    <nav className="mx-auto py-2 px-4 flex justify-between items-center shadow-md border-b-2">

      <Link href={"/"} className="flex items-center">
        <Image
          src={"/logo.png"}
          width={"150"}
          height={"60"}
          alt="Schedulrr Logo"
          className="h-16 w-auto"
        />
      </Link>

      <div className="flex items-center gap-4">
        
        <Link href={"/events?create=true"}>
          <Button className={"flex items-center gap-2"}>
            <PenBox size={18} />
            Create Event
          </Button>
        </Link>

        <SignedOut>
        <SignInButton forceRedirectUrl="/dashboard">
        <Button variant={"outline"}>Login</Button>
        </SignInButton>
        </SignedOut>
        
        <SignedIn>
          <UserMenu/>
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