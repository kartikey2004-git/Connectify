"use server";

import { db } from "@/lib/prisma";
import { firstZodMessage, requireUser } from "@/lib/auth";
import { eventSchema } from "@/lib/validators";
import { getBookableSlots } from "@/lib/availability";
import { DEFAULT_TIME_ZONE } from "@/lib/time";

export async function createEvent(data) {
  const user = await requireUser();

  const validated = eventSchema.safeParse(data);

  if (!validated.success) {
    throw new Error(firstZodMessage(validated, "Invalid event data"));
  }

  return db.event.create({ data: { ...validated.data, userId: user.id } });
}

export async function getUserEvents() {
  const user = await requireUser();

  const events = await db.event.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { bookings: true } } },
  });

  // username is returned so the UI can build each event's public booking link
  return { events, username: user.username };
}

export async function deleteEvent(eventId) {
  const user = await requireUser();

  const event = await db.event.findUnique({ where: { id: eventId } });

  if (!event || event.userId !== user.id) {
    throw new Error("Event not found or unauthorized");
  }

  await db.event.delete({ where: { id: eventId } });

  return { success: true };
}

/** Public: no auth required, used by the booking page. */
export async function getEventDetails(username, eventId) {
  return db.event.findFirst({
    where: { id: eventId, user: { username } },
    include: {
      user: {
        select: { name: true, email: true, imageUrl: true, username: true },
      },
    },
  });
}

/**
 * Public: every bookable slot for an event over the booking window.
 * Slots are returned as UTC ISO instants plus the host's time zone; each viewer's browser
 * renders them in their own zone. Bookings are taken from all of the host's events, since
 * the host can't attend two at once.
 */
export async function getEventAvailability(eventId) {
  const event = await db.event.findUnique({
    where: { id: eventId },
    include: {
      user: {
        include: {
          availability: { select: { days: true, timeGap: true, timeZone: true } },
          bookings: {
            where: { endTime: { gt: new Date() } },
            select: { startTime: true, endTime: true },
          },
        },
      },
    },
  });

  if (!event || !event.user.availability) {
    return { timeZone: DEFAULT_TIME_ZONE, slots: [] };
  }

  const { availability, bookings } = event.user;
  const slots = getBookableSlots({ availability, bookings, duration: event.duration });

  return {
    timeZone: availability.timeZone,
    slots: slots.map((slot) => slot.toISOString()),
  };
}
