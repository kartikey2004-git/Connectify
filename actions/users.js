"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { firstZodMessage } from "@/lib/auth";
import { usernameSchema } from "@/lib/validators";

export async function updateUsername(username) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Server actions can be invoked directly, bypassing the client's zodResolver.
  const validated = usernameSchema.safeParse({ username });

  if (!validated.success) {
    throw new Error(firstZodMessage(validated, "Invalid username"));
  }

  const nextUsername = validated.data.username;

  const existing = await db.user.findUnique({ where: { username: nextUsername } });

  if (existing && existing.clerkUserId !== userId) {
    throw new Error("Username is already taken");
  }

  // Update Clerk first (awaited) so a failure there doesn't leave the DB and Clerk out of sync.
  const clerk = await clerkClient();
  await clerk.users.updateUser(userId, { username: nextUsername });

  await db.user.update({
    where: { clerkUserId: userId },
    data: { username: nextUsername },
  });

  return { success: true };
}

/** Public: profile and public events for a username page. */
export async function getUserByUsername(username) {
  return db.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      email: true,
      imageUrl: true,
      events: {
        where: { isPrivate: false },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          duration: true,
          isPrivate: true,
          _count: { select: { bookings: true } },
        },
      },
    },
  });
}
