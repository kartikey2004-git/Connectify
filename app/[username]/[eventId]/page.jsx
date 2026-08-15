import { getEventAvailability, getEventDetails } from "@/actions/events";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import EventDetails from "./_components/event-details";
import BookingForm from "./_components/booking-form";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// this is one of major reason using nextJS , it provides SEO capabilites to our app and make our apps rank on google

export async function generateMetadata({ params }) {
  // user params and we will fetch the details for that particular event

  const { eventId, username } = await params;

  const event = await getEventDetails(username, eventId);

  if (!event) {
    return {
      title: "Event Not Found | Connectify",
      description: "This Event Details doesn't exist or has been removed.",
    };
  }

  // console.log("bhhhhhhhhhhhhhhhhh",event);

  return {
    title: `Book ${event.title} with ${event.user.name} | Connectify`,

    description: `Schedule a ${event.duration}-minute ${event.title} event with ${event.user.name}. Check availability and book now on Connectify.`,

    openGraph: {
      title: `Book ${event.title} with ${event.user.name} | Connectify`,
      description: `Schedule a ${event.duration}-minute ${event.title} event with ${event.user.name}.`,
    },

    twitter: {
      card: "summary_large_image",
      title: `Book ${event.title} with ${event.user.name} | Connectify`,
      description: `Schedule a ${event.duration}-minute ${event.title} event with ${event.user.name}.`,
    },
  };
}

export default async function EventPage({ params }) {
  // console.log(params.username);

  const { username, eventId } = await params;

  const event = await getEventDetails(username, eventId);

  const availability = await getEventAvailability(eventId);

  // console.log(availability);

  if (!event) {
    notFound(); // it will other things itself , that's why how efficient is nextJs in handling of these use cases
  }

  // console.log(event);

  return (
    <div className="app-container flex max-w-6xl flex-col gap-8 py-8 sm:py-10 lg:flex-row lg:justify-center">
      <EventDetails event={event} />

      <Suspense fallback={<BookingFormSkeleton />}>
        <BookingForm event={event} availability={availability} />
      </Suspense>
    </div>
  );
}

function BookingFormSkeleton() {
  return (
    <Card className="w-full p-8 lg:w-2/3">
      <div className="flex flex-col gap-6 md:h-96 md:flex-row">
        <Skeleton className="h-72 w-full rounded-lg md:h-full" />
        <div className="grid w-full grid-cols-2 gap-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full rounded-md" />
          ))}
        </div>
      </div>
    </Card>
  );
}

/*

We will try to make this in a way that this should be SEO ( Search Engine Optimisation ) friendly page , because this is a public page ,

   - so we need to set everything from meta data to server side rendering

*/
