"use client";

import { availabilitySchema } from "@/app/lib/validators";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { timeSlots } from "../data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { updateAvailability } from "@/actions/availability";

const AvailabilityForm = ({ initialData }) => {
  // console.log("Availability Form ka intial data ", initialData);

  const {
    formState: { errors },
    setValue,
    control,
    handleSubmit,
    register,
    watch,
  } = useForm({
    resolver: zodResolver(availabilitySchema),
    defaultValues: { ...initialData },
  });

  const {
    fn: fnUpdateAvailability,
    loading,
    error,
  } = useFetch(updateAvailability);

  const onSubmit = async (data) => {
    await fnUpdateAvailability(data);
  };

  return (
    <Card className="max-w-2xl max-h-[80vh] overflow-y-auto scrollbar-hide">
      <CardContent>
      {/* we have different checkboxes for each and every day in form  */}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/*
    
    for each and every field , we have this isAvailable , this is what will define particular day is available or not
   
    if we check this checkbox, the day is available 
    
    */}

        {[
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ].map((day) => {
          // Watch  to the entire form update/change based on onChange and re-render at the useForm.

          // this is what we are monitoring and if this is selected this will be true else it will be false

          const isAvailable = watch(`${day}.isAvailable`);

          return (
            <div
              key={day}
              className="flex items-center flex-wrap gap-4 rounded-md"
            >
              <Controller
                name={`${day}.isAvailable`}
                control={control}
                render={({ field }) => {
                  return (
                    <Checkbox
                      className="w-5 h-5"
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        setValue(`${day}.isAvailable`, checked);

                        if (!checked) {
                          setValue(`${day}.startTime`, "09:00");
                          setValue(`${day}.endTime`, "17:00");
                        }
                      }}
                    />
                  );
                }}
              />

              <Label className="w-24 font-medium">
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </Label>

              {/* We want to make sure whenever we check on any of the checkboxes only then the time shows up over here */}

              {isAvailable && (
                <>
                  <Controller
                    name={`${day}.startTime`}
                    control={control}
                    render={({ field }) => {
                      return (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Start Time" />
                          </SelectTrigger>

                          <SelectContent>
                            {timeSlots.map((time) => {
                              return (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />

                  <span className="text-sm text-muted-foreground mx-2">to</span>

                  <Controller
                    name={`${day}.endTime`}
                    control={control}
                    render={({ field }) => {
                      return (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="End Time" />
                          </SelectTrigger>

                          <SelectContent>
                            {timeSlots.map((time) => {
                              return (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />

                  {errors[day]?.endTime && (
                    <span className="text-destructive text-sm ml-2">
                      {errors[day].endTime.message}
                    </span>
                  )}
                </>
              )}
            </div>
          );
        })}

        {/* Field for adding the timeGap  */}

        <div className="flex items-center flex-wrap gap-4">
          <Label className="w-60 font-medium">
            Minimum gap before booking (minutes):
          </Label>

          <Input
            type="number"
            {...register("timeGap", {
              valueAsNumber: true,
            })}
            className="w-32"
          />

          {errors?.timeGap && (
            <span className="text-destructive text-sm ml-2">
              {errors.timeGap.message}
            </span>
          )}
        </div>

        {/* Update Availability Button */}

        {error && (
          <div className="text-destructive text-sm">{error?.message}</div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Updating..." : "Update Availability"}
        </Button>
      </form>
      </CardContent>
    </Card>
  );
};

export default AvailabilityForm;



/*

Controller is used for supporting the third Party component  where register is not supported

- control:

   Yeh useForm() se aata hai.

   Iska kaam hota hai React Hook Form ke form state ko connect karna  component ke saath.

   Samjho ki control ke through hi power milta hai form state ko handle karne ka.


-  render ke andar:

      Yahan hum batate hain ki kaunsa component render hoga 

      Saath hi, field object deta hai React Hook Form, jo form ko is component ke saath bind karta hai.


- field object:

    value ➔ current value (jo true ya false hoga boolean form mein)

    onChange ➔ method jo batata hai React Hook Form ko ki value badli hai

*/