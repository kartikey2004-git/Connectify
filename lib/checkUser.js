// check user is logged in or not

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {

  // get user from clerk on server side

  const user = await currentUser()
  // console.log(user)

  // The currentUser helper returns the Backend User object of the currently active user. It can be used in Server Components, Route Handlers, and Server Actions.

  if (!user) {
    console.error("No current user found");
    return null;
  }

  try {
    // check user is already present in database or not , with help of clerkUserId

    const loggedInUser = await db?.user.findUnique({
      where: { clerkUserId: user.id },
    })

    if (loggedInUser) {
      // console.log("User already exists in Neon DB:", loggedInUser)

      return loggedInUser;
    }

    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim()

    /* 

      assign username to user because when user is created is for the very first time , user does not have username

      updateUser on the basis of user.id in both clerk and database

    */

    // assign some user's username inside the clerk by default

    if (clerkClient && clerkClient.users) {

      await clerkClient.users.updateUser(user.id, {
        username : name.split(" ").join("-") + user.id.slice(-4),
      });

    } else {
      console.error("Error in updating the username in clerk");
    }

    /* update the username inside the database

     we use create method to create a resource or in our case a newUser  */



    //  4. Create new user in Prisma DB

    const newUser = await db?.user.create({
      data: {
        clerkUserId: user.id,
        name ,
        imageUrl: user.imageUrl,
        email : user.emailAddresses[0].emailAddress || "" ,
        username : name.split(" ").join("-") + user.id.slice(-4),
      },
    });

    return newUser
  } catch (error) {
    console.log(error);
  }
}