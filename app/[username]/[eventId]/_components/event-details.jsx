import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock } from "lucide-react";

const EventDetails = ({ event }) => {
  const { user } = event;

  // console.log("haha",user)
  // console.log("hannnnnnnnn",event)

  return (
    <div className="p-8 lg:w-1/3 bg-card rounded-xl border shadow-sm">
      <h1 className="text-2xl font-semibold mb-6 text-foreground">
        {event.title}
      </h1>

      <div className="flex items-center mb-6">
        <Avatar className="w-16 h-16 mr-4 border-2 shadow-lg rounded-full">
          {user?.imageUrl ? (
            <AvatarImage
              src={user.imageUrl}
              alt={user?.name || "User"}
              className="object-cover w-full h-full rounded-full"
            />
          ) : (
            <AvatarFallback className="bg-muted text-muted-foreground flex items-center justify-center text-2xl font-semibold">
              {user.name.charAt(0)}
            </AvatarFallback>
          )}
        </Avatar>

        <div>
          <h2 className="text-lg font-semibold text-foreground">{user.name}</h2>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center text-muted-foreground">
          <Clock className="w-4 h-4 mr-3" />
          <span className="text-sm">{event.duration} minutes</span>
        </div>

        <div className="flex items-center text-muted-foreground">
          <Calendar className="w-4 h-4 mr-3" />
          <span className="text-sm">Google Meet</span>
        </div>
      </div>

      <p className="text-muted-foreground leading-relaxed">
        {event.description}
      </p>
    </div>
  );
};

export default EventDetails;
