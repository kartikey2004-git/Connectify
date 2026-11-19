"use server";

import { db } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { DEFAULT_TIME_ZONE } from "@/lib/time";

/** The host's meetings plus the time zone to display them in (their availability zone). */
export async function getUserMeetings(type = "upcoming") {
  const user = await requireUser({ availability: true });
  const isUpcoming = type === "upcoming";
  const now = new Date();

  const meetings = await db.booking.findMany({
    where: {
      userId: user.id,
      startTime: isUpcoming ? { gte: now } : { lt: now },
    },
    include: {
      event: {
        include: { user: { select: { name: true, email: true } } },
      },
    },
    orderBy: { startTime: isUpcoming ? "asc" : "desc" },
  });

  return { meetings, timeZone: user.availability?.timeZone ?? DEFAULT_TIME_ZONE };
}

export async function cancelMeeting(meetingId) {
  const user = await requireUser();

  const meeting = await db.booking.findUnique({ where: { id: meetingId } });

  if (!meeting || meeting.userId !== user.id) {
    throw new Error("Meeting not found or unauthorized");
  }

  await db.booking.delete({ where: { id: meetingId } });

  return { success: true };
}
