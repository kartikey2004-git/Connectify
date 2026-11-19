export const dynamic = "force-dynamic";

import { getUserEvents } from "@/actions/events";
import EventCard from "@/components/events/event-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, PenBox } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";

export default function EventsPage() {
  return (
    <Suspense fallback={<EventsGridSkeleton />}>
      <Events />
    </Suspense>
  );
}

const Events = async () => {
  let result;

  try {
    result = await getUserEvents();
  } catch (error) {
    return (
      <ErrorState
        title="Failed to load events"
        description={error.message}
      />
    );
  }

  const { events = [], username = "" } = result || {};

  if (events.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="No events yet"
        description="Create your first event type to start sharing a booking link with others."
        action={
          <Button asChild>
            <Link href="/events?create=true">
              <PenBox className="h-4 w-4" />
              Create Event
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {events.map((event) => (
        <EventCard key={event.id} event={event} username={username} />
      ))}
    </div>
  );
};

function EventsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-2/3" />
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-20 rounded-md" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
          <CardFooter className="gap-2 pt-4">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
