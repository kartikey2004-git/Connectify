import { Calendar, Clock, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatInTimeZone } from "@/lib/time";
import CancelMeetingButton from "./cancel-meeting";

const EMPTY_DESCRIPTIONS = {
  upcoming: "Meetings booked through your event links will show up here.",
  past: "Meetings you've completed or that have passed will show up here.",
};

function MeetingCard({ meeting, timeZone, canCancel }) {
  const at = (date, pattern) => formatInTimeZone(date, timeZone, pattern);

  return (
    <Card className="flex flex-col justify-between md:hover:bg-accent/40">
      <CardHeader>
        <CardTitle className="text-lg">{meeting.event.title}</CardTitle>
        <CardDescription>with {meeting.name}</CardDescription>
        {meeting.additionalInfo && (
          <CardDescription>&quot;{meeting.additionalInfo}&quot;</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-muted-foreground">
          <Calendar className="mr-3 size-4" />
          <span className="text-sm">{at(meeting.startTime, "MMMM dd, yyyy")}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Clock className="mr-3 size-4" />
          <span className="text-sm">
            {at(meeting.startTime, "h:mm a")} - {at(meeting.endTime, "h:mm a")}
          </span>
        </div>
      </CardContent>
      {canCancel && (
        <CardFooter className="pt-4">
          <CancelMeetingButton meetingId={meeting.id} />
        </CardFooter>
      )}
    </Card>
  );
}

export default function MeetingList({ meetings, timeZone, type }) {
  if (meetings.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title={`No ${type} meetings`}
        description={EMPTY_DESCRIPTIONS[type]}
      />
    );
  }

  return (
    <div className="space-y-4">
      <p className="body-text">Times shown in {timeZone}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {meetings.map((meeting) => (
          <MeetingCard
            key={meeting.id}
            meeting={meeting}
            timeZone={timeZone}
            canCancel={type === "upcoming"}
          />
        ))}
      </div>
    </div>
  );
}
