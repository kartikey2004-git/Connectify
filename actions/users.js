"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function updateUsername(username) {
  // we need to check that user who is trying to update username belongs to that particular account , authorized user hona chahiye

  const { userId } = await auth();

  // used for verifying user is loggedIn or not

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // check username is already taken or not in database

  const existingusername = await db.user.findUnique({
    where: { username },
  });

  // one who is trying to change the username is not proper user ,they don't have the authorisation permissions

  if (existingusername && existingusername.id !== userId) {
    throw new Error("Username is already taken");
  }

  if (!clerkClient) {
    throw new Error("Clerk client is not initialized properly");
  }

  // update username  of user , change username on basis of clerkUserId in database

  await db.user.update({
    where: { clerkUserId: userId },
    data: { username },
  });

  // update username in clerk also with userID

  (await clerkClient())?.users?.updateUser?.(userId, {
    username,
  });

  return { sucess: true };
}


export async function getUserByUsername(username) {

  // We will fetch the data for that particular user with respect to username from params

  // we don't need to check if user is loggedIn or not ( authentication or authorisation )

  // we just fetching the public data

  const user = await db.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      email: true,
      imageUrl: true,
      events: {
        where: {
          isPrivate: false, // coz we need just show public events
        },
        orderBy: {
          createdAt: "desc", // sort data by the createdAt field in descending order (i.e., most recent first).
        },
        select: {
          id: true,
          title: true,
          description: true,
          duration: true,
          isPrivate: true,
          // no of bookings for particular event
          _count: {
            select: { bookings: true },
          },
        },
      },
    },
  });

  return user
}