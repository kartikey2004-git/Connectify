# full stack call booking App

- Clerk :: google authentication
- creating an event which can be public or private
- set availability for the event
- own custom user page where user's can book meeting with us
- Google Calendar API to generate a google meet link and insert this event into our and other users calendars
- responsive UI
- user dropdown containing events , manage account

- Dashboard :: latest updates and all incoming calls i have to attend

  - unique link for custom user page ( where people can book call with us )

  - create event ( public or private )

  - React hooks form with zod validation library

  - neonDB ( postgreSQl database )

  - availabilty page :: according to days and time as well and minimum gap u need before booking call with you

  - meeting :
    - all past calls we attend
    - all upcoming meetings ( we can cancel meetings )

- ShadCN is a UI component library that aims to streamline the development process by offering pre-built, accessible, and customizable components.

components.json :: configuraion of shadCN UI

---

- Link tag in nextJS allows us to route from one page to another and routing works in diff way in nextJS

- Image tag in nextJS

## User authentication in clerk

- The most comprehensive User Management Platform

- You can protect routes based on a user's authentication status by checking if the user is signed in.

  - Use auth().userId if you want more control over what your app does based on user authentication status.

  - [Docs for clerk middleware config for protected routes](https://clerk.com/docs/references/nextjs/clerk-middleware)

- we need to define in .env file in nextJS about the signIn URL and signUp URL

### General Info about Next JS

- If we create a folder inside the app folder , this will basically create a brand new route inside of our application

  - folder - new route
  - it is how routing works in nextJS
  - this is what the app router is

  - sign-in (new folder inside app ) : a new route /sign-in inside our application

  - app router ( folder based routing )

- catch all route [[...sign-in]] acts as optional route if I want to keep anything after this route ( basically if clerk wants to add something after this route , it will catch all of things )

- for ex : app/shop/[...slug]/page.js

- Optional Catch-all Segments :

- Catch-all Segments can be made optional by including the parameter in double square brackets: [[...folderName]].

- if we don't want to create a route/path on folder creation , wrap them like (auth)

- Now we have to define logic for login to redirect us to sign-in Page

- [Docs for customize the UserMenu](https://clerk.com/docs/customization/user-button)

- There's concept of server and client component in nextJS
  - client component will only rendered/run on client side ( frontend ) : "use client"

---

## Database Setup

Neon is postgressSQL based Database

Ship faster with Postgres

- The database developers trust, on a serverless platform designed to help you build reliable and scalable applications faster.

- create role and database here
- getting Connection String or URL

- Prisma ek ORM (Object Relational Mapper) hai.

  - helps us to connect database with our application and helps us to query more efficiently

  - simplifies data interaction between object-oriented programming languages and relational databases.

  - for ex SQL

    - it's like trouble to create a table
    - insert something inside datbases

  - Iska kaam hai ki tum apne database ke saath easily kaam kar sako — bina direct SQL likhe.

    - Type safety milti hai (galat field likhne par compile time pe hi error aa jaata hai).

    - Multiple databases ke saath kaam kar sakta hai (Postgres, MySQL, SQLite, etc.)

    - Code readable aur maintainable ban jaata hai.

- [Link which generate a random image](https://i.pravatar.cc/150?img=11)

- Design Database

- Prisma :

  - This will automatically create tables inside of our postgresSQL database

  - also it works for no SQL databases as well

  - Connection of neonDB with prisma

    - npm install prisma as a dev dependency

    - Install Prisma Client (as a runtime dependency)

    - Initialize Prisma (creates prisma/schema.prisma)

    - This will create:

      - prisma/schema.prisma
      - .env file with a placeholder for your DATABASE_URL

- Now we start creating tables inside the prisma , generate those tables inside of neonDB as well

---

Database structure

1. Users table

   - we are storing user data inside the clerk but we want to keep the copy of data as well in our database as well as quick access of user's data for the operation..

     - clerkUserID : so we can fetch data from clerk into DB whenever required ,

     - email from the clerk ,
     - unique username entered , this will be used when we try to access the custom page

     - fullname
     - profile pic of user

- events created by user (foreign key to those tables) and bookings related to that user (foreign key to those tables) and user availability Array as well..

2. Events Table

- for single event in events tables

  - title
  - description
  - duration ( how long the call will be )

  - userId ( who is owner of event from users table ) : storing id of user in events table

  - isPrivate :for public or private event
  - bookings : no of bookings created on that particular event

3. Booking table is common for both that how many bookings for particular user and how many bookings for particular event

- one single booking is going to have an

  - eventId ( as foreign key ) ,
  - userId referred to foreign key for user table ,
  - name of user , email of user , additionInfo about user jo booking kr rha hai

  - startTime and endTime of the call
  - meeting link , we will be generating using Google API

  - googleEventId : for cancelling the event further if needed

- Users table mein we have availability array

4. availability

   - userId we are going to store which user does this belong to

   - timeGap : if we want to book call with someone , that person has assigned the time Gap that no one can a book a call with me , let's say 2 hour from now

   - days

5. day_availability

   - for a one single day ,
     - I have the startTime and endTime ,
       for example for a particular day , I am available from 10:00 am to 2:00 pm

     - obviously the day Monday tuesday

- [Database Model Link ](https://tiny-ur-lz.vercel.app/connectify)

---

- @id :

  Defines a single-field ID on the model.
  Marks this field as the Primary Key. in the database.

- @default(uuid()):

  Auto-generates a UUID (Universally Unique ID) every time a new record is created.

- @unique means:

  This field must have a unique value for every record in the table.

  No two records can have the same value in a field marked @unique.

- @updatedAt:

  Automatically stores the time when a record was last updated.

- @relation :
  Defines a connection between two models

1.

```bash
events Event[] @relation("UserEvents")
```

       - events ➔ is a relation field in your User model.

       - Event[] ➔ means: A user can have multiple events. (one-to-many)

       - @relation("UserEvents") ➔ Prisma uses this name internally to connect this relation.


       - One user ➔ can create many events.
       - Each event ➔ belongs to one user.

2.

```bash
bookings Booking[] @relation("UserBookings")
```

      - bookings ➔ is another relation field in the same User model.

      - Booking[] ➔ means: A user can have multiple bookings.

      - @relation("UserBookings") ➔ names this relationship for Prisma.



      - One user ➔ can have multiple bookings.
      - Each booking ➔ is linked to a user.

3.

```bash
availability Availability?
```

      - availability ➔ is a relation field too.

      - Availability? ➔ the ? means this is optional (nullable).

      - So, a user may or may not have an availability set.


      - One user ➔ can have one availability setting.
      - One availability ➔ belongs to one user.

4.

```bash
user User @relation("UserEvents", fields: [userId], references: [id])
```

     - user	: This is the field name in Prisma. You'll access this with event.user.

     - User	( This tells Prisma ): "This field refers to the User model."


     - @relation("UserEvents", ...)	This connects it to the User model’s events field we saw earlier. Both use the name "UserEvents" to link.


     - fields: [userId] acts as "foriegn key"	This tells Prisma: "Use the userId field in this events table to establish the relation."


     - references: [id]	This points to the id field in the User model.

     - So events.userId ➔ users.id.

     ( Many-to-One relation ➔ Many events belong to one user. )

5. bookings Booking[]

   - bookings ➔ Prisma field name.

   - Booking[] ➔ This is a one-to-many relation.
   - One event can have many bookings.

   - The reverse would be in the Booking model (pointing back to an event).

---

Flow Example ::

User 1 ➔ Many (User ➔ Events)

Field in Prisma Code :: events Event[] @relation("UserEvents")

Event Many ➔ 1 (Event ➔ User)

Field in Prisma Code :: user User @relation("UserEvents", fields: [userId], references: [id])

---

6.

```bash
eventId        String
event          Event   @relation(fields: [eventId], references: [id], onDelete: Cascade)
```

-     - eventId  :	This is the foreign key column in Booking. It stores the id of the related event.

      - event	Prisma relation field (you can do booking.event in Prisma queries).

      - @relation(...)	This sets up the relation details.

- Inside @relation:

  - fields: [eventId] ➔ This says: "eventId column connects this booking to an event."

  - references: [id] ➔ This says: "It references the id field in the Event model."

  - onDelete: Cascade ➔ If the event gets deleted, this booking will also be auto-deleted. (Cascade delete rule!)

- Many bookings ➔ belong to one event.

- And bookings are deleted if the event is deleted (Cascade).

7.

```bash
userId         String
user           User    @relation("UserBookings", fields: [userId], references: [id])
```

-     - userId	: This is the foreign key column storing which user made the booking.

      - user :	Prisma relation field (you can do booking.user).

      - @relation("UserBookings", fields: [userId], references: [id])	 :: Connects it back to the User model.

- Inside @relation:

  - "UserBookings" ➔ This matches the relation name in your User model (bookings Booking[] @relation("UserBookings")).

  - fields: [userId] ➔ This says: "userId is the foreign key."

  - references: [id] ➔ Points to id field in User.

- Many bookings ➔ belong to one user.

- Each booking is made by one user.

---

Here is the relation ::

- One User ➔ can have many Bookings.

- One Event ➔ can have many Bookings.

- But each Booking ➔ belongs to exactly one User and one Event.

npx prisma migrate dev : this will push changes to our neon database and also store changes locally in prisma migration folder

ask for name of new migration every time I perform changes in any model

- database is now in sync with schema

- neonDb hosted for 24/7 , so it's amazing for production grade apps

- prisma configurations done

---

- Whenever we loggedIn we want to get the user data from Clerk and add it inside of our database user table

  - checkUser.js

  Now create all of the routes inside the nextJS app. How routing works in nextJS ?

- folder inside app : Route segment
- folder/folder : Nested route segment ( a new route inside of pre-existing route )

- Dynamic routes

  - [folder] Dynamic route segment
    for custom user page , we have to define dynamic route , because username is variable

  - [...folder] Catch-all route segment
  - [[...folder]] Optional catch-all route segment

- Route Groups and private folders

  - (folder) :: Group routes without affecting routing ( child segment still be a route )

  - \_folder Opt folder and all child segments out of routing ( we won't be able to include any routes inside it )

- main contain all of our private routes

- username : dynamic route and event_id is nested dynamic route

---

- user which we get from CurrentUser() in checkUser.js

- [Docs for getting currentUser in clerk](https://clerk.com/docs/references/nextjs/current-user)

- if user is already present hai database mein toh
  humne loggedIn user return krwa diya hai

```bash

User already exists in Neon DB:
{
  id: '79927fec-1954-4c75-ba8c-ab31263e12ab',
  clerkUserId: 'user_2wrtNZya8yXFJi5sH3rvKvPAGYd',
  email: 'kartikeybhatnagar247@gmail.com',
  username: 'Kartikey-BhatnagarAGYd',
  name: 'Kartikey Bhatnagar',
  imageUrl: 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJ3cnVJTTRDV0FVMmJmeklhT2o2QVFkOTVJdyJ9',
  createdAt: 2025-05-09T18:53:15.385Z,
  updatedAt: 2025-05-09T18:53:15.385Z
}
```

---

To handle forms in my project , we gonna uses react-hook-form along with zod validation library

in previous , old way of writing next js , we are using api folder allowed us to have an api route which can we use to fetch data inside our application...

- server actions / server side code : When you use server actions or write server-side code, the API calls made on the server are not exposed to the client.

if we are fetching something that will happen inside of the server

- update user in database and clerk from dashboard

clerkDocs mein sab mein

- const client = await clerkclient()

  - pehle unhone function call kr liya and then phir wo docs mein clerkClient ki properties ka access kr rhe hai

- kyuki jo method hai clerk client wo pehle hi call ho chuka , isliye uss ki properties ka access kr pa rhe hai

- If we want to create an event , it will route us to /events page with flag create=true , it will popup the drawer from bottom and allow us to create the event

- I want this drawer accessible in whole our app

---

events.js

console.log(" Raw Event Data Received:", data) :

```bash
 Raw Event Data Received: {
  title: 'hola',
  description: 'Frontend interview course prep',
  duration: 30,
  isPrivate: true
}
```

console.log("Validated Event Data:", validatedData);

console.log("User ID:", userId);

```bash

Validated Event Data: {
  success: true,
  data: {
    title: 'hola',
    description: 'Frontend interview course prep',
    duration: 30,
    isPrivate: true
  }
}

User ID: user_2wxZBvKEZQeNFvThwTScwGxcOSn

```

- after creating an event , we got in return Arrays of objects containing data about particular event

```bash
[
  {
    id: 'd4634462-f692-4d3f-879b-fd99e26402e8',
    title: 'moj masti meet',
    description: 'moj masti krenge aa jao',
    duration: 30,
    userId: 'b90d5137-2238-43f6-82b6-a6e6c80dd1bf',
    isPrivate: true,
    createdAt: 2025-05-11T19:35:12.769Z,
    updatedAt: 2025-05-11T19:35:12.769Z,
    _count: { bookings: 0 }
  },
  {
    id: '92ff4ca7-9316-4bbe-b406-c006e5bacf46',
    title: 'Frontend preparation',
    description: 'Frontend interview course prep',
    duration: 30,
    userId: 'b90d5137-2238-43f6-82b6-a6e6c80dd1bf',
    isPrivate: true,
    createdAt: 2025-05-11T18:32:53.685Z,
    updatedAt: 2025-05-11T18:32:53.685Z,
    _count: { bookings: 0 }
  }
]
```

---

- earlier I created two seperate function two components for fetching the data and now we know how can we show the layout for the same thing in Availability Page

- At the availability.js at the server actions

  - console.log("User after returning from database with field include availability with days inside it",user)

- In fetching user availabilities , check if user is loggedIn or not and Check user is present in database or not with the help of clerkUserId

  - we fetch the user data on basis of check with clerk userID containing availability field

  - availability ek object :

    - jisme availabilityId
    - userId jiski availability hai
    - timeGap

    - days naam ka Array of objects containing info about that particular day availability

      - uniqueId
      - availability Id reference ke liye ki current day availability kis user ki hai

      - konsa day ki availability like MONDAY , TUESDAY etc

      - startTime and endTime

Notes ::

- availability.days returns an array of DayAvailability objects.

```bash

{
  id: "uuid-user-id",
  clerkUserId: "clerk_user_123",
  email: "user@example.com",
  username: "kartikey",
  name: "Kartikey Bhatnagar",
  imageUrl: "https://example.com/image.jpg",
  createdAt: "2025-05-14T12:34:56.789Z",
  updatedAt: "2025-05-14T12:34:56.789Z",

  availability: {
    id: "uuid-availability-id",
    userId: "uuid-user-id",
    timeGap: 30,
    createdAt: "2025-05-13T10:00:00.000Z",
    updatedAt: "2025-05-13T10:00:00.000Z",

    days: [
      {
        id: "uuid-day-1",
        availabilityId: "uuid-availability-id",
        day: "MONDAY", // Enum value from DayOfWeek
        startTime: "2025-05-19T09:00:00.000Z",
        endTime: "2025-05-19T11:00:00.000Z",
      },
      {
        id: "uuid-day-2",
        availabilityId: "uuid-availability-id",
        day: "WEDNESDAY",
        startTime: "2025-05-21T14:00:00.000Z",
        endTime: "2025-05-21T16:00:00.000Z",
      },
      // more DayAvailability objects...
    ],
  },
}

```

- console.log(dayAvailability) depends on two things:

  - The current value of day (e.g., "monday", "tuesday").

  - Whether user.availability.days has a matching availableDay.day === day.toUpperCase().

- console.log(dayAvailability) will:

  - Show the matching DayAvailability object if found.

```bash
{
  id: '1',
  day: 'MONDAY',
  startTime: 2025-05-19T09:00:00.000Z,
  endTime: 2025-05-19T11:00:00.000Z,
  availabilityId: 'avail-123'
},
{
  id: '2',
  day: 'TUESDAY',
  startTime: 2025-05-19T08:00:00.000Z,
  endTime: 2025-05-19T13:00:00.000Z,
  availabilityId: 'avail-123'
}

```

- console.log("AvailabilityData", availabilityData);

```bash

{
  timeGap: 30,
  monday: {
    isAvailable: true,
    startTime: "10:00",
    endTime: "14:00"
  },
  tuesday: {
    isAvailable: false,
    startTime: "09:00",
    endTime: "17:00"
  },
  wednesday: {
    isAvailable: true,
    startTime: "12:00",
    endTime: "15:00"
  },
  thursday: { ... },
  ...
}

```

- temporarily on NO availability from user , thus we show the default availability data

  - but we will get proper data id there's any data inside of our database

- Now we creating a form for our Availability and create schema for our form for Availability by using zod validation library

---

- Lets goo to create an API for updating availability and add the logic for it

console.log() at the line of 162

```bash

data after changing updateAvailability ::
 {
  id: 'b90d5137-2238-43f6-82b6-a6e6c80dd1bf',
  clerkUserId: 'user_2wxZBvKEZQeNFvThwTScwGxcOSn',
  email: 'kartikeybhatnagar247@gmail.com',
  username: 'kartikey2004',
  name: 'Kartikey Bhatnagar',
  imageUrl: 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yd3haQnJZVWxZOTVtSjVPUGp6c3ZEdGx2OWcifQ',
  createdAt: 2025-05-11T17:46:11.612Z,
  updatedAt: 2025-05-11T17:51:46.010Z,
  availability: null
}

```

// console.log(data,availabilityData) at the line 171

```bash
{
  monday: { isAvailable: true, startTime: '05:30', endTime: '12:30' },
  tuesday: { isAvailable: false, startTime: '09:00', endTime: '17:00' },
  wednesday: { isAvailable: false, startTime: '09:00', endTime: '17:00' },
  thursday: { isAvailable: false, startTime: '09:00', endTime: '17:00' },
  friday: { isAvailable: false, startTime: '09:00', endTime: '17:00' },
  saturday: { isAvailable: false, startTime: '09:00', endTime: '17:00' },
  sunday: { isAvailable: false, startTime: '09:00', endTime: '17:00' },
  timeGap: 0
}


# Object.entries() that will convert all of these into an array and each and every entry for a single day is also converted into Array

# we are safe to iterate over the this Array


[
  [
    'monday',
    { isAvailable: true, startTime: '05:30', endTime: '12:30' }
  ],
  [
    'tuesday',
    { isAvailable: false, startTime: '09:00', endTime: '17:00' }
  ],
  [
    'wednesday',
    { isAvailable: false, startTime: '09:00', endTime: '17:00' }
  ],
  [
    'thursday',
    { isAvailable: false, startTime: '09:00', endTime: '17:00' }
  ],
  [
    'friday',
    { isAvailable: false, startTime: '09:00', endTime: '17:00' }
  ],
  [
    'saturday',
    { isAvailable: false, startTime: '09:00', endTime: '17:00' }
  ],
  [
    'sunday',
    { isAvailable: false, startTime: '09:00', endTime: '17:00' }
  ],
  [ 'timeGap', 0 ]
]
```

console.log(availabilityData)

```bash
[
  {
    day: 'MONDAY',
    startTime: 2025-05-15T04:00:00.000Z,
    endTime: 2025-05-15T11:30:00.000Z
  },
  {
    day: 'TUESDAY',
    startTime: 2025-05-15T04:30:00.000Z,
    endTime: 2025-05-15T17:00:00.000Z
  },
  {
    day: 'WEDNESDAY',
    startTime: 2025-05-15T05:00:00.000Z,
    endTime: 2025-05-15T14:00:00.000Z
  }
]
```

---

Time to Go to build our custom user page in which we display name , profile pic and all of public events that we have showcased

console.log(user) at the username custom page.jsx by fetching data from get user by username action

```bash
{
  id: 'b90d5137-2238-43f6-82b6-a6e6c80dd1bf',
  name: 'Kartikey Bhatnagar',
  email: 'kartikeybhatnagar247@gmail.com',
  imageUrl: 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yd3haQnJZVWxZOTVtSjVPUGp6c3ZEdGx2OWcifQ',

  events: [
    {
      id: '5464b03e-60bd-4c45-8870-4183e5f882f6',
      title: 'Javascript Interview Practice',
      description: 'Javascript  interview questions practice across platforms on namaste dev.com',
      duration: 30,
      isPrivate: false,
      _count: [Object]
    },
    {
      id: 'fac05e78-2fa0-47ca-88f6-1ab490506c08',
      title: 'Elixir Meeting',
      description: 'meeting about the tasks given to change in elixir website',
      duration: 60,
      isPrivate: false,
      _count: [Object]
    }
  ]
}
```

---------------------------------------------------

Less goo and design single events page with url like http://localhost:3000/kartik2004/5464b03e-60bd-4c45-8870-4183e5f882f6

but before that we need to ensure that we have the meta data for this page because this is going to be a public page , we want this page rank on google

less go an build event Booking page , first we'll right the logic for fetching that particular event

console.log(event) where we get details from getEventDetails from event.js to fetch the details about particular event

```bash
 {

  id: '5464b03e-60bd-4c45-8870-4183e5f882f6',
  title: 'Javascript Interview Practice',
  description: 'Javascript  interview questions practice across platforms on namaste dev.com',
  duration: 30,
  userId: 'b90d5137-2238-43f6-82b6-a6e6c80dd1bf',
  isPrivate: false,
  createdAt: 2025-05-13T14:04:53.941Z,
  updatedAt: 2025-05-13T14:04:53.941Z,
  user: {
    name: 'Kartikey Bhatnagar',
    email: 'kartikeybhatnagar247@gmail.com',
    imageUrl: 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJ4OGxDWTJuTHZGQTNxTVZZaXhqUlZZY2Q0ayJ9',
    username: 'kartikey2004'
  }
}

```

- Now we need to build our book event page which has two sections : event Details section and booking section ( most complex part of this app )

  - booking event in calendar and other section

console.log(user) for particular event and console.log(event)  details about that particular event


```bash 
haha {
  name: 'Kartikey Bhatnagar',
  email: 'kartikeybhatnagar247@gmail.com',
  imageUrl: 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJ4OGxDWTJuTHZGQTNxTVZZaXhqUlZZY2Q0ayJ9'
}
```

```bash
hannnnnnnnn {
  id: '5464b03e-60bd-4c45-8870-4183e5f882f6',
  title: 'Javascript Interview Practice',
  description: 'Javascript  interview questions practice across platforms on namaste dev.com',
  duration: 30,
  userId: 'b90d5137-2238-43f6-82b6-a6e6c80dd1bf',
  isPrivate: false,
  createdAt: 2025-05-13T14:04:53.941Z,
  updatedAt: 2025-05-13T14:04:53.941Z,
  user: {
    name: 'Kartikey Bhatnagar',
    email: 'kartikeybhatnagar247@gmail.com',
    imageUrl: 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJ4OGxDWTJuTHZGQTNxTVZZaXhqUlZZY2Q0ayJ9',
    username: 'kartikey2004'
  }
}
```

-------------------------------------------------

less goo and build our custom booking form 

logic for booking form is very very important , it is most important thing inside of our app


   - Before going to create this booking 
    
      - I want to get the user availability details with respect to this event
      ( event availability of user )


  - If we going to fetch the availability 
    
     - we need to check is there any slot which is already booked , so we need to consider all of this these things as well

---------------------------------------------------


 - Explanation : getEventAvailability(eventId) function

 -  kisi ek event ke liye 30 din tak ki available booking slots batata hai.



Real Life Example:
  
   - Man lo John ek mentor hai jo logon ko 1-on-1 call deta hai (event).

   - Uski weekly availability Monday aur Wednesday ko 9am–5pm hai.

   - Uska event 30-minute ka hota hai.

   - Agar kisi user ko next 30 days me John ke saath call book karni ho, toh ye function batata hai:


Output aisa milega final 

```bash
[
  { date: "2025-05-20", slots: ["09:00", "09:30", "10:00", ...] },
  { date: "2025-05-22", slots: ["13:00", "13:30", "14:00", ...] }
]
```


Code wise explanation :: 

- Step 1: Event aur User Data Fetch karna

```bash

const event = await db.event.findUnique({
  where: { id: eventId }, 
  include: {
    user: {
      include: {
        availability: {
          select: { days: true, timeGap: true }
        },
        bookings: {
          select: { startTime: true, endTime: true }
        }
      }
    }
  }
});

```


- Kya ho raha hai:

    - eventId ke through event ki details laa rahe hain.

    - Us event ke owner (user) ki:
       
        - availability: kaunse din available hai, kitne baje se kitne baje tak.

        - bookings: kaunse time pe pehle se kisi ne booking ki hui hai.


Result like 

```bash

event = {
  id: "event123",
  duration: 30, // ki event/meet kitne der ki hogi
  user: {
    availability: {
      timeGap: 15, // event/meet book krne ke beech mein kitna timeGap rkha hai
      days: [
        { day: "MONDAY", startTime: 09:00, endTime: 17:00 },
        { day: "WEDNESDAY", startTime: 13:00, endTime: 18:00 }
      ]
    },
    bookings: [
      { startTime: "2025-05-22T13:00", endTime: "2025-05-22T13:30" } // ek user ka startTime and endTime jisne booking kr rkhi hai
    ]
  }
}
```

- Step 2: Data check

```bash
if (!event || !event.user.availability) return [];
```

- Agar event ya user ki availability hi nahi hai toh return empty array.


- Step 3: Aaj se leke 30 din baad tak ka range set karna


```bash
const startDate = startOfDay(new Date()); // Aaj ka din - 00:00 time
const endDate = addDays(startDate, 30);   // 30 din baad tak
```



- Step 4: Har din ke liye check karo

```bash
for (let date = startDate; date <= endDate; date = addDays(date, 1)) {}
```

- Loop chala rahe hain har ek din ke liye.

- Har din check karenge ki:

    - Kya user uss din available hai?
    - Agar haan, toh booking slots generate karo.



Step 5: Day-wise availability check

```bash
const dayOfWeek = format(date, "EEEE").toUpperCase(); // e.g., "MONDAY"

const dayAvailability = availability.days.find(d => d.day === dayOfWeek);
```

- Kya ho raha hai:

    - Current date ka day name (e.g., "TUESDAY") find karo.

    - Check karo ki availability.days me wo day exist karta hai ya nahi.



Step 6: Time Slots generate karna 

```bash
const dateStr = format(date, "yyyy-MM-dd");

const slots = generateAvailableTimeSlots(
  dayAvailability.startTime,
  dayAvailability.endTime,
  event.duration,
  bookings,
  dateStr,
  availability.timeGap
);
```

- Agar user us din available hai, toh available time slots calculate karne ke liye ek helper function call karte hain.



Step 7: Result me store karna

```bash
availableDates.push({
  date: dateStr,
  slots,
});
```

- Har ek date ke liye mil gaye slots ko availableDates array me add kar diya.
