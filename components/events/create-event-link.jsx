import Link from "next/link";
import { PenBox } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateEventLink() {
  return (
    <Button asChild size="sm">
      <Link href="/events?create=true">
        <PenBox />
        <span className="hidden md:inline">Create Event</span>
        <span className="sr-only md:hidden">Create Event</span>
      </Link>
    </Button>
  );
}
