import { cn } from "@/lib/utils";
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  ...props
}) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border/60 px-6 py-12 text-center",
        className,
      )}
      {...props}
    >
      {Icon ? (
        <Icon className="size-8 text-muted-foreground/30" aria-hidden="true" />
      ) : null}
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}

export { EmptyState };
