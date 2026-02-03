import React, { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserMeetings } from "@/actions/meetings";
import MeetingList from "./_components/meeting-list";

export const metadata = {
  title: "Your Meetings | Connectify",
  description: "View and manage your upcoming and past meetings",
};

const MeetingPage = () => {
  return (
    <Tabs defaultValue="upcoming" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="past">Past</TabsTrigger>
      </TabsList>
      <TabsContent value="upcoming" className="space-y-4">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-muted border-t-primary"></div>
              <span className="ml-3 text-muted-foreground">
                Loading upcoming meetings...
              </span>
            </div>
          }
        >
          <UpcomingMeetings />
        </Suspense>
      </TabsContent>
      <TabsContent value="past" className="space-y-4">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-muted border-t-primary"></div>
              <span className="ml-3 text-muted-foreground">
                Loading past meetings...
              </span>
            </div>
          }
        >
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

export default MeetingPage;
