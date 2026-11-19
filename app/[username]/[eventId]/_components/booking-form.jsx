"use client";

import { useEffect, useMemo, useState } from "react";
import { format, parse } from "date-fns";
import { DayPicker } from "react-day-picker";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "react-day-picker/style.css";
import { createBooking } from "@/actions/bookings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { getLocalTimeZone } from "@/lib/time";
import { bookingSchema } from "@/lib/validators";

const DATE_FORMAT = "yyyy-MM-dd";
const TIME_FORMAT = "HH:mm";

function BookingResult({ success, error }) {
  return (
    <Card className="w-full text-center">
      <CardContent>
        <h2 className={`heading-lg mb-4 ${success ? "text-foreground" : "text-destructive"}`}>
          {success ? "Booking successful!" : "Booking failed"}
        </h2>
        <p className="body-text">
          {success ? "You're all set. The host will follow up with meeting details." : error}
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * @param availability `{ timeZone, slots }`: the host's zone and every bookable slot start as
 *   a UTC ISO instant. Days and times are derived here, in the guest's own zone.
 */
export default function BookingForm({ event, availability }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // The guest's zone is only known in the browser, so slot grouping waits for mount;
  // this keeps server and client markup identical during hydration.
  const [guestTimeZone, setGuestTimeZone] = useState(null);
  useEffect(() => setGuestTimeZone(getLocalTimeZone()), []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: zodResolver(bookingSchema) });

  const { loading, data: result, fn: runCreateBooking } = useFetch(createBooking);

  /** "yyyy-MM-dd" (guest-local) -> slot instants on that day */
  const slotsByDate = useMemo(() => {
    const grouped = new Map();
    if (!guestTimeZone) return grouped;

    for (const iso of availability.slots) {
      const dateKey = format(new Date(iso), DATE_FORMAT);
      grouped.set(dateKey, [...(grouped.get(dateKey) ?? []), iso]);
    }
    return grouped;
  }, [availability.slots, guestTimeZone]);

  const availableDays = useMemo(
    () => [...slotsByDate.keys()].map((key) => parse(key, DATE_FORMAT, new Date())),
    [slotsByDate],
  );

  const daySlots = selectedDate ? (slotsByDate.get(format(selectedDate, DATE_FORMAT)) ?? []) : [];

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    if (date) setValue("date", format(date, DATE_FORMAT));
  };

  const handleSlotSelect = (iso) => {
    setSelectedSlot(iso);
    setValue("time", format(new Date(iso), TIME_FORMAT));
  };

  // The server derives the end time and re-checks the slot; only the chosen start is sent.
  const onSubmit = async (formData) => {
    if (!selectedSlot) return;

    await runCreateBooking({
      eventId: event.id,
      name: formData.name,
      email: formData.email,
      startTime: selectedSlot,
      additionalInfo: formData.additionalInfo,
    });
  };

  if (result) {
    return <BookingResult success={result.success} error={result.error} />;
  }

  return (
    <Card className="w-full gap-8">
      <CardContent className="flex flex-col gap-8">
        <div className="flex flex-col gap-6 md:h-96 md:flex-row">
          <div className="w-full">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => !slotsByDate.has(format(date, DATE_FORMAT))}
              modifiers={{ available: availableDays }}
              modifiersClassNames={{ available: "font-semibold" }}
            />
          </div>

          <div className="thin-scrollbar size-full md:overflow-scroll">
            {guestTimeZone && (
              <p className="body-text mb-4">
                Times shown in {guestTimeZone}
                {guestTimeZone !== availability.timeZone &&
                  ` (host is in ${availability.timeZone})`}
              </p>
            )}

            {selectedDate && (
              <div className="mb-6">
                <h3 className="heading-sm mb-4">Available Time Slots</h3>
                <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                  {daySlots.map((iso) => (
                    <Button
                      key={iso}
                      onClick={() => handleSlotSelect(iso)}
                      variant={selectedSlot === iso ? "default" : "outline"}
                      size="sm"
                    >
                      {format(new Date(iso), TIME_FORMAT)}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {selectedSlot && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormField label="Your Name" htmlFor="name" error={errors.name}>
              <Input id="name" {...register("name")} placeholder="Your Name" />
            </FormField>

            <FormField label="Your Email" htmlFor="email" error={errors.email}>
              <Input id="email" {...register("email")} placeholder="Your Email" />
            </FormField>

            <FormField label="Additional Information" htmlFor="additionalInfo">
              <Textarea
                id="additionalInfo"
                {...register("additionalInfo")}
                placeholder="Additional Information"
              />
            </FormField>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Scheduling..." : "Schedule Event"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
