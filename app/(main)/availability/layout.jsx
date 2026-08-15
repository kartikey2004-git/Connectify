import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AvailabilityLayout({ children }) {
  return (
    <div className="mx-auto">
      <Suspense fallback={<AvailabilityFormSkeleton />}>
        {children}
        {/* here children is Availability page.jsx */}
      </Suspense>
    </div>
  );
}

function AvailabilityFormSkeleton() {
  return (
    <Card className="max-w-2xl space-y-6 p-6">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex flex-wrap items-center gap-4">
          <Skeleton className="h-5 w-5 rounded-sm" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-32 rounded-md" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
      ))}
      <Skeleton className="h-9 w-full rounded-md" />
    </Card>
  );
}
