import { getUserByUsername } from "@/actions/users";
import EventCard from "@/components/event-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { notFound } from "next/navigation";

// this is one of major reason using nextJS , it provides SEO capabilites to our app and make our apps rank on google

export async function generateMetadata({ params }) {
  // user params and we will fetch the data for that user

  const { username } = await params;

  const user = await getUserByUsername(username);

  // console.log(user)

  if (!user) {
    return {
      title: "User Not Found | Connectify",
      description: "This user profile doesn't exist or has been removed.",
    };
  }

  return {
    title: `${user.name}'s Profile | Connectify`,

    description: `Book an event with ${user.name}.
   View available public events and schedules`,

    openGraph: {
      title: `${user.name}'s Profile | Connectify`,
      description: `Book an event with ${user.name}. View available public events and schedules`,
      type: "profile",
    },

    twitter: {
      card: "summary",
      title: `${user.name}'s Profile | Connectify`,
      description: `Book an event with ${user.name}. View available public events and schedules`,
    },
  };
}

export default async function UserPage({ params }) {
  // console.log(params.username);

  const { username } = await params;

  const user = await getUserByUsername(username);

  // console.log(user)

  if (!user) {
    notFound(); // it will other things itself , that's why how efficient is nextJs in handling of these use cases
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col items-center mb-12">
        <Avatar className="w-24 h-24 mb-6 border-4 shadow-lg rounded-full">
          {user?.imageUrl ? (
            <AvatarImage
              src={user.imageUrl}
              alt={user?.fullName || "User"}
              className="object-cover w-full h-full rounded-full"
            />
          ) : (
            <AvatarFallback className="bg-muted text-muted-foreground flex items-center justify-center text-3xl font-semibold">
              {user.name.charAt(0)}
            </AvatarFallback>
          )}
        </Avatar>

        <h1 className="text-3xl font-semibold mb-3 text-foreground">
          {user.name}
        </h1>

        <p className="text-muted-foreground text-center max-w-md leading-relaxed">
          Welcome to my scheduling page. Please select an event below to book a
          call with me
        </p>
      </div>

      {user.events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No public events available</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {user.events.map((event) => {
            return (
              <EventCard
                key={event.id}
                username={username}
                event={event}
                isPublic
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

/* 

We will try to make this in a way that this should be SEO ( Search Engine Optimisation ) friendly page , because this is a public page , 

   - so we need to set everything from meta data to server side rendering

*/
