"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getLatestUpdates() {
  const { userId } = await auth();

  // The auth() helper returns the Auth object of the currently active user,

  if (!userId) {
    throw new Error("Unauthorized: No user ID found.");
  }

  // Check user is present in database or not with the help of clerkUserId

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found in database.");
  }

  const now = new Date();

  const upcomingMeetings = await db.booking.findMany({
    where: {
      userId: user.id,
      startTime: { gte: now },
    },
    include: {
      event: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
    take: 3,
  });

  return upcomingMeetings
}
