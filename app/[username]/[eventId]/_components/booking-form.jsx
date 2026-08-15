
"use client";

import { createBooking } from "@/actions/bookings";
import { bookingSchema } from "@/app/lib/validators";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import useFetch from "@/hooks/use-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useForm } from "react-hook-form";

const BookingForm = ({ event, availability }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(bookingSchema),
  });

  useEffect(() => {
    if (selectedDate) {
      setValue("date", format(selectedDate, "yyyy-MM-dd"));
    }
  }, [selectedDate, setValue]);

  useEffect(() => {
    if (selectedTime) {
      setValue("time", selectedTime);
    }
  }, [selectedTime, setValue]);

  const { loading, data, fn: fnCreateBooking } = useFetch(createBooking);

  const availableDays = availability.map((day) => new Date(day.date));

  const timeSlots = selectedDate
    ? availability.find(
        (day) => day.date === format(selectedDate, "yyyy-MM-dd"),
      )?.slots || []
    : [];

  const onSubmit = async (data) => {
    console.log("Form submitted with data:", data);

    if (!selectedDate || !selectedTime) {
      console.error("Date or time not selected");
      return;
    }

    const startTime = new Date(
      `${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}:00Z`,
    );

    const endTime = new Date(startTime.getTime() + event.duration * 60000);

    const bookingData = {
      eventId: event.id,
      name: data.name,
      email: data.email,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      additionalInfo: data.additionalInfo,
    };

    await fnCreateBooking(bookingData);
  };

  if (data?.success) {
    return (
      <Card className="w-full text-center lg:w-2/3">
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Booking successful!
          </h2>
          <p className="text-muted-foreground">
            You&apos;re all set. The host will follow up with meeting details.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (data?.success === false) {
    return (
      <Card className="w-full text-center lg:w-2/3">
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4 text-destructive">
            Booking failed
          </h2>
          <p className="text-muted-foreground">{data.error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full gap-8 lg:w-2/3">
      <CardContent className="flex flex-col gap-8">
        <div className="md:h-96 flex flex-col md:flex-row gap-6">
          <div className="w-full">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setSelectedTime(null);
              }}
              disabled={[{ before: new Date() }]}
              modifiers={{ available: availableDays }}
              modifiersStyles={{
                available: {
                  background: "hsl(var(--primary))",
                  borderRadius: "100%",
                },
              }}
            />
          </div>

          <div className="w-full h-full md:overflow-scroll scrollbar-hide">
            {selectedDate && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-foreground">
                  Available Time Slots
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                  {timeSlots.map((slot) => {
                    return (
                      <Button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        variant={selectedTime === slot ? "default" : "outline"}
                        size="sm"
                      >
                        {slot}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {selectedTime && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" {...register("name")} placeholder="Your Name" />
              {errors.name && (
                <p className="text-destructive text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Your Email</Label>
              <Input id="email" {...register("email")} placeholder="Your Email" />
              {errors.email && (
                <p className="text-destructive text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                {...register("additionalInfo")}
                placeholder="Additional Information"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Scheduling..." : "Schedule Event"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingForm;