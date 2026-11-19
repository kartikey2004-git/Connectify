"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createEvent } from "@/actions/events";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { eventSchema } from "@/lib/validators";

const DEFAULT_EVENT_DURATION = 30;

export default function EventForm({ onSubmitForm }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: { duration: DEFAULT_EVENT_DURATION, isPrivate: true },
  });
  const { error, loading, fn: runCreateEvent } = useFetch(createEvent);

  const onSubmit = async (data) => {
    const created = await runCreateEvent(data);
    if (created) {
      onSubmitForm();
      router.refresh();
    }
  };

  return (
    <form className="flex flex-col gap-5 px-5" onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Event Title" htmlFor="title" error={errors.title}>
        <Input id="title" {...register("title")} />
      </FormField>

      <FormField label="Event Description" htmlFor="description" error={errors.description}>
        <Input id="description" {...register("description")} />
      </FormField>

      <FormField label="Duration (minutes)" htmlFor="duration" error={errors.duration}>
        <Input
          id="duration"
          type="number"
          {...register("duration", { valueAsNumber: true })}
        />
      </FormField>

      <FormField label="Event Privacy" htmlFor="isPrivate" error={errors.isPrivate}>
        <Controller
          name="isPrivate"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value ? "true" : "false"}
              onValueChange={(value) => field.onChange(value === "true")}
            >
              <SelectTrigger id="isPrivate">
                <SelectValue placeholder="Select Privacy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Private</SelectItem>
                <SelectItem value="false">Public</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <FieldError message={error?.message} />

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Submitting..." : "Create Event"}
      </Button>
    </form>
  );
}
