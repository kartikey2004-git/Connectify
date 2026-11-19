"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getLatestUpdates } from "@/actions/dashboard";
import useFetch from "@/hooks/use-fetch";
import UpcomingMeetingsCard from "./_components/upcoming-meetings-card";
import UsernameCard from "./_components/username-card";

export default function DashboardPage() {
  const { user } = useUser();
  const { data: updates, error, fn: loadUpdates } = useFetch(getLatestUpdates);

  useEffect(() => {
    loadUpdates();
  }, [loadUpdates]);

  return (
    <div className="space-y-6">
      <UpcomingMeetingsCard
        firstName={user?.firstName}
        updates={updates}
        error={error}
      />
      <UsernameCard />
    </div>
  );
}
