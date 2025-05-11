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

const Dashboard = () => {
  const { isLoaded, user } = useUser();

  // useUser() : gives you access to the current signed-in user's details, authentication state, and some utility functions

  // console.log(user);
  console.log(user?.username);
  

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

  const {
    loading,
    error,
    fn: fnUpdateUsername,
  } = useFetch(updateUsername);

  const onSubmit = async (data) => {
    fnUpdateUsername(data.username);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user?.firstName}</CardTitle>
        </CardHeader>

        {/* Latest Updates or whatever if someone has booked call with us the upcoming calls */}

      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Unique Link</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>

              <div className="flex items-center gap-2">
                <span>
                  {typeof window !== "undefined" ? window.location.origin : ""}
                </span>
                <Input {...register("username")} placeholder="username" />
              </div>

              {errors.username && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}

              {/* errors from formState is used to rendering the errors related to validations */}

              {error && (
                <p className="text-red-600 text-sm mt-1">{error?.message}</p>
              )}
            </div>

            {loading && (
              <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
            )}
            <Button type="submit">Update Username</Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;