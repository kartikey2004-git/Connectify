"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import EventForm from "./event-form";

/** Opened by `?create=true` on any page; closing strips the param from the URL. */
export default function CreateEventDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const shouldOpen = searchParams.get("create") === "true";

  useEffect(() => {
    if (shouldOpen) setIsOpen(true);
  }, [shouldOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (shouldOpen) router.replace(pathname);
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => (open ? setIsOpen(true) : handleClose())}
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Event</DrawerTitle>
        </DrawerHeader>

        <EventForm onSubmitForm={handleClose} />

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
