/** Days of the week in display order. Keys match the availability form fields. */
export const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const DEFAULT_DAY_START = "09:00";
export const DEFAULT_DAY_END = "17:00";

/** Number of days ahead that public booking pages expose slots for. */
export const BOOKING_WINDOW_DAYS = 30;

export const MS_PER_MINUTE = 60_000;


export const COPY_FEEDBACK_MS = 2000;

/** Selectable availability times in 30-minute steps: "00:00" ... "23:30". */
export const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const hours = String(Math.floor(i / 2)).padStart(2, "0");
  const minutes = i % 2 === 0 ? "00" : "30";
  return `${hours}:${minutes}`;
});

const DEFAULT_DAY = { isAvailable: false, startTime: DEFAULT_DAY_START, endTime: DEFAULT_DAY_END };

/** Availability shown to users who haven't saved any yet. */
export const DEFAULT_AVAILABILITY = {
  ...Object.fromEntries(DAYS_OF_WEEK.map((day) => [day, { ...DEFAULT_DAY }])),
  timeGap: 0,
  // Empty until the form fills in the host's browser zone (see AvailabilityForm).
  timeZone: "",
};

/** Post-auth landing route: mirrors the Clerk user into the database, then continues to the dashboard. */
export const POST_AUTH_URL = "/sync-user";

/** Top navigation links shown in the site header. */
export const NAV_LINKS = [
  { title: "Home", href: "/" },
  { title: "Dashboard", href: "/dashboard" },
];

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;
