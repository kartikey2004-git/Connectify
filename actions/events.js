"use server";

import { eventSchema } from "@/app/lib/validators";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  addDays,
  addMinutes,
  endOfDay,
  format,
  isBefore,
  parseISO,
  startOfDay,
} from "date-fns";

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

    // delete event from database on basis of  userId

    await db.event.delete({
      where: {
        id: eventId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error(" Error in fetching Events:", error);
  }
}

// Api to fetch detail of particular event from our database

export async function getEventDetails(username, eventId) {
  // username,eventId dono params se mil jayengi , we are not doing any verication over here if user is loggedIn or not because this is a public data

  // Find the first User that matches the filter. Note, that providing undefined is treated as the value not being there.

  const event = await db.event.findFirst({
    where: {
      id: eventId,
      user: {
        username: username,
      },
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          imageUrl: true,
          username: true,
        },
      },
    },
  });

  // console.log(event)

  return event;
}

//  Api to fetch availability of user for particular event from our database

export async function getEventAvailability(eventId) {
  /*

  Humein is event ke details chahiye, lekin sabse pehle humein us user ki availability details fetch karni hain jisne ye event create kiya hai.


  Toh events table se humein user table ka data include karna padega

       - aur user table ke andar se humein availability fetch karni hai.

       - Isliye ab hum availability table ki taraf jaa rahe hain (yaani ab availability table ke andar jaa rahe hain). 

       - availability table se milega timeGap and days naam ka array jisme objects honge with
          
          - available day ( ki user jisne wo event create kiya wo kis din available hai )

          - startTime and endTime of that particular day 


      - bookings ke array mein startTime and endTime ISO format mein milega kyuki jab availability update kr rhe the toh waise hi database mein update ki gyi thi

      For more detailed : https://excalidraw.com/#json=Dk45iD-Vq3O7cB4Zrqy4A,EiDYiArMcAIDyB4zGEWaaA
  
  */

  const event = await db.event.findUnique({
    where: { id: eventId },

    // Is event ke details chahiye, lekin humein us user ki availability fetch karni hai jisne ye event create kiya hai.

    include: {
      user: {
        include: {
          availability: {
            select: {
              days: true,
              timeGap: true,
            },
          },

          /* 

          Humein is particular event ke liye us user ki bookings bhi chahiye.

          Lekin agar hum sirf user ke bookings fetch karein, toh humein uski saari bookings milengi.

          Par humein sirf usi event ke respect mein user ki bookings chahiye.

          */

          bookings: {
            select: {
              startTime: true,
              endTime: true,
            },
          },
        },
      },
    },
  });

  if (!event || !event.user.availability) {
    return [];
  }

  const { availability, bookings } = event.user;

  const startDate = startOfDay(new Date());

  const endDate = addDays(startDate, 30); // Get availability for the next 30 days

  const availableDates = [];

  for (let date = startDate; date <= endDate; date = addDays(date, 1)) {

    const dayOfWeek = format(date, "EEEE").toUpperCase();

    const dayAvailability = availability?.days?.find(
      (d) => d.day === dayOfWeek
    );

    if (dayAvailability) {

      const dateStr = format(date, "yyyy-MM-dd");

      const slots = generateAvailableTimeSlots(
        dayAvailability.startTime,
        dayAvailability.endTime,
        event.duration,
        bookings,
        dateStr,
        availability.timeGap
      );

      availableDates.push({
        date: dateStr,
        slots,
      });
    }
  }

  return availableDates;
}


function generateAvailableTimeSlots(
  startTime,
  endTime,
  duration,
  bookings,
  dateStr,
  timeGap = 0
) {

  const slots = [];

  let currentTime = parseISO(
    `${dateStr}T${startTime.toISOString().slice(11, 16)}`
  );

  const slotEndTime = parseISO(
    `${dateStr}T${endTime.toISOString().slice(11, 16)}`
  );

  // If the date is today, start from the next available slot after the current time

  const now = new Date();

  if (format(now, "yyyy-MM-dd") === dateStr) {
    currentTime = isBefore(currentTime, now)
      ? addMinutes(now, timeGap)
      : currentTime;
  }

  while (currentTime < slotEndTime) {

    const slotEnd = new Date(currentTime.getTime() + duration * 60000);

    const isSlotAvailable = !bookings.some((booking) => {
      
      const bookingStart = booking.startTime;
      const bookingEnd = booking.endTime;
      return (
        (currentTime >= bookingStart && currentTime < bookingEnd) ||
        (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
        (currentTime <= bookingStart && slotEnd >= bookingEnd)
      );
    });

    // push: Array mein naye elements add karne ke liye.  Ye naye elements ko array ke end mein add karta hai

    if (isSlotAvailable) {
      slots.push(format(currentTime, "HH:mm"));
    }

    currentTime = slotEnd;
  }

  return slots;
}
