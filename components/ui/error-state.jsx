import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function ErrorState({
  icon: Icon = AlertCircle,
  title = "Something went wrong",
  description,
  action,
  className,
}) {
  return (
    <div
      data-slot="error-state"
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-xl border border-border bg-card px-6 py-16 text-center shadow-sm",
        className,
      )}
    >
      <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <Icon className="size-5" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export { ErrorState };
