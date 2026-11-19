import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getEventAvailability, getEventDetails } from "@/actions/events";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import BookingForm from "./_components/booking-form";
import EventDetails from "./_components/event-details";

const SKELETON_SLOTS = 9;

export async function generateMetadata({ params }) {
  const { eventId, username } = await params;
  const event = await getEventDetails(username, eventId);

  if (!event) {
    return {
      title: "Event Not Found | Connectify",
      description: "This Event Details doesn't exist or has been removed.",
    };
  }

  const title = `Book ${event.title} with ${event.user.name} | Connectify`;
  const summary = `Schedule a ${event.duration}-minute ${event.title} event with ${event.user.name}.`;

  return {
    title,
    description: `${summary} Check availability and book now on Connectify.`,
    openGraph: { title, description: summary },
    twitter: { card: "summary_large_image", title, description: summary },
  };
}

function BookingFormSkeleton() {
  return (
    <Card className="w-full p-8">
      <div className="flex flex-col gap-6 md:h-96 md:flex-row">
        <Skeleton className="h-72 w-full rounded-lg md:h-full" />
        <div className="grid w-full grid-cols-2 gap-2 lg:grid-cols-3">
          {Array.from({ length: SKELETON_SLOTS }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
    </Card>
  );
}

export default async function EventPage({ params }) {
  const { username, eventId } = await params;
  const event = await getEventDetails(username, eventId);

  if (!event) {
    notFound();
  }

  const availability = await getEventAvailability(eventId);

  return (
    <div className="page-shell flex flex-col gap-6">
      <EventDetails event={event} />
      <Suspense fallback={<BookingFormSkeleton />}>
        <BookingForm event={event} availability={availability} />
      </Suspense>
    </div>
  );
}
