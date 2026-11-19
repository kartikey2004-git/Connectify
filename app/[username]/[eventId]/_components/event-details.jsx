import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import UserAvatar from "@/components/user-avatar";

export default function EventDetails({ event }) {
  const { user } = event;

  return (
    <Card className="w-full">
      <CardContent>
        <h1 className="mb-6 text-2xl font-medium tracking-tight sm:text-3xl">{event.title}</h1>

        <div className="mb-6 flex items-center gap-4">
          <UserAvatar
            name={user.name}
            imageUrl={user.imageUrl}
            className="size-14"
            fallbackClassName="text-2xl"
          />
          <div>
            <h2 className="text-lg font-medium text-foreground">{user.name}</h2>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
        </div>

        <div className="mb-6 flex items-center text-muted-foreground">
          <Clock className="mr-3 size-4" />
          <span className="text-sm">{event.duration} minutes</span>
        </div>

        <p className="body-text">{event.description}</p>
      </CardContent>
    </Card>
  );
}
