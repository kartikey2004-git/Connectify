import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DAYS_OF_WEEK } from "@/lib/constants";

function AvailabilityFormSkeleton() {
  return (
    <Card className="space-y-6 p-6">
      {DAYS_OF_WEEK.map((day) => (
        <div key={day} className="flex flex-wrap items-center gap-4">
          <Skeleton className="h-5 w-5 rounded-sm" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
      ))}
      <Skeleton className="h-9 w-full" />
    </Card>
  );
}

export default function AvailabilityLayout({ children }) {
  return (
    <div className="mx-auto">
      <Suspense fallback={<AvailabilityFormSkeleton />}>{children}</Suspense>
    </div>
  );
}
