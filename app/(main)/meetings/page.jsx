import React, { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserMeetings } from "@/actions/meetings";
import MeetingList from "./_components/meeting-list";

export const metadata = {
  title: "Your Meetings | Connectify",
  description: "View and manage your upcoming and past meetings",
};

const MeetingPage = () => {
  return (
    <Tabs defaultValue="upcoming" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 max-w-100">
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="past">Past</TabsTrigger>
      </TabsList>
      <TabsContent value="upcoming" className="space-y-4">
        <Suspense fallback={<MeetingsGridSkeleton />}>
          <UpcomingMeetings />
        </Suspense>
      </TabsContent>
      <TabsContent value="past" className="space-y-4">
        <Suspense fallback={<MeetingsGridSkeleton />}>
          <PastMeetings />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
};

async function UpcomingMeetings() {
  const meetings = await getUserMeetings("upcoming");
  return <MeetingList meetings={meetings} type={"upcoming"} />;
}

async function PastMeetings() {
  const meetings = await getUserMeetings("past");
  return <MeetingList meetings={meetings} type={"past"} />;
}

function MeetingsGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </CardContent>
          <CardFooter className="pt-4">
            <Skeleton className="h-9 w-32 rounded-md" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default MeetingPage;
