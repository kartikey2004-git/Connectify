"use server";

import { eventSchema } from "@/app/lib/validators";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createEvent(rawData) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: No user ID found.");
    }

    console.log("🔍 Raw Event Data Received:", rawData);

    // Validate the input data against Zod schema

    const validated = eventSchema.safeParse(rawData);

    if (!validated.success) {
      console.error(
        "❌ Zod Validation Error:",
        JSON.stringify(validated.error.format(), null, 2)
      );
      throw new Error("Invalid event data");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found in database.");
    }

    const event = await db?.event?.create({
      data: {
        ...validated,
        userId: user.id,
      },
    });

    return event;
  } catch (error) {
    console.error("🔥 Error in createEvent:", error);
  }
}
