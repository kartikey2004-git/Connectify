import { TZDate } from "@date-fns/tz";
import { format } from "date-fns";

export const DEFAULT_TIME_ZONE = "UTC";

/** True when `timeZone` is a non-empty IANA zone name the runtime recognises (e.g. "Asia/Kolkata"). */
export function isValidTimeZone(timeZone) {
  if (typeof timeZone !== "string" || timeZone.length === 0) return false;

  try {
    new Intl.DateTimeFormat("en", { timeZone });
    return true;
  } catch {
    return false;
  }
}

/** Formats a date/instant as it reads on the wall clock in `timeZone`. */
export function formatInTimeZone(date, timeZone, pattern) {
  return format(new TZDate(date, timeZone), pattern);
}

/** The runtime's own zone (the viewer's zone when called in the browser). */
export function getLocalTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/** All selectable IANA zones, always including UTC. */
export function getSupportedTimeZones() {
  const zones = Intl.supportedValuesOf("timeZone");
  return zones.includes(DEFAULT_TIME_ZONE) ? zones : [DEFAULT_TIME_ZONE, ...zones];
}

/** "UTC+05:30" style offset of `timeZone` at `date` (DST-aware). */
export function getTimeZoneOffsetLabel(timeZone, date = new Date()) {
  const part = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "longOffset" })
    .formatToParts(date)
    .find((p) => p.type === "timeZoneName");

  // Intl returns "GMT+05:30", or just "GMT" at zero offset.
  const offset = part?.value.replace("GMT", "UTC") ?? "UTC";
  return offset === "UTC" ? "UTC+00:00" : offset;
}

/**
 * Groups IANA zones by their region prefix ("Asia/Kolkata" -> "Asia"), keeping the input order.
 * Zones without a region ("UTC") go in "Other".
 * @returns {Array<{ region: string, zones: string[] }>}
 */
export function groupTimeZones(zones) {
  const groups = new Map();

  for (const zone of zones) {
    const region = zone.includes("/") ? zone.split("/")[0] : "Other";
    groups.set(region, [...(groups.get(region) ?? []), zone]);
  }

  return [...groups].map(([region, regionZones]) => ({ region, zones: regionZones }));
}

/**
 * Extra words people search for. Browsers list some zones under legacy names
 * ("Asia/Calcutta", "Europe/Kiev"), and few people know a zone by its IANA id.
 */
const TIME_ZONE_SEARCH_KEYWORDS = {
  "Asia/Calcutta": ["Kolkata", "India", "IST", "Mumbai", "Delhi", "Bangalore", "Chennai"],
  "Asia/Kolkata": ["Calcutta", "India", "IST", "Mumbai", "Delhi", "Bangalore", "Chennai"],
  "Asia/Katmandu": ["Kathmandu", "Nepal"],
  "Asia/Kathmandu": ["Katmandu", "Nepal"],
  "Asia/Rangoon": ["Yangon", "Myanmar", "Burma"],
  "Asia/Yangon": ["Rangoon", "Myanmar", "Burma"],
  "Asia/Saigon": ["Ho Chi Minh", "Vietnam", "Hanoi"],
  "Asia/Ho_Chi_Minh": ["Saigon", "Vietnam", "Hanoi"],
  "Europe/Kiev": ["Kyiv", "Ukraine"],
  "Europe/Kyiv": ["Kiev", "Ukraine"],
  "Asia/Dhaka": ["Bangladesh"],
  "Asia/Karachi": ["Pakistan"],
  "Asia/Tokyo": ["Japan"],
  "Asia/Shanghai": ["China", "Beijing"],
  "Asia/Dubai": ["UAE", "Emirates"],
  "Asia/Singapore": ["Singapore"],
  "Asia/Seoul": ["Korea"],
  "Europe/London": ["UK", "England", "Britain", "GMT"],
  "America/New_York": ["Eastern", "EST", "EDT", "NYC"],
  "America/Chicago": ["Central", "CST", "CDT"],
  "America/Denver": ["Mountain", "MST", "MDT"],
  "America/Los_Angeles": ["Pacific", "PST", "PDT", "LA", "California"],
  "Australia/Sydney": ["AEST", "AEDT"],
};

/** Alias words for searching `timeZone` (empty for most zones). */
export function getTimeZoneKeywords(timeZone) {
  return TIME_ZONE_SEARCH_KEYWORDS[timeZone] ?? [];
}

/**
 * Strict search score for the zone picker, 0 (no match) to 1.
 * Every typed word must appear in `text` as a substring; matches at the start of a word
 * ("tokyo" in "Asia/Tokyo") rank above matches in the middle of one. Unlike a fuzzy matcher,
 * letters scattered through unrelated names never match.
 */
export function scoreTimeZoneMatch(text, search) {
  const words = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 1;

  const haystack = text.toLowerCase();
  let wordsMatchingAtWordStart = 0;

  for (const word of words) {
    if (!haystack.includes(word)) return 0;
    if (occursAtWordStart(haystack, word)) wordsMatchingAtWordStart++;
  }

  return 0.5 + 0.5 * (wordsMatchingAtWordStart / words.length);
}

/** True when `word` occurs in `haystack` at the very start or right after a non-alphanumeric character. */
function occursAtWordStart(haystack, word) {
  let index = haystack.indexOf(word);

  while (index !== -1) {
    if (index === 0 || !/[a-z0-9]/.test(haystack[index - 1])) return true;
    index = haystack.indexOf(word, index + 1);
  }

  return false;
}
