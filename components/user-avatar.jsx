import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/**
 * Round profile picture with an initial-letter fallback. Size it through `className` (e.g. "size-16").
 * The roundness comes from the Avatar primitive (`rounded-full`, with overflow hidden).
 */
export default function UserAvatar({ name, imageUrl, className, fallbackClassName }) {
  return (
    <Avatar className={className}>
      {imageUrl ? (
        <AvatarImage
          src={imageUrl}
          alt={name || "User"}
          className="size-full object-cover"
        />
      ) : (
        <AvatarFallback
          className={cn("bg-muted font-medium text-muted-foreground", fallbackClassName)}
        >
          {name?.charAt(0)}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
