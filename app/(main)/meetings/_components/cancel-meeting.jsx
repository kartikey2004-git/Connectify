"use client";

import { useRouter } from "next/navigation";
import { cancelMeeting } from "@/actions/meetings";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import useFetch from "@/hooks/use-fetch";

export default function CancelMeetingButton({ meetingId }) {
  const router = useRouter();
  const { loading, error, fn: runCancelMeeting } = useFetch(cancelMeeting);

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel this meeting?")) {
      await runCancelMeeting(meetingId);
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <Button variant="destructive" onClick={handleCancel} disabled={loading}>
        {loading ? "Canceling..." : "Cancel Meeting"}
      </Button>
      <FieldError message={error?.message} />
    </div>
  );
}
