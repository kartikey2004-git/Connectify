"use client";

import { useEffect, useState } from "react";

/**
 * Renders `children` only after hydration, showing `fallback` until then.
 *
 * Clerk's <SignIn>/<SignUp> render nothing on the server until clerk-js has loaded, but in the
 * browser clerk-js is often already loaded during hydration, so the first client render differs
 * from the server HTML and React logs a hydration mismatch. Deferring the widget to after mount
 * makes both first renders identical (the fallback).
 */
export default function ClientOnly({ children, fallback = null }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return mounted ? children : fallback;
}
