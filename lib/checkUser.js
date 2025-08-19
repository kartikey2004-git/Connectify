// check user is logged in or not

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma.js";

export const checkUser = async () => {
  // console.log("✅ checkUser called");
  // 1. Get user from Clerk on server side

  const user = await currentUser();
  // console.log("📌 currentUser fetched:", user);
  // console.log(user)

  // The currentUser helper returns the Backend User object of the currently active user. It can be used in Server Components, Route Handlers, and Server Actions.

  if (!user) {
    console.error("No current user found");
    return null;
  }

  try {
    // 2. Check if user already exists in DB using clerkUserId

    const loggedInUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (loggedInUser) {
      // console.log("User already exists in Neon DB:", loggedInUser)
      // console.log("✅ User already exists in DB:", loggedInUser);
      return loggedInUser;
    }

    // console.log("ℹ️ User does not exist in DB. Creating new user...");

    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    // console.log("📝 Computed name:", name);

    const username = `${name.split(" ").join("-")}-${user.id.slice(-4)}`;

    // console.log("📝 Generated username:", username);

    /* 

      assign username to user because when user is created is for the very first time , user does not have username

      updateUser on the basis of user.id in both clerk and database

    */

    //  assign some user's username inside the clerk by default

    const ClerkClient = await clerkClient();

    const clerkUser = await ClerkClient?.users.getUser(user.id);

    // console.log("📌 Fetched clerkUser:", clerkUser);

    if (!clerkUser.username) {
      // console.log("ℹ️ Username not set in Clerk. Updating...");

      await ClerkClient.users.updateUser(user.id, {
        username: username,
      });
      // console.log("✅ Username updated in Clerk");
    } else {
      console.log("ℹ️ Username already exists in Clerk:", clerkUser.username);
    }

    //  update the username inside the database

    //  we use create method to create a resource or in our case a newUser

    //  4. Create new user in Prisma DB

    const newUser = await db.user.create({
      data: {
        clerkUserId: user?.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress || "",
        username: username,
      },
    });

    // console.log("✅ New user created in DB:", newUser);

    return newUser;
  } catch (error) {
    console.log(error);
  }
};
