import { USERNAME_MAX_LENGTH } from "@/lib/constants";

const SUFFIX_LENGTH = 4;
const FALLBACK_BASE = "user";

/**
 * A valid default username for a new user: their name, lowercased and hyphenated, plus the
 * last characters of their Clerk id to keep it unique (e.g. "kartikey-bhatnagar-kdjl").
 * Always satisfies usernameSchema: only a-z, 0-9 and hyphens, within USERNAME_MAX_LENGTH.
 */
export function generateUsername(name, clerkUserId) {
  const suffix = clerkUserId.slice(-SUFFIX_LENGTH).toLowerCase();
  const maxBaseLength = USERNAME_MAX_LENGTH - SUFFIX_LENGTH - 1; // room for "-" + suffix

  const base = name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // drop accent marks: "é" -> "e"
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "")
    .slice(0, maxBaseLength)
    .replace(/-+$/, "");

  return `${base || FALLBACK_BASE}-${suffix}`;
}
