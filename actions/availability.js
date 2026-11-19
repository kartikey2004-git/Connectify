"use server";

import { db } from "@/lib/prisma";
import { firstZodMessage, requireUser } from "@/lib/auth";
import { availabilitySchema } from "@/lib/validators";
import { toAvailabilityFormData, toDayAvailabilityRows } from "@/lib/availability";

export async function getUserAvailability() {
  const user = await requireUser({ availability: { include: { days: true } } });

  if (!user.availability) {
    return null;
  }

  return toAvailabilityFormData(user.availability);
}

export async function updateAvailability(data) {
  const user = await requireUser({ availability: true });

  // Server actions can be invoked directly, bypassing the client's zodResolver.
  const validated = availabilitySchema.safeParse(data);

  if (!validated.success) {
    throw new Error(firstZodMessage(validated, "Invalid availability data"));
  }

  const { timeGap, timeZone } = validated.data;
  const days = toDayAvailabilityRows(validated.data);

  if (user.availability) {
    await db.availability.update({
      where: { id: user.availability.id },
      data: { timeGap, timeZone, days: { deleteMany: {}, create: days } },
    });
  } else {
    await db.availability.create({
      data: { userId: user.id, timeGap, timeZone, days: { create: days } },
    });
  }

  return { success: true };
}
