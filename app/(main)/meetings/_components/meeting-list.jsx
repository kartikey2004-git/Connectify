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
import { Calendar, Clock, Video } from "lucide-react";
import { format } from "date-fns";
import CancelMeetingButton from "./cancel-meeting";

// import { Button } from "@/components/ui/button";
// import CancelMeetingButton from "./cancel-meetings";

const MeetingList = ({ meetings, type }) => {
  if (meetings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No {type} meetings found</p>
      </div>
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
                <CardDescription className="text-sm italic">
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

              {meeting.meetLink && (
                <div className="flex items-center">
                  <Video className="mr-3 w-4 h-4 text-muted-foreground" />
                  <a
                    href={meeting.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium text-sm"
                  >
                    Join Meeting
                  </a>
                </div>
              )}
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
