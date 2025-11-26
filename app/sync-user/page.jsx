"use server";

import { clerkClient, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";

export default async function SyncUser() {
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);

  const email = user.emailAddresses[0]?.emailAddress;
  if (!email) throw new Error("No email found for this user");

  const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const generatedUsername =
    user.username || `${name.split(" ").join("-")}-${user.id.slice(-4)}`;

  // If the Clerk user doesn't have a username, update it
  if (!user.username) {
    await clerk.users.updateUser(user.id, {
      username: generatedUsername,
    });
  }

  // Sync to Neon DB using Prisma
  await db.user.upsert({
    where: { clerkUserId: userId },
    update: {
      email,
      name,
      username: generatedUsername,
      imageUrl: user.imageUrl,
    },
    create: {
      clerkUserId: userId,
      email,
      name,
      username: generatedUsername,
      imageUrl: user.imageUrl,
    },
  });

  redirect("/dashboard");
}
