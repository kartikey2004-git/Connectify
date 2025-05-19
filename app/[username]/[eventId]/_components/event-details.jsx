import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock } from "lucide-react";
import React from "react";

const EventDetails = ({ event }) => {
  const { user } = event;

  // console.log("haha",user)
  // console.log("hannnnnnnnn",event)

  return (
    <div className="p-10 lg:w-1/3 bg-white">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

      <div className="flex items-center mb-4">
        <Avatar className="w-18 h-18 mr-4 border-4  shadow-lg rounded-full">
          {user?.imageUrl ? (
            <AvatarImage
              src={user.imageUrl}
              alt={user?.name || "User"}
              className="object-cover w-full h-full rounded-full"
            />
          ) : (
            <AvatarFallback className="bg-muted text-muted-foreground flex items-center justify-center text-3xl font-semibold">
              {user.name.charAt(0)}
            </AvatarFallback>
          )}
        </Avatar>

        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-600">@{user.username}</p>
        </div>
      </div>

      {/* Show the more information about this call  */}

      <div className="flex items-center mb-4">
        <Clock className="mr-2" />
        <span>{event.duration} minutes</span>
      </div>

      <div className="flex items-center mb-4">
        <Calendar className="mr-2" />
        <span>Google Meet</span>
      </div>

      <p className="text-gray-700">{event.description}</p>
    </div>
  );
};

export default EventDetails;
