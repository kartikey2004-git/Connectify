"use server";

import { db } from "@/lib/prisma";
import { createBookingSchema } from "@/app/lib/validators";

export async function createBooking(bookingData) {
  try {
    // server-side validation, since this Server Action can be invoked directly and bypass the client's zodResolver

    const validated = createBookingSchema.safeParse(bookingData);

    if (!validated.success) {
      throw new Error(validated.error.errors[0]?.message || "Invalid booking data");
    }

    bookingData = validated.data;

    // Fetch the event

    const event = await db.event.findUnique({
      where: { id: bookingData.eventId },
    });

    if (!event) {
      throw new Error("Event not Found");
    }

    // Re-check the slot is still free server-side before booking it — availability is otherwise
    // only ever computed for display, so two concurrent bookers could otherwise both succeed.

    const requestedStart = new Date(bookingData.startTime);
    const requestedEnd = new Date(bookingData.endTime);

    const overlappingBooking = await db.booking.findFirst({
      where: {
        userId: event.userId,
        startTime: { lt: requestedEnd },
        endTime: { gt: requestedStart },
      },
    });

    if (overlappingBooking) {
      throw new Error(
        "This time slot is no longer available. Please select a different time.",
      );
    }

    // Create booking in database

    const booking = await db.booking.create({
      data: {
        eventId: event.id,
        userId: event.userId,
        name: bookingData.name,
        email: bookingData.email,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        additionalInfo: bookingData.additionalInfo,
      },
    });

    return { success: true, booking };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, error: error.message };
  }
}
