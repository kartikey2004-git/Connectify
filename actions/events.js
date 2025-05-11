"use server";

import { eventSchema } from "@/app/lib/validators";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// Api to create a event in our database

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

    // console.log(" mcccccccc Raw Event Data Received:", data);

    // Validate the input data against Zod schema

    const validatedData = eventSchema.safeParse(data);

    //  console.log("Validated Event Data:", validatedData);

    // console.log("User ID:", userId);

    // Check user is present in database or not with the help of clerkUserId

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found in database.");
    }

    // Create event inside our database

    const event = await db.event.create({
      data: {
        ...validatedData.data,
        userId: user?.id, // this is the user ID that is unique to our database that is stored inside neon DB
      },
    });

    return event;
  } catch (error) {
    console.error(" Error in createEvent:", error);
  }
}

// Api to fetch all events from our database

export async function getUserEvents() {
  try {
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

    const events = await db.event.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },

      // You are telling the database or API to sort the results : Sort in descending order (latest/newest records come first).

      // I want to include all of the bookings made for this particular event and gives us the count of the bookings on that event

      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });

    // console.log(events)

    // FindMany :: Arguments to filter and select certain fields only.

    // Find zero or more Users that matches the filter. Note, that providing undefined is treated as the value not being there.

    return { events, username: user.username };

    // return username because we have a copy feature , when copy it gives us the link with username and the eventId , that's why we need username
  } catch (error) {
    console.error(" Error in fetching Events:", error);
  }
}

// Api delete event from our database

export async function DeleteEvent(eventId) {
  try {
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

    // check event is present inside the database with current eventId

    const event = await db.event.findUnique({
      where: {
        id: eventId,
      },
    });

    // check if event does not exist or event does not belong to that particular user :: event ki jo userId hai wo loggedIn user id ke equal nahi hai

    if (!event || event.userId !== user.id) {
      throw new Error("Event not found or unauthorized");
    }

    await db.event.delete({
      where: {
        id: eventId,
      },
    });

    return { success : true }

  } catch (error) {
    console.error(" Error in fetching Events:", error);
  }
}
