"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink } from "lucide-react";
import { updateUsername } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/use-fetch";
import { usernameSchema } from "@/lib/validators";

/** Lets the user pick the username used in their public booking link. */
export default function UsernameCard() {
  const { user } = useUser();
  const currentUsername = user?.username;

  // window.location.origin is unknown during SSR; set after mount to avoid a hydration mismatch.
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(usernameSchema) });

  useEffect(() => {
    if (currentUsername) setValue("username", currentUsername);
  }, [currentUsername, setValue]);

  const { loading, error, fn: runUpdateUsername } = useFetch(updateUsername);

  const onSubmit = async ({ username }) => {
    const result = await runUpdateUsername(username);

    // Clerk's in-browser copy of the user doesn't change on its own when the server updates the
    // username; reload it so "View Public Profile" points at the new one.
    if (result?.success) await user.reload();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Unique Link</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 rounded-md border bg-muted/30 p-3">
              <span className="text-sm text-muted-foreground">{origin}/</span>
              <Input
                {...register("username")}
                aria-label="Username"
                placeholder="username"
                className="border-0 bg-transparent focus-visible:ring-0"
              />
            </div>
            <FieldError message={errors.username?.message} />
            <FieldError message={error?.message} />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Username"}
            </Button>
            {currentUsername && (
              <Button variant="outline" asChild>
                <a href={`/${currentUsername}`} target="_blank" rel="noreferrer">
                  <ExternalLink />
                  View Public Profile
                </a>
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
