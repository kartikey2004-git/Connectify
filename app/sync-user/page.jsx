import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { syncClerkUser } from "@/lib/sync-user";

/**
 * Post-auth landing route (Clerk redirects here after sign-in/up when there is
 * no page to return to). Mirrors the Clerk user into our database, then continues
 * to the dashboard.
 */
export default async function SyncUserPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  await syncClerkUser(userId);

  redirect("/dashboard");
}
