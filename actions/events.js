"use server";

import { eventSchema } from "@/app/lib/validators";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createEvent(data) {
  try {
    const { userId } = await auth();

    /* 
    
    The auth() helper returns the Auth object of the currently active user, 

    Only works on the server-side, such as in Server Components, Route Handlers, and Server Actions.

    */

    if (!userId) {
      throw new Error("Unauthorized: No user ID found.");
    }

    // console.log(" Raw Event Data Received:", data);

    // Validate the input data against Zod schema

    const validatedData = eventSchema.safeParse(data);

     console.log("Validated Event Data:", validatedData);

    console.log("User ID:", userId);


    // Check user is present in database or not with the help of clerkUserId

    const user = await db?.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found in database.");
    }

    // Create event inside our database

    const event = await db?.event.create({
      data: {
        ...validatedData,
        userId: user?.id,
      },
    });

    return event;
  } catch (error) {
    console.error(" Error in createEvent:", error);
  }
}

// this is the user ID that is unique to our database that is stored inside neon DB
