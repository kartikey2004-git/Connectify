import { cn } from "@/lib/utils";

/** Inline validation or request error. Renders nothing when there is no message. */
function FieldError({ message, className, ...props }) {
  if (!message) return null;

  return (
    <p
      role="alert"
      data-slot="field-error"
      className={cn("text-sm text-destructive", className)}
      {...props}
    >
      {message}
    </p>
  );
}

export { FieldError };
