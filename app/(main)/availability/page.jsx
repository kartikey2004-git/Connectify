import { getUserAvailability } from "@/actions/availability";
import { DEFAULT_AVAILABILITY } from "@/lib/constants";
import AvailabilityForm from "./_components/availability-form";

export default async function AvailabilityPage() {
  const availability = await getUserAvailability();

  // null means the user has never saved availability: fall back to the defaults.
  return <AvailabilityForm initialData={availability ?? DEFAULT_AVAILABILITY} />;
}
