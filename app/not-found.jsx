import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="section-shell py-16 sm:py-24">
      <p className="eyebrow">404</p>
      <h1 className="heading-lg mt-4">Page not found</h1>
      <p className="body-text mt-2 max-w-xl">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Button asChild>
          <Link href="/">Go back home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    </section>
  );
}
