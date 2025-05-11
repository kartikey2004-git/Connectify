"use client"

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Link, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { DeleteEvent } from "@/actions/events";

const EventCard = ({ event, username, isPublic = false }) => {

  // state to check copy process is going on or right or not 

  const [isCopied, setIsCopied] = useState(false)
  const router = useRouter()

  // we use router to refreshing our page after deleting the event
  

  // useRouter() : This hook allows you to programmatically change routes inside Client Component.

  // navigator is inbuilt inside the browser and write something inside of our navigator

  // logic for copy button to copy the link containing the origin url and username and the event id

  const handleCopy = async () => {
    try {

      await navigator.clipboard.writeText(`${window.location.origin}/${username}/${event.id}`)

      setIsCopied(true)
      setTimeout(() => setIsCopied(false),2000)

    } catch (error) {
      console.error("Failed to copy");
    }
  }


  const { 
    loading,
    fn : fnDeleteEvent
  } = useFetch(DeleteEvent)

  const handleDelete = async () => {

    // I will prompt the user by saying that are you sure you want to delete this event 

    if(window?.confirm("Are you sure you want to delete this event?")) {
      await fnDeleteEvent(event.id)
      router.refresh()
    }
  }

  useEffect(() => {

  })


  return (
    <Card className="flex flex-col justify-between cursor-pointer">
      <CardHeader>
        <CardTitle className="text-2xl">{event.title}</CardTitle>

        <CardDescription className="flex justify-between">
          <span>
            {event.duration} mins | {event.isPrivate ? "Private" : "Public"}
          </span>

          <span>{event._count.bookings} Bookings</span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p>{event.description}</p>
      </CardContent>

      {!isPublic && (
        <CardFooter className="flex gap-2">
          <Button variant="outline" className="flex items-center" onClick = {handleCopy}>
            <Link className="mr-2 h-4 w-4"/>
            {isCopied ? "Copied!" : "Copy Link"}
          </Button>

          <Button variant="destructive" onClick={handleDelete} disabled = {loading}>
            <Trash2 className="mr-2 h-4 w-4" />
             {loading ? "Deleting...." : "Delete"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default EventCard;



// {event.description.substring(0,event.description.indexOf("."))}  if needed

// we add copy link button for event link and delete event button

// on our custom user page , we only want to show public events , on isPublic = true , we show public events 

// and we will not render the copy link and delete event button
