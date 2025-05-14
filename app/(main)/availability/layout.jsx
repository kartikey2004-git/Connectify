import { Suspense } from "react";

export default function AvailabilityLayout({ children }) {
  return (
    <div className="mx-auto">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-blue-600 font-medium">
              Loading Events...
            </span>
          </div>
        }
      >
        {children} 
        {/* here children is Availability page.jsx */}
      </Suspense>
    </div>
  );
}
