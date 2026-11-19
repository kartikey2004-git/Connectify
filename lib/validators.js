import { z } from "zod";
import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from "@/lib/constants";
import { isValidTimeZone } from "@/lib/time";

export const usernameSchema = z.object({
  username: z
    .string()
    .min(USERNAME_MIN_LENGTH, `Username must be at least ${USERNAME_MIN_LENGTH} characters`)
    .max(USERNAME_MAX_LENGTH, `Username must be ${USERNAME_MAX_LENGTH} characters or less`)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, hyphens and underscores",
    ),
});

export const eventSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be 500 characters or less"),
  duration: z.number().int().positive("Duration must be a positive integer"),
  isPrivate: z.boolean(),
});

/** One weekday's availability; the end time must come after the start time when available. */
export const daySchema = z
  .object({
    isAvailable: z.boolean(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  })
  .refine((day) => !day.isAvailable || day.startTime < day.endTime, {
    message: "End Time must be more than start time",
    path: ["endTime"],
  });

export const availabilitySchema = z.object({
  monday: daySchema,
  tuesday: daySchema,
  wednesday: daySchema,
  thursday: daySchema,
  friday: daySchema,
  saturday: daySchema,
  sunday: daySchema,
  timeGap: z.number().min(0, "Time gap must be 0 or more minutes").int(),
  timeZone: z.string().refine(isValidTimeZone, "Select a valid time zone"),
});

/** Client-side booking form fields. */
export const bookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  additionalInfo: z.string().optional(),
});

/**
 * Payload sent to the createBooking server action: the form fields plus the event and the
 * chosen slot. The end time is not sent: the server derives it from the event duration.
 */
export const createBookingSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  startTime: z.string().datetime("Invalid start time"),
  additionalInfo: z.string().optional(),
});
