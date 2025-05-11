"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { useSearchParams, useRouter } from "next/navigation";

import EventForm from "./event-form";

export default function CreateEventDrawer() {

  const [IsOpen, setIsOpen] = useState(false);

  // state to tracker our drawer is open or not 

  // useRouter() : This hook gives access the router object inside the Pages Router.

  // useSearchParams() : A Client Component hook that lets you read the current URL's search parameters.

  const router = useRouter();
  // console.log(router);
  
  const searchParams = useSearchParams();

  useEffect(() => {
    const create = searchParams.get("create");

    if (create === "true") {
      setIsOpen(true);
    }
  }, [searchParams]);

  const handleClose = () => {
    setIsOpen(false);
    if (searchParams.get("create") === "true") {
      router.replace(window?.location?.pathname);
    }
  };

  return (
    <Drawer open={IsOpen} onClose={handleClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Event</DrawerTitle>
        </DrawerHeader>

        <EventForm
          onSubmitForm={() => {
            handleClose();
          }}
        />

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

/*

- useRouter Next.js ka ek hook hai jo tumhe help karta hai:
      
      - Page ke beech navigate karne me (programmatically)
      
      - URL ke query params nikalne me
      - Current route ka path check karne me
      - Route change karne me (push, replace, etc.)


router.push(url)	:: Naya page open karo

router.replace(url)	:: Navigate to the provided href. Replaces the current history entry.

router.pathname ::	Abhi ka route dikhata hai
router.query	:: URL ke query ya dynamic params deta hai

router.back()	:: Previous page pe le jaata hai
router.reload() ::	Page reload karta hai




- useSearchParams()  --> ye URL ke query params ko nikalne ka naya aur better tareeka hai.
Ye sirf client components me kaam karta hai.

   - searchParams.get('key')	Ek param ka value deta hai



- URL ke query params nikaalne hain? ➔ useSearchParams() use karo (App Router me).

- Dynamic route ke [slug] params chahiye? ➔ useParams() use karo.


*/