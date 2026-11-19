import { Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import { getUserByUsername } from "@/actions/users";
import EventCard from "@/components/events/event-card";
import { EmptyState } from "@/components/ui/empty-state";
import UserAvatar from "@/components/user-avatar";

export async function generateMetadata({ params }) {
  const { username } = await params;
  const user = await getUserByUsername(username);

  if (!user) {
    return {
      title: "User Not Found | Connectify",
      description: "This user profile doesn't exist or has been removed.",
    };
  }

  const title = `${user.name}'s Profile | Connectify`;
  const description = `Book an event with ${user.name}. View available public events and schedules`;

  return {
    title,
    description,
    openGraph: { title, description, type: "profile" },
    twitter: { card: "summary", title, description },
  };
}

export default async function UserPage({ params }) {
  const { username } = await params;
  const user = await getUserByUsername(username);

  if (!user) {
    notFound();
  }

  return (
    <div className="page-shell">
      <div className="flex flex-col gap-5 border-b border-border/50 pb-8 sm:flex-row sm:items-end sm:pb-10">
        <UserAvatar
          name={user.name}
          imageUrl={user.imageUrl}
          className="size-24 sm:size-28"
          fallbackClassName="text-3xl"
        />
        <div className="min-w-0 flex-1 sm:pb-1">
          <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">{user.name}</h1>
          <p className="body-text mt-1 max-w-xl">
            Welcome to my scheduling page. Please select an event below to book a call with me
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mt-10">
        {user.events.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No public events available"
            description={`${user.name} hasn't published any bookable events yet.`}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {user.events.map((event) => (
              <EventCard key={event.id} username={username} event={event} isPublic />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
