import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { syncClerkUser } from "@/lib/sync-user";

/**
 * Resolves the signed-in Clerk user to our database user.
 * Throws when there is no session. If the user has not been synced yet (for
 * example they signed in and went straight to a protected page), they are
 * created on the spot.
 * Pass a Prisma `include` object to load relations alongside the user.
 */
export async function requireUser(include) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const findUser = () =>
    db.user.findUnique({
      where: { clerkUserId: userId },
      ...(include && { include }),
    });

  let user = await findUser();

  if (!user) {
    await syncClerkUser(userId);
    user = await findUser();
  }

  if (!user) {
    throw new Error("User not found in database.");
  }

  return user;
}

/** Returns the first validation message from a failed zod result. */
export function firstZodMessage(result, fallback) {
  return result.error.errors[0]?.message || fallback;
}
