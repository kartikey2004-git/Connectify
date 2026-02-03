"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usernameSchema } from "@/app/lib/validators";
import { useEffect } from "react";
import useFetch from "@/hooks/use-fetch";
import { updateUsername } from "@/actions/users";
import { BarLoader } from "react-spinners";
import { getLatestUpdates } from "@/actions/dashboard";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";

const Dashboard = () => {
  const { isLoaded, user } = useUser();

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
  }, [isLoaded]);

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
            <p className="text-muted-foreground">Loading updates...</p>
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
                  {typeof window !== "undefined" ? window.location.origin : ""}/
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
              <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
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
