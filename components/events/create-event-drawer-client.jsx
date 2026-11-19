import { Suspense } from "react";
import { LoadingBar } from "@/components/ui/loading-bar";
import CreateEventDrawer from "./create-event-drawer";

// useSearchParams() in the drawer requires a Suspense boundary.
export default function CreateEventDrawerClient() {
  return (
    <Suspense fallback={<LoadingBar />}>
      <CreateEventDrawer />
    </Suspense>
  );
}
