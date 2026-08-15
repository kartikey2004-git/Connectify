"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usernameSchema } from "@/app/lib/validators";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { updateUsername } from "@/actions/users";
import { BarLoader } from "react-spinners";
import { Skeleton } from "@/components/ui/skeleton";
import { getLatestUpdates } from "@/actions/dashboard";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { POST_AUTH_REDIRECT_KEY } from "@/components/create-event-link";

const Dashboard = () => {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const [origin, setOrigin] = useState("");

  // If the user arrived here via the sign-in redirect after clicking "Create Event"
  // while logged out, honor that intent instead of leaving them stranded on the dashboard.
  useEffect(() => {
    const pendingRedirect = sessionStorage.getItem(POST_AUTH_REDIRECT_KEY);
    if (pendingRedirect) {
      sessionStorage.removeItem(POST_AUTH_REDIRECT_KEY);
      router.replace(pendingRedirect);
    }
  }, [router]);

  // window.location.origin isn't known during SSR, so it's set post-mount to avoid a hydration mismatch
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // useUser() : gives you access to the current signed-in user's details, authentication state, and some utility functions

  // console.log(user);
  // console.log(user?.username);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(usernameSchema),
  });

  // whenever user object is loaded , we want to provide the default value of input to be username

  useEffect(() => {
    if (isLoaded && user?.username) {
      setValue("username", user?.username);
    }
  }, [isLoaded, user]);

  // TO fetch data , we need to use useEffect or to update our data , we would need to write things like loading , error : Fetching an API

  const { loading, error, fn: fnUpdateUsername } = useFetch(updateUsername);

  const onSubmit = async (data) => {
    fnUpdateUsername(data.username);
  };

  const {
    loading: loadingUpdates,
    data: upcomingMeetings,
    fn: fnUpdates,
  } = useFetch(getLatestUpdates);

  useEffect(() => {
    (async () => await fnUpdates())();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Welcome, {user?.firstName}</CardTitle>
        </CardHeader>

        {/* Latest Updates or whatever if someone has booked call with us the upcoming calls */}

        <CardContent>
          {!loadingUpdates ? (
            <div>
              {upcomingMeetings && upcomingMeetings.length > 0 ? (
                <ul className="space-y-2">
                  {upcomingMeetings?.map((meeting) => (
                    <li
                      key={meeting.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {meeting.event.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(
                            new Date(meeting.startTime),
                            "MMM d, yyyy h:mm a",
                          )}{" "}
                          with {meeting.name}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No upcoming meetings...</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                >
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-56" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Unique Link</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <div className="flex items-center gap-2 p-3 rounded-md border bg-muted/30">
                <span className="text-sm text-muted-foreground">
                  {origin}/
                </span>
                <Input
                  {...register("username")}
                  placeholder="username"
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              {errors.username && (
                <p className="text-destructive text-sm mt-2">
                  {errors.username.message}
                </p>
              )}

              {/* errors from formState is used to rendering the errors related to validations */}

              {error && (
                <p className="text-destructive text-sm mt-2">
                  {error?.message}
                </p>
              )}
            </div>

            {loading && (
              <BarLoader className="mb-4" width={"100%"} color="currentColor" />
            )}

            <div className="flex gap-2">
              <Button type="submit">Update Username</Button>
              {user?.username && (
                <Button
                  variant="outline"
                  onClick={() => window.open(`/${user.username}`, "_blank")}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Public Profile
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
