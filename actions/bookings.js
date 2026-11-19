"use server";

import { db } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { firstZodMessage } from "@/lib/auth";
import { getBookableSlots } from "@/lib/availability";
import { MS_PER_MINUTE } from "@/lib/constants";
import { createBookingSchema } from "@/lib/validators";

const SLOT_UNAVAILABLE_MESSAGE =
  "This time slot is no longer available. Please select a different time.";

/** Thrown for failures the guest can act on; its message is shown as-is. */
class BookingError extends Error {}

export async function createBooking(bookingData) {
  try {
    // Server actions can be invoked directly, bypassing the client's zodResolver.
    const validated = createBookingSchema.safeParse(bookingData);

    if (!validated.success) {
      throw new BookingError(firstZodMessage(validated, "Invalid booking data"));
    }

    const { eventId, name, email, startTime, additionalInfo } = validated.data;

    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        user: { include: { availability: { include: { days: true } } } },
      },
    });

    if (!event) {
      throw new BookingError("Event not Found");
    }

    const { availability } = event.user;

    if (!availability) {
      throw new BookingError("This host has not set up their availability yet.");
    }

    const requestedStart = new Date(startTime);
    const requestedEnd = new Date(requestedStart.getTime() + event.duration * MS_PER_MINUTE);

    // Re-derive the bookable slots and check inside one serializable transaction, so the
    // check and the insert cannot interleave with another booking for the same host.
    // The client only picks a slot; it cannot choose a time the host didn't offer.
    const booking = await db.$transaction(
      async (tx) => {
        const bookings = await tx.booking.findMany({
          where: { userId: event.userId, endTime: { gt: new Date() } },
          select: { startTime: true, endTime: true },
        });

        const slots = getBookableSlots({ availability, bookings, duration: event.duration });

        if (!slots.some((slot) => slot.getTime() === requestedStart.getTime())) {
          throw new BookingError(SLOT_UNAVAILABLE_MESSAGE);
        }

        return tx.booking.create({
          data: {
            eventId: event.id,
            userId: event.userId,
            name,
            email,
            startTime: requestedStart,
            endTime: requestedEnd,
            additionalInfo,
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    return { success: true, booking };
  } catch (error) {
    console.error("Error creating booking:", error);

    // P2034: a concurrent booking won the race for the same host's time.
    if (error.code === "P2034") {
      return { success: false, error: SLOT_UNAVAILABLE_MESSAGE };
    }

    // Anything that isn't an expected, guest-actionable failure keeps its details in the log only.
    return {
      success: false,
      error: error instanceof BookingError ? error.message : "Something went wrong. Please try again.",
    };
  }
}
