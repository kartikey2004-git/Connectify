"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateAvailability } from "@/actions/availability";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import {
  DAYS_OF_WEEK,
  DEFAULT_DAY_END,
  DEFAULT_DAY_START,
  TIME_SLOTS,
} from "@/lib/constants";
import { getLocalTimeZone } from "@/lib/time";
import { availabilitySchema } from "@/lib/validators";
import TimeZoneSelect from "./time-zone-select";

const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

function TimeSelect({ control, name, label, placeholder }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger className="w-32" aria-label={label}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {TIME_SLOTS.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}

export default function AvailabilityForm({ initialData }) {
  const {
    formState: { errors },
    setValue,
    control,
    handleSubmit,
    register,
    watch,
    getValues,
  } = useForm({
    resolver: zodResolver(availabilitySchema),
    defaultValues: initialData,
  });
  const { fn: runUpdateAvailability, loading, error } = useFetch(updateAvailability);

  // Hosts who have never saved availability start from their own zone.
  useEffect(() => {
    if (!getValues("timeZone")) setValue("timeZone", getLocalTimeZone());
  }, [getValues, setValue]);

  const setDayAvailable = (day, isAvailable) => {
    setValue(`${day}.isAvailable`, isAvailable);
    if (!isAvailable) {
      setValue(`${day}.startTime`, DEFAULT_DAY_START);
      setValue(`${day}.endTime`, DEFAULT_DAY_END);
    }
  };

  return (
    <Card className="thin-scrollbar max-h-[80vh] overflow-y-auto">
      <CardContent>
        <form onSubmit={handleSubmit((data) => runUpdateAvailability(data))} className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <Label htmlFor="timeZone" className="w-24">
              Time zone
            </Label>
            <Controller
              name="timeZone"
              control={control}
              render={({ field }) => (
                <TimeZoneSelect id="timeZone" value={field.value} onChange={field.onChange} />
              )}
            />
            <FieldError message={errors.timeZone?.message} />
            <p className="body-text w-full">
              The hours below are in this time zone; guests see them converted to their own.
            </p>
          </div>

          {DAYS_OF_WEEK.map((day) => {
            const isAvailable = watch(`${day}.isAvailable`);
            const dayLabel = capitalize(day);

            return (
              <div key={day} className="flex flex-wrap items-center gap-4">
                <Controller
                  name={`${day}.isAvailable`}
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id={`${day}-available`}
                      className="size-5"
                      checked={field.value}
                      onCheckedChange={(checked) => setDayAvailable(day, checked)}
                    />
                  )}
                />
                <Label htmlFor={`${day}-available`} className="w-24">
                  {dayLabel}
                </Label>

                {isAvailable && (
                  <>
                    <TimeSelect
                      control={control}
                      name={`${day}.startTime`}
                      label={`${dayLabel} start time`}
                      placeholder="Start Time"
                    />
                    <span className="mx-2 text-sm text-muted-foreground">to</span>
                    <TimeSelect
                      control={control}
                      name={`${day}.endTime`}
                      label={`${dayLabel} end time`}
                      placeholder="End Time"
                    />
                    <FieldError message={errors[day]?.endTime?.message} className="ml-2" />
                  </>
                )}
              </div>
            );
          })}

          <div className="flex flex-wrap items-center gap-4">
            <Label htmlFor="timeGap" className="w-60">
              Minimum gap before booking (minutes):
            </Label>
            <Input
              id="timeGap"
              type="number"
              className="w-32"
              {...register("timeGap", { valueAsNumber: true })}
            />
            <FieldError message={errors.timeGap?.message} className="ml-2" />
          </div>

          <FieldError message={error?.message} />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Update Availability"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
