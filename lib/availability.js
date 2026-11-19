import { TZDate } from "@date-fns/tz";
import { addDays, format, startOfDay } from "date-fns";
import {
  BOOKING_WINDOW_DAYS,
  DAYS_OF_WEEK,
  DEFAULT_DAY_END,
  DEFAULT_DAY_START,
  MS_PER_MINUTE,
} from "@/lib/constants";

/**
 * Availability hours ("09:00"-"17:00") are stored as time-of-day values and are
 * wall-clock times in the host's own `timeZone`, not instants.
 */

/** "HH:mm" for a stored time-of-day Date (the stored date part is meaningless). */
const toTimeString = (date) => date.toISOString().slice(11, 16);

/** Converts a user's stored availability into the shape the availability form expects. */
export function toAvailabilityFormData(availability) {
  const formData = { timeGap: availability.timeGap, timeZone: availability.timeZone };

  for (const day of DAYS_OF_WEEK) {
    const stored = availability.days.find((d) => d.day === day.toUpperCase());

    formData[day] = {
      isAvailable: Boolean(stored),
      startTime: stored ? toTimeString(stored.startTime) : DEFAULT_DAY_START,
      endTime: stored ? toTimeString(stored.endTime) : DEFAULT_DAY_END,
    };
  }

  return formData;
}

/** Converts validated availability form data into DayAvailability rows (available days only). */
export function toDayAvailabilityRows(formData) {
  const baseDate = new Date().toISOString().split("T")[0];

  return DAYS_OF_WEEK.filter((day) => formData[day].isAvailable).map((day) => ({
    day: day.toUpperCase(),
    startTime: new Date(`${baseDate}T${formData[day].startTime}:00Z`),
    endTime: new Date(`${baseDate}T${formData[day].endTime}:00Z`),
  }));
}

/** The instant at which the wall clock in `timeZone` reads `storedTime` on the calendar day `day`. */
function atWallClock(day, storedTime, timeZone) {
  const [hours, minutes] = toTimeString(storedTime).split(":").map(Number);
  return new TZDate(day.getFullYear(), day.getMonth(), day.getDate(), hours, minutes, 0, timeZone);
}

function overlapsAnyBooking(start, end, bookings) {
  return bookings.some((booking) => start < booking.endTime && end > booking.startTime);
}

/**
 * Every bookable slot start (as a Date instant) for an event, over the next
 * BOOKING_WINDOW_DAYS days.
 *
 * - Days and hours follow the host's `availability.timeZone`, including DST changes.
 * - Slots tile each day from its start time in steps of `duration`; a slot that would
 *   run past the day's end time is not offered.
 * - Slots earlier than `now + timeGap` and slots overlapping an existing booking are skipped.
 *
 * The grid is anchored to each day's start, so a given slot is always the same instant no
 * matter when this runs. That is what lets the server re-derive and verify a slot the
 * client picked earlier.
 *
 * @param {{ timeZone: string, timeGap: number, days: Array<{day: string, startTime: Date, endTime: Date}> }} availability
 * @param {Array<{startTime: Date, endTime: Date}>} bookings the host's bookings (across all their events)
 */
export function getBookableSlots({ availability, bookings, duration, now = new Date() }) {
  const { timeZone, timeGap, days } = availability;
  const stepMs = duration * MS_PER_MINUTE;
  const earliestMs = now.getTime() + timeGap * MS_PER_MINUTE;
  const firstDay = startOfDay(new TZDate(now, timeZone));
  const slots = [];

  for (let offset = 0; offset <= BOOKING_WINDOW_DAYS; offset++) {
    const day = addDays(firstDay, offset);
    const rule = days.find((d) => d.day === format(day, "EEEE").toUpperCase());

    if (!rule) continue;

    const dayStartMs = atWallClock(day, rule.startTime, timeZone).getTime();
    const dayEndMs = atWallClock(day, rule.endTime, timeZone).getTime();

    // Skip whole steps (not minutes) so slots stay on the day's grid.
    const skippedSteps = dayStartMs < earliestMs ? Math.ceil((earliestMs - dayStartMs) / stepMs) : 0;

    for (let start = dayStartMs + skippedSteps * stepMs; start + stepMs <= dayEndMs; start += stepMs) {
      const slotStart = new Date(start);
      const slotEnd = new Date(start + stepMs);

      if (!overlapsAnyBooking(slotStart, slotEnd, bookings)) {
        slots.push(slotStart);
      }
    }
  }

  return slots;
}
