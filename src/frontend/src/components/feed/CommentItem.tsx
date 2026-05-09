import type { CommentPublic } from "@/backend";
import { Avatar } from "@/components/shared/Avatar";
import { useGetUser } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";

function formatRelativeTime(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const diff = Date.now() - ms;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h`;
  return `${Math.floor(diff / 86_400_000)}d`;
}

interface CommentItemProps {
  comment: CommentPublic;
  index: number;
  isOptimistic?: boolean;
}

export function CommentItem({
  comment,
  index,
  isOptimistic = false,
}: CommentItemProps) {
  const navigate = useNavigate();
  const uid = comment.userId.toText();
  const { data: user } = useGetUser(uid);

  const handleProfileClick = () => {
    navigate({ to: "/profile/$uid", params: { uid } });
  };

  return (
    <div
      data-ocid={`post.comment.${index}`}
      className={cn("flex gap-3 items-start", isOptimistic && "opacity-60")}
    >
      <Avatar
        src={user?.avatarUrl}
        alt={user?.username ?? "User"}
        size="xs"
        onClick={handleProfileClick}
      />
      <div className="flex-1 min-w-0 bg-muted rounded-2xl px-3 py-2">
        <div className="flex items-baseline gap-2">
          <button
            type="button"
            onClick={handleProfileClick}
            className="text-xs font-semibold text-foreground hover:text-primary transition-colors duration-200 truncate"
          >
            {user?.username ?? "@user"}
          </button>
          <span className="text-[10px] text-muted-foreground shrink-0">
            {isOptimistic ? "sending…" : formatRelativeTime(comment.createdAt)}
          </span>
        </div>
        <p className="text-sm text-foreground mt-0.5 leading-relaxed break-words">
          {comment.text}
        </p>
      </div>
    </div>
  );
}
