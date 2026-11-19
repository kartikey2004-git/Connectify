"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function ErrorState({ title = "Something went wrong", description, onRetry, className, ...props }) {
  return (
    <div
      data-slot="error-state"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-6 py-12 text-center",
        className,
      )}
      {...props}
    >
      <AlertCircle className="size-6 text-destructive" aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-1">
          Try again
        </Button>
      ) : null}
    </div>
  );
}

export { ErrorState };
