"use client";

import Link from "next/link";
import { PenBox } from "lucide-react";
import { Button } from "./ui/button";

// Key used to remember the user wanted to create an event across the sign-in redirect,
// since Clerk's forced post-auth redirect to /sync-user drops the original ?create=true intent.
export const POST_AUTH_REDIRECT_KEY = "connectx:postAuthRedirect";

const CreateEventLink = () => {
  return (
    <Link
      href={"/events?create=true"}
      onClick={() => {
        sessionStorage.setItem(POST_AUTH_REDIRECT_KEY, "/events?create=true");
      }}
    >
      <Button className="flex items-center gap-2">
        <PenBox size={18} className="block md:hidden" />
        <div className="hidden md:flex items-center gap-2">
          <PenBox size={18} />
          <span>Create Event</span>
        </div>
      </Button>
    </Link>
  );
};

export default CreateEventLink;
