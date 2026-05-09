import { cn } from "@/lib/utils";
import * as RadixAvatar from "@radix-ui/react-avatar";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  withRing?: boolean;
  className?: string;
  onClick?: () => void;
}

const sizeMap: Record<NonNullable<AvatarProps["size"]>, string> = {
  xs: "h-7 w-7 text-xs",
  sm: "h-9 w-9 text-sm",
  md: "h-11 w-11 text-base",
  lg: "h-14 w-14 text-lg",
  xl: "h-20 w-20 text-2xl",
};

export function Avatar({
  src,
  alt = "User",
  size = "md",
  withRing = false,
  className,
  onClick,
}: AvatarProps) {
  const initials = alt
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <RadixAvatar.Root
      onClick={onClick}
      className={cn(
        "relative inline-flex shrink-0 rounded-full overflow-hidden select-none",
        sizeMap[size],
        withRing && "avatar-ring",
        onClick && "cursor-pointer",
        className,
      )}
    >
      <RadixAvatar.Image
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
      />
      <RadixAvatar.Fallback className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground font-display font-semibold">
        {initials || "?"}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
}
