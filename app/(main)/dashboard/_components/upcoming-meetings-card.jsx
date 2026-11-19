import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError } from "@/components/ui/field-error";
import { Skeleton } from "@/components/ui/skeleton";
import { formatInTimeZone } from "@/lib/time";

const SKELETON_ROWS = 2;

function MeetingRow({ meeting, timeZone }) {
  return (
    <li className="rounded-md bg-accent/40 p-3">
      <p className="font-medium text-foreground">{meeting.event.title}</p>
      <p className="text-sm text-muted-foreground">
        {formatInTimeZone(meeting.startTime, timeZone, "MMM d, yyyy h:mm a")} with {meeting.name}
      </p>
    </li>
  );
}

function MeetingRowSkeleton() {
  return (
    <div className="space-y-2 rounded-md bg-accent/40 p-3">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-3 w-56" />
    </div>
  );
}

/**
 * Greeting plus the next few upcoming bookings, shown in the host's time zone.
 * `updates` ({ meetings, timeZone }) is null until loaded.
 */
export default function UpcomingMeetingsCard({ firstName, updates, error }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Welcome, {firstName}</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <FieldError message={error.message} />
        ) : updates === null ? (
          <div className="space-y-2">
            {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
              <MeetingRowSkeleton key={i} />
            ))}
          </div>
        ) : updates.meetings.length === 0 ? (
          <p className="text-muted-foreground">No upcoming meetings</p>
        ) : (
          <ul className="space-y-2">
            {updates.meetings.map((meeting) => (
              <MeetingRow key={meeting.id} meeting={meeting} timeZone={updates.timeZone} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
