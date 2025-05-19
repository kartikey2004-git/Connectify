"use server";

import { eventSchema } from "@/app/lib/validators";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  addDays,
  addMinutes,
  endOfDay,
  format,
  isBefore,
  parseISO,
  startOfDay,
} from "date-fns";

// Api to create a event in our database

export async function createEvent(data) {
  try {
    const { userId } = await auth();

    /* 
    
    The auth() helper returns the Auth object of the currently active user, 

    Only works on the server-side, such as in Server Components, Route Handlers, and Server Actions.

    */

    if (!userId) {
      throw new Error("Unauthorized: No user ID found.");
    }

    // console.log(" mcccccccc Raw Event Data Received:", data);

    // Validate the input data against Zod schema

    const validatedData = eventSchema.safeParse(data);

    //  console.log("Validated Event Data:", validatedData);

    // console.log("User ID:", userId);

    // Check user is present in database or not with the help of clerkUserId

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found in database.");
    }

    // Create event inside our database

    const event = await db.event.create({
      data: {
        ...validatedData.data,
        userId: user?.id, // this is the user ID that is unique to our database that is stored inside neon DB
      },
    });

    return event;
  } catch (error) {
    console.error(" Error in createEvent:", error);
  }
}

// Api to fetch all events from our database

export async function getUserEvents() {
  try {
    const { userId } = await auth();

    // The auth() helper returns the Auth object of the currently active user,

    if (!userId) {
      throw new Error("Unauthorized: No user ID found.");
    }

    // Check user is present in database or not with the help of clerkUserId

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found in database.");
    }

    const events = await db.event.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },

      // You are telling the database or API to sort the results : Sort in descending order (latest/newest records come first).

      // I want to include all of the bookings made for this particular event and gives us the count of the bookings on that event

      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });

    // console.log(events)

    // FindMany :: Arguments to filter and select certain fields only.

    // Find zero or more Users that matches the filter. Note, that providing undefined is treated as the value not being there.

    return { events, username: user.username };

    // return username because we have a copy feature , when copy it gives us the link with username and the eventId , that's why we need username
  } catch (error) {
    console.error(" Error in fetching Events:", error);
  }
}

// Api delete event from our database

export async function DeleteEvent(eventId) {
  try {
    const { userId } = await auth();

    // The auth() helper returns the Auth object of the currently active user,

    if (!userId) {
      throw new Error("Unauthorized: No user ID found.");
    }

    // Check user is present in database or not with the help of clerkUserId

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found in database.");
    }

    // check event is present inside the database with current eventId

    const event = await db.event.findUnique({
      where: {
        id: eventId,
      },
    });

    // check if event does not exist or event does not belong to that particular user :: event ki jo userId hai wo loggedIn user id ke equal nahi hai

    if (!event || event.userId !== user.id) {
      throw new Error("Event not found or unauthorized");
    }

    // delete event from database on basis of  userId

    await db.event.delete({
      where: {
        id: eventId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error(" Error in fetching Events:", error);
  }
}

// Api to fetch detail of particular event from our database

export async function getEventDetails(username, eventId) {
  // username,eventId dono params se mil jayengi , we are not doing any verication over here if user is loggedIn or not because this is a public data

  // Find the first User that matches the filter. Note, that providing undefined is treated as the value not being there.

  const event = await db.event.findFirst({
    where: {
      id: eventId,
      user: {
        username: username,
      },
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          imageUrl: true,
          username: true,
        },
      },
    },
  });

  // console.log(event)

  return event;
}

//  Api to fetch availability of user for particular event from our database

export async function getEventAvailability(eventId) {

  /*

  Humein is event ke details chahiye, lekin sabse pehle humein us user ki availability details fetch karni hain jisne ye event create kiya hai.


  Toh events table se humein user table ka data include karna padega

       - aur user table ke andar se humein availability fetch karni hai.

       - Isliye ab hum availability table ki taraf jaa rahe hain (yaani ab availability table ke andar jaa rahe hain). 

       - availability table se milega timeGap and days naam ka array jisme objects honge with
          
          - available day ( ki user jisne wo event create kiya wo kis din available hai )

          - startTime and endTime of that particular day 


      - bookings ke array mein startTime and endTime ISO format mein milega kyuki jab availability update kr rhe the toh waise hi database mein update ki gyi thi

      For more detailed : https://excalidraw.com/#json=Dk45iD-Vq3O7cB4Zrqy4A,EiDYiArMcAIDyB4zGEWaaA
  
  */

  const event = await db.event.findUnique({
    where: {
      id: eventId,
    },

    // Is event ke details chahiye, lekin humein us user ki availability fetch karni hai jisne ye event create kiya hai.

    include: {
      user: {
        include: {
          availability: {
            select: {
              days: true,
              timeGap: true,
            },
          },

          /* 

          Humein is particular event ke liye us user ki bookings bhi chahiye.

          Lekin agar hum sirf user ke bookings fetch karein, toh humein uski saari bookings milengi.

          Par humein sirf usi event ke respect mein user ki bookings chahiye.

          */

          bookings: {
            select: {
              startTime: true,
              endTime: true,
            },

            // Bookings ka startTime aur endTime bhi chahiye humein,  aur isse hum use karenge taaki jo time slots already booked hain unhe remove kar sakein.
          },
        },
      },
    },
  });

  // console.log(event);

  if (!event || !event.user.availability) {
    return [];
  }


  // Phir us particular user ki availability aur bookings nikaalni hain, jisne ye event banaya hai.


  const { bookings, availability } = event.user;


  /*
  
  Jab hum availability ko store kar rahe hote hain — chahe update kar rahe ho ya create kr rhe ho availability — toh database usse apne time zone mein convert kar leta hai.

  Ab humein availability ka startTime aur endTime ko humare time zone mein convert karna hai. 
  
  */


  /*
  
  Jab baat aati hai user ke time slots display karne ki, toh hum sirf next 30 days ke slots hi display karenge

  startOfDay --> Diye gaye date ka start return karta hai. Result local timezone mein hota hai.

  addDays() function --> Diye gaye number of days kisi date mein add karta hai.

  */



  const startDate = startOfDay(new Date());  // starting of slots

  const endDate = addDays(startDate, 30); // Diye gaye date mein 30 din add krdega .


  // Is array mein hum particular date aur us din ke saare slots store karenge.

  const availableDates = [];

  // Hum apni date ko start se lekar finish tak iterate karenge.

  for (let date = startDate; date <= endDate; addDays(startDate, 1)) {

    /*
    
    Har ek din ke liye hum dekhenge ki us din kaunsa day hai.

    Basically, humne apne project ke liye saari dates select ki hain, lekin maan lo agar hum sirf Mondays select karte,

    to wo sirf Mondays ko hi fetch karega aur Mondays ke slots lega, aur sirf un 30 dinon ke beech ke Mondays ko hi display karega.

    */

    // format : Di hui format mein date ka formatted string return karega.


    const dayOfWeek = format(date, "EEEE").toUpperCase(); // Humne us particular din ka day nikal liya.


    /*
    
    User availability se, jisne event banaya hai, hum check karenge ki kya user us particular din available hai?

    Agar user available hai, to us din ko dayAvailability variable mein assign kar denge. 

    */


    const dayAvailability = availability.days.find((d) => d.day === dayOfWeek);


    if (dayAvailability) {

      // iska matlab hai user us din available hai

      const dateStr = format(date, "yyyy-MM-dd");

      // Ab hum apne slots generate karna start karte hain.

      const slots = generateAvailableTimeSlots(

        dayAvailability.startTime,  // user ki availability ka startTime

        dayAvailability.endTime, // user ki availability ka endTime

        event.duration,

        bookings, //  taaki hum check kar saken ki koi booking slots ke beech interfere to nahi kar rahi

        dateStr, // current date string

        availability.timeGap //  user sirf certain timeGap ke baad hi call book kar sakta hai
      );

      // push: Array mein naye elements add karne ke liye.  Ye naye elements ko array ke end mein add karta hai

      availableDates.push({
        date: dateStr,
        slots,
      });
    }
  }

  // console.log(availableDates);

  return availableDates;
}



function generateAvailableTimeSlots(
  startTime,
  endTime,
  duration,
  bookings,
  dateStr,
  timeGap = 0
) {
  const slots = [];

  // start time aur end time ke liye, jab user ki availability ko database mein ISO string format mein store kar rhe the 

  //  parseISO: Di hui ISO format wali string ko parse karke Date ka instance return karta hai

  //  toISOString(): Date ko ISO format mein string ke roop mein return karta hai


  let currentTime = parseISO(
    `${dateStr}T${startTime.toISOString().slice(11, 16)}`
  );

  const slotEndTime = parseISO(
    `${dateStr}T${endTime.toISOString().slice(11, 16)}`
  );

  /*
  
  ab hum start time se lekar end time tak iterate karenge, aur har ek time slot ke liye check karenge ki 
     
     - ye timeSlot available hai ya nahi (timeGaps, bookings, duration wagairah consider karte hue)

     
  hume ye bhi ensure karna hai ki hum past ke timeSlots ko show na karein

  */

  const now = new Date();

  if (format(now, "yyyy-MM-dd") === dateStr) {
    currentTime = isBefore(currentTime, now)
      ? addMinutes(now, timeGap)
      : currentTime;
  }

  while (currentTime < slotEndTime) {
    const slotEnd = new Date(currentTime.getTime() + duration * 600000);


    /*
    
    maan lo start time 9am hai aur end time 12:00pm hai, aur call 30 minute ki hai, to pehla slot 9:30am pe khatam hoga

    is particular slot ke liye, hume check karna hai ki ye slot available hai ya nahi, matlab kya is slot ke liye koi call already booked hai


    check karo ki saari bookings mein ye slot na ho, ya ye slot kisi booking ke time ke beech na aaye

    */

    const isSlotAvailable = !bookings.some((booking) => {
      const bookingStart = booking.startTime;
      const bookingEnd = booking.endTime;

      // Ab hum teen alag-alag cases ko compare karenge

      return (
        (currentTime >= bookingStart && currentTime < bookingEnd) ||
        (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
        (currentTime <= bookingStart && slotEnd >= bookingEnd)
      );
    });

    if (isSlotAvailable) {
      slots.push(format(currentTime, "HH:mm"));
    }

    currentTime = slotEnd;
  }

  return slots;
}
