sign-in (new folder inside app ) : a new route /sign-in inside our application

app router ( folder based routing )


Optional Catch-all Segments :

Catch-all Segments can be made optional by including the parameter in double square brackets: [[...folderName]].


for ex : app/shop/[...slug]/page.js

prisma is an orm Object-Relational Mapping

It's a programming technique that simplifies data interaction between object-oriented programming languages and relational databases. 



• folder	Route segment
• folder/folder	Nested route segment

Dynamic routes

• [folder]	Dynamic route segment
• [...folder]	Catch-all route segment
• [[...folder]]	Optional catch-all route segment

Route Groups and private folders

• (folder)	Group routes without affecting routing
• _folder	Opt folder and all child segments out of routing


in previous , old way of writing next js , we are using api folder allowed us to have an api route which can we use to fetch data inside our application...


server actions / server side code : When you use server actions or write server-side code, the API calls made on the server are not exposed to the client.

if we are fetching something that will happen inside of the server


