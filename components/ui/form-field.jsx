import { FieldError } from "@/components/ui/field-error";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** Label + control + error, stacked. `htmlFor` must match the control's id. */
function FormField({ label, htmlFor, error, className, children }) {
  return (
    <div data-slot="form-field" className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      <FieldError message={error?.message} />
    </div>
  );
}

export { FormField };
