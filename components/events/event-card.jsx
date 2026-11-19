"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link2, Trash2 } from "lucide-react";
import { deleteEvent } from "@/actions/events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useFetch from "@/hooks/use-fetch";
import { COPY_FEEDBACK_MS } from "@/lib/constants";

/**
 * An event summary. Clicking the card opens its public booking page.
 * Pass `isPublic` on public profile pages to hide the owner-only actions.
 */
export default function EventCard({ event, username, isPublic = false }) {
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();
  const { loading: isDeleting, fn: runDeleteEvent } = useFetch(deleteEvent);

  const bookingPath = `/${username}/${event.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${bookingPath}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), COPY_FEEDBACK_MS);
    } catch (error) {
      console.error("Failed to copy link", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await runDeleteEvent(event.id);
      router.refresh();
    }
  };

  const handleCardClick = (e) => {
    // Ignore clicks on the action buttons (or their icons).
    if (e.target.closest("button")) return;
    window.open(`${window.location.origin}${bookingPath}`, "_blank");
  };

  return (
    <Card
      className="flex cursor-pointer flex-col justify-between md:hover:bg-accent/40"
      onClick={handleCardClick}
    >
      <CardHeader>
        <CardTitle className="text-xl">{event.title}</CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>
            {event.duration} mins | {event.isPrivate ? "Private" : "Public"}
          </span>
          <Badge variant="secondary">{event._count.bookings} Bookings</Badge>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {event.description}
        </p>
      </CardContent>

      {!isPublic && (
        <CardFooter className="gap-2 pt-4">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Link2 />
            {isCopied ? "Copied!" : "Copy Link"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
