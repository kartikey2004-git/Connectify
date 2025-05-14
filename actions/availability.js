"use server";

// actions or API's

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// API to get user availability

export async function getUserAvailability() {

  // first of all we fetch userId and check if user is loggedIn or not

  const { userId } = await auth();

  // The auth() helper returns the Auth object of the currently active user.

  if (!userId) {
    throw new Error("Unauthorized: No user ID found.");
  }

  // Check user is present in database or not with the help of clerkUserId

  /* 
  
  basically when user is fetching from db on basis of clerkUserId ,

   - then with user object , we also get availability related to that user and get all days related to that particular availability 
   
  */

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      availability: {
        include: {
          days: true,
        },
      },
    },
  });

  if (!user || !user.availability) {
    return null; // so that we can use the default value
  }

  // console.log("User after returning from database with field include availability with days inside it",user);



  // availabilityData.timeGap comes from user.availability.timeGap.

  
  // in availability data we set availability timeGap and all the other data that we will getting from our database and format this data in way we can read inside of our frontend 


  // Initializes availabilityData with timeGap

  const availabilityData = {
    timeGap: user.availability.timeGap,
  };


  /* 
  
  For each day (Mon-Sun):

       If that day exists in user.availability.days, then:
          
          - isAvailable: true
          - Get its startTime and endTime in "HH:MM" format.

      Else:
         
      - isAvailable: false
      - Defaults: startTime "09:00", endTime "17:00"
 
  */

  // availabilityData object that maps each day of the week to a structured entry showing whether the user is available, and what times they are available.



  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  
  /* 

  A function that accepts up to three arguments. 

  - forEach calls the callbackfn function one time for each element in the array.

  - Performs the specified action for each element in an array.

  - forEach loops through each item in the array,and we don't need to return anything

  */




  // find if this all of these days exists inside of our user availability

  daysOfWeek.forEach((day) => {


    // find() : Returns the value of the first element in the array where predicate is true, and undefined otherwise

    // It will be stored inside of database that's why we need to convert these in uppercase 

    /*
    
    Iterates through daysOfWeek.
      
    For each day:

         - Checks if that day exists in the user's availability (matching uppercase enum).

         - If it does, extracts startTime and endTime in "HH:MM" format.

         - If not, defaults to "09:00"–"17:00".

    */


    const dayAvailability = user.availability.days.find(
      (availableDay) => availableDay.day === day.toUpperCase()
    )


    // console.log(dayAvailability)

    // if I found that particular day inside of our database , then I need to add some additonal information for that particular day



    /* Adds a new key to availabilityData for each day with the format:

       {
         isAvailable: true/false,
         startTime: "HH:MM",
         endTime: "HH:MM"
       }

    */

    availabilityData[day] = {


      isAvailable: !!dayAvailability,

      // we need to show the endtime and startTime for like that particular day of the week


      //  For example ----> ISO String :: "2025-05-12T16:00:00.000Z".slice(11, 16)  ---> gives "16:00"


      startTime: dayAvailability
        ? dayAvailability.startTime.toISOString().slice(11, 16)
        : "09:00",

      endTime: dayAvailability
        ? dayAvailability.endTime.toISOString().slice(11, 16)
        : "17:00",
    };
  })

  console.log("AvailabilityData", availabilityData);

  return availabilityData;
}




















// API for updating availability and add the logic for it

export async function updateAvailability(data) {
  // first of all we fetch userId and check if user is loggedIn or not

  const { userId } = await auth();

  // The auth() helper returns the Auth object of the currently active user,

  if (!userId) {
    throw new Error("Unauthorized: No user ID found.");
  }

  // Check user is present in database or not with the help of clerkUserId

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { availability: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // console.log("data after changing updateAvailability",user)

  // now after this data we are getting in function , we need to convert it in a way that we can store it inside of database

  // Returns an array of key/values of the enumerable own properties of an object


  const availabilityData = Object.entries(data).flatMap(

    ([day, { isAvailable, startTime, endTime }]) => {
      if (isAvailable) {

        //  new Date().toISOString().split("T") is the Array containing two values ['2025-05-13', '16:53:38.957Z']

        const baseDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format



        return [
          {
            day: day.toUpperCase(),

            //  we are writing this in ISO format for our database

            startTime: new Date(`${baseDate}T${startTime}:00Z`),
            endTime: new Date(`${baseDate}T${endTime}:00Z`),

            /* 

            this baseDate doesn't matter really much because 
               
               - when we will be rendering it inside of our events page or whenever 
                  
                  - other user will book a time with us , we would just need to consider the startTime and endTime with respect to that particular Date the one that they are choosing 
            
            */
          },
        ];
      }
      return [];
    }
  )
  // console.log(availabilityData) 


  // after this we need to update this data inside of our database


}








/*


A function that accepts up to three arguments. 
  
   - The flatMap method calls the callback function one time for each element in the array.
   
   - Calls a defined callback function on each element of an array. 
   
   - Then, flattens the result into a new array. This is identical to a map followed by flat with depth 1.


   - whatever the result of each and every call back we will get , it will converted into a new Array



const arr1 = [1, 2, 1];
const result = arr1.flatMap((num) => (num === 2 ? [2, 2] : 1));
console.log(result);

Expected output: Array [1, 2, 2, 1]


*/
