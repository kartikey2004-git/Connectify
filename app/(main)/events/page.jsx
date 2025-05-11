import { getUserEvents } from '@/actions/events'
import EventCard from '@/components/event-card'
import React, { Suspense } from 'react'


export default function EventsPage() {
  return (
    <Suspense fallback = {
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-3 text-blue-600 font-medium">Loading Events...</span>
    </div>
    }>
      <Events/>
    </Suspense>
  )
}


const Events = async () => {

    const { events , username } = await getUserEvents()

    if(events.length === 0) {
      return <p> You haven&apos;t created any events yet.</p>
    }

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      { events.map((event) => (
        <EventCard key = {event.id} event = {event} username = {username}  />
      ))}
    </div>
  )
}


// how efficiently we can fetch data on server side , so that this loads pretty fast and I don't have to expose user any information

// Suspense : Lets you display a fallback until its children have finished loading.


// because we will fetch the events inside the Events component , if the data might not be available , so that we show some fallback UI



// this thing in Nextjs that we directly fetch the data inside our components just like this , in react it's not possible because it will rendered again and again

// these are server components

// EventCard is something which is used in multiple places like in our custom user pages when we show our public events 