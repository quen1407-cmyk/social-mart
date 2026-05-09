import { cn } from "@/lib/utils";

interface SpinnerOverlayProps {
  fullScreen?: boolean;
  message?: string;
  className?: string;
}

export function SpinnerOverlay({
  fullScreen = false,
  message,
  className,
}: SpinnerOverlayProps) {
  return (
    <div
      data-ocid="spinner.loading_state"
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        fullScreen
          ? "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          : "w-full py-12",
        className,
      )}
    >
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-2 border-muted" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
      </div>
      {message && (
        <p className="text-sm text-muted-foreground font-body">{message}</p>
      )}
    </div>
  );
}

export function PostCardSkeleton() {
  return (
    <div
      className="feed-card overflow-hidden animate-pulse"
      data-ocid="post.loading_state"
    >
      <div className="flex items-center gap-3 p-4">
        <div className="h-9 w-9 rounded-full bg-muted" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3.5 w-28 rounded bg-muted" />
          <div className="h-3 w-20 rounded bg-muted" />
        </div>
      </div>
      <div className="aspect-square bg-muted" />
      <div className="p-4 space-y-2">
        <div className="h-3.5 w-3/4 rounded bg-muted" />
        <div className="h-3 w-1/2 rounded bg-muted" />
      </div>
    </div>
  );
}
