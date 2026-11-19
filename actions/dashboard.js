"use server";

import { db } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { DEFAULT_TIME_ZONE } from "@/lib/time";

const LATEST_UPDATES_LIMIT = 3;

/** The next few bookings plus the time zone to display them in (the host's availability zone). */
export async function getLatestUpdates() {
  const user = await requireUser({ availability: true });

  const meetings = await db.booking.findMany({
    where: { userId: user.id, startTime: { gte: new Date() } },
    include: { event: { select: { title: true } } },
    orderBy: { startTime: "asc" },
    take: LATEST_UPDATES_LIMIT,
  });

  return { meetings, timeZone: user.availability?.timeZone ?? DEFAULT_TIME_ZONE };
}
