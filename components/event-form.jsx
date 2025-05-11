"use client"

import { eventSchema } from "@/app/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import useFetch from "@/hooks/use-fetch";
import { createEvent } from "@/actions/events";
import { useRouter } from "next/navigation";



const EventForm = ({onSubmitForm}) => {
  const router = useRouter()

  // useRouter() : This hook gives access the router object inside the Pages Router.

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      duration: 30,
      isPrivate: true,
    },
  });

  const { 
    error, 
    loading, 
    fn: fnCreateEvent 
  } = useFetch(createEvent);

  const onSubmit = async (data) => {
    await fnCreateEvent(data)

    if (!loading && !error) {
      onSubmitForm()
      router.refresh()
    }
  };

  return (
    <form
      className="px-5 flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Event Title
        </label>

        <Input id="title" {...register("title")} className="mt-1" />

        {errors.title && (
          <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>


      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Event Description
        </label>

        <Input id="description" {...register("description")} className="mt-1" />

        {errors.description && (
          <p className="text-red-600 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>


      <div>
        <label
          htmlFor="duration"
          className="block text-sm font-medium text-gray-700"
        >
          Duration ( minutes )
        </label>

        <Input
          id="duration"
          {...register("duration", {
            valueAsNumber: true,
          })}
          type="number"
          className="mt-1"
        />

        {errors.duration && (
          <p className="text-red-600 text-sm mt-1">{errors.duration.message}</p>
        )}
      </div>


      <div>
        <label
          htmlFor="isPrivate"
          className="block text-sm font-medium text-gray-700"
        >
          Event Privacy
        </label>

        <Controller
          name="isPrivate"
          control={control}

          render={({ field }) => (
            <Select
              value={field.value ? "true" : "false"}

              onValueChange={(value) => field.onChange(value === "true")}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Privacy" />
              </SelectTrigger>
              
              <SelectContent>
                <SelectItem value="true">Private</SelectItem>
                <SelectItem value="false">Public</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {errors.isPrivate && (
          <p className="text-red-600 text-sm mt-1">
            {errors.isPrivate.message}
          </p>
        )}
      </div>

      {error && <p className="text-red-600 text-xs mt-1">{error.message}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Create Event"}
      </Button>

    </form>
  );
};

export default EventForm;

/*
 
- This is using React Hook Form's <Controller> to wrap a custom Select component for handling a field named isPrivate.

- It allows form state management for this Select input.


- control={control} --> control comes from useForm(). It connects this field to the form's state machine

- render — this is where you tell how to render your custom component.

field — an object with 
    methods and values (value, onChange, etc.) that hook the component to React Hook Form.

---------------------------------------------------


- control:

   Yeh useForm() se aata hai.

   Iska kaam hota hai React Hook Form ke form state ko connect karna is Select component ke saath.

   Samjho ki control ke through hi power milta hai form state ko handle karne ka.


-  render ke andar:

      Yahan hum batate hain ki kaunsa component render hoga (jaise Select).

      Saath hi, field object deta hai React Hook Form, jo form ko is Select ke saath bind karta hai.


- field object:

    value ➔ current value (jo true ya false hoga boolean form mein)

    onChange ➔ method jo batata hai React Hook Form ko ki value badli hai


-  Select ke andar:

   value={field.value ? "true" : "false"}

      - Yani agar field.value true hai to Select ko string "true" denge, warna "false".

      - Kyunki Select strings handle karta hai, na ki booleans.

  
  onValueChange={(value) => field.onChange(value === "true")}

  Is code mein onValueChange function jo hai, wo field ki value ko check karta hai:

     - value === "true" ek comparison expression hai jo check karta hai ki value exactly "true" string ke equal hai ya nahi.

          - Agar value "true" hai, toh value === "true" true return karega.

              - ( field.onChange(true) ka matlab hai ki field ki value ko true set karna. )


          - Agar value kuch aur jaise "false" hai, toh value === "true" false return karega.

              - ( field.onChange(false) ka matlab hai ki field ki value ko false set karna. )
     
*/

