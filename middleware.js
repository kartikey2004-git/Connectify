import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/events(.*)",
  "/meetings(.*)",
  "/availability(.*)",
]);

/* createRouteMatcher :: Ye ek utility hai jo URL ko tumhare routes ke saath match karta hai.

 createRouteMatcher ek checker hai jo decide karta hai ki:  "Is URL ke liye kaunsa page ya component render hoga?"

  (.*) : Ye route kisi bhi path ke liye match karega"
  (basically, catch-all route)


 Returns a function that accepts a Request object and returns whether the request matches the list of predefined routes that can be passed in as the first argument.

*/



// authentication from clerk docs


// improve from recent docs of clerk 

// in github repo it's old version of authentication of code , here is prior version of authentication to clerk


export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  // console.log(userId,redirectToSignIn)

  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }
});



export const config = {
  matcher: [

    // Skip Next.js internals and all static files, unless found in search params

    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    // Always run for API routes

    "/(api|trpc)(.*)",
  ],
};

// In middleware.js we need to add protected routes