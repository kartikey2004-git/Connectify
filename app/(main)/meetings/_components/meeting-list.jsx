import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Calendar, Clock, Users } from "lucide-react";
import { format } from "date-fns";
import CancelMeetingButton from "./cancel-meeting";

// import { Button } from "@/components/ui/button";
// import CancelMeetingButton from "./cancel-meetings";

const MeetingList = ({ meetings, type }) => {
  if (meetings.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title={`No ${type} meetings`}
        description={
          type === "upcoming"
            ? "Meetings booked through your event links will show up here."
            : "Meetings you've completed or that have passed will show up here."
        }
      />
    );
  }
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {meetings.map((meeting) => {
        return (
          <Card
            key={meeting.id}
            className="flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {meeting.event.title}
              </CardTitle>
              <CardDescription className="text-sm">
                with {meeting.name}
              </CardDescription>

              {meeting.additionalInfo && (
                <CardDescription className="text-sm">
                  &quot;{meeting.additionalInfo}&quot;
                </CardDescription>
              )}
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="mr-3 h-4 w-4" />
                <span className="text-sm">
                  {format(new Date(meeting.startTime), "MMMM dd, yyyy")}
                </span>
              </div>

              <div className="flex items-center text-muted-foreground">
                <Clock className="mr-3 h-4 w-4" />
                <span className="text-sm">
                  {format(new Date(meeting.startTime), "h:mm a")} -{" "}
                  {format(new Date(meeting.endTime), "h:mm a")}
                </span>
              </div>
            </CardContent>

            {type === "upcoming" && (
              <CardFooter className="flex justify-between pt-4">
                <CancelMeetingButton meetingId={meeting.id} />
              </CardFooter>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default MeetingList;
