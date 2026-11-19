import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder the size of Clerk's sign-in / sign-up card, so the page doesn't jump when it mounts. */
export default function AuthCardSkeleton() {
  return <Skeleton className="h-[26rem] w-[25rem] max-w-full" />;
}
