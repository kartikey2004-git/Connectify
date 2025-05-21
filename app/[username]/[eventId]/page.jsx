import { getEventAvailability, getEventDetails } from "@/actions/events";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import EventDetails from "./_components/event-details";
import BookingForm from "./_components/booking-form";

// this is one of major reason using nextJS , it provides SEO capabilites to our app and make our apps rank on google

export async function generateMetadata({ params }) {
  // user params and we will fetch the details for that particular event

  const event = await getEventDetails(params.username, params.eventId);

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

  const event = await getEventDetails(params.username,params.eventId);

  const availability = await getEventAvailability(params.eventId)

  // console.log(availability);
  

  if (!event) {
    notFound(); // it will other things itself , that's why how efficient is nextJs in handling of these use cases
  }

  // console.log(event);

  return (
    <div className="flex flex-col justify-center lg:flex-row px-4 py-8">

       <EventDetails event = {event} />

       <Suspense
        fallback={
          <div className="flex justify-center items-center p-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
          </div>
        }
      >
        <BookingForm event={event} availability={availability}/>
      </Suspense>
    </div>
  );
}



/* 

We will try to make this in a way that this should be SEO ( Search Engine Optimisation ) friendly page , because this is a public page , 

   - so we need to set everything from meta data to server side rendering

*/
