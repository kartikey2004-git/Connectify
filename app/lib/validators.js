import { z } from "zod";

// structure of username , all validations on username with help of zod validation library

export const usernameSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters , numbers and underscores"
    ),
});

// structure of event form , all validations on event form with help of zod validation library

export const eventSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),

  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Title must be 500 characters or less"),

  duration: z.number().int().positive("Duration must be a positive integer"),

  isPrivate: z.boolean(),
});



// Validations on Availability form with help of zod validation library



/* 

In availabilitySchema , we'll have availabilites all of the days of the week and we'll have the time gap


For each and every day we have a day schema as well 
   
   - but for both endTime and startTime , we need to ensure endTime should always after startTime

*/

export const daySchema = z
  .object({
    isAvailable: z.boolean(), // Is user is available or not

    startTime: z.string().optional(),
    endTime: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.isAvailable) {
        return data.startTime < data.endTime;
      }
      return true;
    },
    {
      message: "End Time must be more than start time",
      path : ["endTime"] // and we can give the exact field that has error 
    }
  )

  
// refine() is a method used to add custom validation logic to a schema after the base validation has passed.


export const availabilitySchema = z.object({
  monday : daySchema,
  tuesday : daySchema,
  wednesday : daySchema,
  thursday : daySchema,
  friday : daySchema,
  saturday : daySchema,
  sunday : daySchema,

  timeGap : z.number().min(0, "Time gap must be 0 or more minutes").int()
});


export const bookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  additionalInfo: z.string().optional(),
});