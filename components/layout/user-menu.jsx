"use client";

import { UserButton } from "@clerk/nextjs";
import { ChartNoAxesGantt } from "lucide-react";

export default function UserMenu() {
  return (
    <UserButton appearance={{ elements: { avatarBox: "size-8" } }}>
      <UserButton.MenuItems>
        <UserButton.Link
          label="My Events"
          labelIcon={<ChartNoAxesGantt size={15} />}
          href="/events"
        />
        <UserButton.Action label="manageAccount" />
      </UserButton.MenuItems>
    </UserButton>
  );
}
