import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { generateUsername } from "@/lib/username";

/**
 * Mirrors a Clerk user into our database (create or update) and returns the row.
 * Also gives the Clerk user a generated username when they have none.
 * Safe to call repeatedly and concurrently: the write is an upsert.
 */
export async function syncClerkUser(clerkUserId) {
  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(clerkUserId);

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) throw new Error("No email found for this user");

  const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
  const username = clerkUser.username || generateUsername(name, clerkUser.id);

  if (!clerkUser.username) {
    await clerk.users.updateUser(clerkUser.id, { username });
  }

  const profile = { email, name, username, imageUrl: clerkUser.imageUrl };

  return db.user.upsert({
    where: { clerkUserId },
    update: profile,
    create: { clerkUserId, ...profile },
  });
}
