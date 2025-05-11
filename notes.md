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
  

---------------------------------------------------
 
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



  - catch all route  [[...sign-in]] acts as optional route if I want to keep anything after this route ( basically if clerk wants to add something after this route , it will catch all of things )

  - for ex : app/shop/[...slug]/page.js

  - Optional Catch-all Segments :

  - Catch-all Segments can be made optional by including the parameter in double square brackets: [[...folderName]].



  - if we don't want to create a route/path on folder creation , wrap them  like (auth)


- Now we have to define logic for login to redirect us to sign-in Page


- [Docs for customize the UserMenu](https://clerk.com/docs/customization/user-button)



- There's concept of server and client component in nextJS 
   
   - client component will only rendered/run on client side ( frontend ) : "use client"


---------------------------------------------------

## Database Setup

Neon is postgressSQL based Database

Ship faster with Postgres

   - The database developers trust, on a serverless platform designed to help you build reliable and scalable applications faster.

   - create role and database here
   - getting Connection String or URL
   

- Prisma ek ORM (Object Relational Mapper) hai.

  - helps us to connect database with our application and helps us to query more efficiently

  -  simplifies data interaction between object-oriented programming languages and relational databases. 

  - for ex SQL 
     
     - it's like trouble to create a table 
     - insert something inside datbases


  -  Iska kaam hai ki tum apne database ke saath easily kaam kar sako — bina direct SQL likhe. 

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

     -  Install Prisma Client (as a runtime dependency)

     - Initialize Prisma (creates prisma/schema.prisma)

     - This will create:

          - prisma/schema.prisma
          - .env file with a placeholder for your DATABASE_URL
  
- Now we start creating tables inside the prisma , generate those tables inside of neonDB as well

---------------------------------------------------

Database structure 

1. Users table 

    - we are storing user data inside the clerk but we want to keep the copy of data as well in our database as well as  quick access of user's data for the operation..
    
       - clerkUserID : so we can fetch data from clerk into DB whenever required , 

       - email from the clerk , 
       - unique username entered , this will be used when we try to access the custom page

       - fullname 
       - profile pic of user 


- events created by user (foreign key to those tables) and bookings related to that user  (foreign key to those tables) and user availability Array as well..

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


---------------------------------------------------


-  @id : 
  
     Defines a single-field ID on the model.
     Marks this field as the Primary Key. in the database.

-  @default(uuid()): 
     
     Auto-generates a UUID    (Universally Unique ID) every time a new record is created.

-  @unique means:

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


---------------------------------------------------

Flow Example ::

User	  1 ➔ Many (User ➔ Events)

Field in Prisma Code :: 	events Event[] @relation("UserEvents")


Event	  Many ➔ 1 (Event ➔ User)	

Field in Prisma Code :: user User @relation("UserEvents", fields: [userId], references: [id])

---------------------------------------------------


6. 

```bash
eventId        String
event          Event   @relation(fields: [eventId], references: [id], onDelete: Cascade)
```

- 
      - eventId  :	This is the foreign key column in Booking. It stores the id of the related event.

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

- 
      
      - userId	: This is the foreign key column storing which user made the booking.

      - user :	Prisma relation field (you can do booking.user).

      - @relation("UserBookings", fields: [userId], references: [id])	 :: Connects it back to the User model.




- Inside @relation:

     - "UserBookings" ➔ This matches the relation name in your User model (bookings Booking[] @relation("UserBookings")).

     - fields: [userId] ➔ This says: "userId is the foreign key."

     - references: [id] ➔ Points to id field in User.



- Many bookings ➔ belong to one user.

- Each booking is made by one user.


---------------------------------------------------

Here is the relation :: 

   - One User ➔ can have many Bookings.

   - One Event ➔ can have many Bookings.

   - But each Booking ➔ belongs to exactly one User and one Event.


npx prisma migrate dev : this will push changes to our neon database and also store changes locally in prisma migration folder

ask for name of new migration every time I perform changes in any model


- database is now in sync with schema 

- neonDb hosted for 24/7 , so it's amazing for production grade apps

- prisma configurations done

---------------------------------------------------

- Whenever we loggedIn we want to get the user data from Clerk and add it inside of our database user table

  - checkUser.js

  Now create all of the routes inside the nextJS app. How routing works in nextJS ?



- folder inside app :	Route segment
- folder/folder :	Nested route segment ( a new route inside of pre-existing route )

- Dynamic routes

    - [folder]	Dynamic route segment 
  for custom user page , we have to define dynamic route , because username is variable 


    - [...folder]	Catch-all route segment
    - [[...folder]]	Optional catch-all route segment


- Route Groups and private folders

     - (folder) :: Group routes without affecting routing ( child segment still be a route )

     - _folder	Opt folder and all child segments out of routing ( we won't be able to include any routes inside it )


- main contain all of our private routes 

- username : dynamic route and event_id is nested dynamic route

---------------------------------------------------

- user which we get from CurrentUser() in checkUser.js

- [Docs for getting currentUser  in clerk](https://clerk.com/docs/references/nextjs/current-user)


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


---------------------------------------------------

To handle forms in my project , we gonna uses react-hook-form along with zod validation library 



in previous , old way of writing next js , we are using api folder allowed us to have an api route which can we use to fetch data inside our application...


- server actions / server side code : When you use server actions or write server-side code, the API calls made on the server are not exposed to the client.

if we are fetching something that will happen inside of the server

   - update user in database and clerk from dashboard


- If we want to create an event , it will route us to /events page with flag create=true , it will popup the drawer from bottom and allow us to create the event

- I want this drawer accessible in whole our app