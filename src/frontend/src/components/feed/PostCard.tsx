import type { PostPublic } from "@/backend";
import { Avatar } from "@/components/shared/Avatar";
import { useLikePost, useSavePost, useUnlikePost } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { Bookmark, Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

function formatRelativeTime(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  const diff = Date.now() - ms;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d ago`;
  return new Date(ms).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

interface PostCardProps {
  post: PostPublic;
  index: number;
  /** pre-resolved username and avatarUrl for this post's author */
  username?: string;
  avatarUrl?: string;
}

export function PostCard({ post, index, username, avatarUrl }: PostCardProps) {
  const navigate = useNavigate();
  const likePost = useLikePost();
  const unlikePost = useUnlikePost();
  const savePost = useSavePost();

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [localLikes, setLocalLikes] = useState(Number(post.likesCount));
  const [imgError, setImgError] = useState(false);

  const uid = post.userId.toString();
  const displayName = username ?? `${uid.slice(0, 8)}…`;
  const avatarSrc =
    avatarUrl ??
    `https://api.dicebear.com/9.x/notionists/svg?seed=${uid.slice(0, 8)}`;
  const timeLabel = formatRelativeTime(post.createdAt);

  function handleLike() {
    if (liked) {
      setLiked(false);
      setLocalLikes((n) => Math.max(0, n - 1));
      unlikePost.mutate(post.postId);
    } else {
      setLiked(true);
      setLocalLikes((n) => n + 1);
      likePost.mutate(post.postId);
    }
  }

  function handleSave() {
    setSaved((v) => !v);
    savePost.mutate(post.postId);
  }

  function goToProfile() {
    navigate({ to: "/profile/$uid", params: { uid } });
  }

  function goToPost() {
    navigate({ to: "/post/$postId", params: { postId: post.postId } });
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.06,
        duration: 0.32,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="feed-card mx-4 my-2 overflow-hidden"
      data-ocid={`feed.item.${index + 1}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <Avatar
          src={avatarSrc}
          alt={displayName}
          size="sm"
          withRing
          onClick={goToProfile}
          data-ocid={`feed.avatar.${index + 1}`}
        />
        <div className="flex-1 min-w-0">
          <button
            type="button"
            onClick={goToProfile}
            className="font-display font-semibold text-sm text-foreground truncate block hover:text-primary transition-colors duration-200"
            data-ocid={`feed.username.${index + 1}`}
          >
            {displayName}
          </button>
          <p className="text-xs text-muted-foreground">{timeLabel}</p>
        </div>
        <button
          type="button"
          className="p-1.5 rounded-lg hover:bg-muted transition-smooth text-muted-foreground"
          aria-label="More options"
          data-ocid={`feed.more_button.${index + 1}`}
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Image */}
      <button
        type="button"
        className="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        onClick={goToPost}
        aria-label="View post"
        data-ocid={`feed.post_image.${index + 1}`}
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={imgError ? "/assets/images/placeholder.svg" : post.imageUrl}
            alt={post.caption || "Post image"}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        </div>
      </button>

      {/* Actions */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1.5 transition-smooth group",
              liked ? "text-primary" : "text-foreground",
            )}
            aria-label={liked ? "Unlike post" : "Like post"}
            aria-pressed={liked}
            data-ocid={`feed.like_button.${index + 1}`}
          >
            <Heart
              size={22}
              strokeWidth={1.75}
              className={cn(
                "transition-all duration-200",
                liked
                  ? "fill-primary stroke-primary scale-110"
                  : "stroke-foreground group-hover:stroke-primary",
              )}
            />
            <span className="text-sm font-medium tabular-nums">
              {localLikes}
            </span>
          </button>

          <button
            type="button"
            onClick={goToPost}
            className="flex items-center gap-1.5 text-foreground transition-smooth group"
            aria-label="View comments"
            data-ocid={`feed.comment_button.${index + 1}`}
          >
            <MessageCircle
              size={22}
              strokeWidth={1.75}
              className="stroke-foreground group-hover:stroke-primary transition-colors duration-200"
            />
            <span className="text-sm font-medium tabular-nums">
              {Number(post.commentsCount)}
            </span>
          </button>

          <div className="ml-auto">
            <button
              type="button"
              onClick={handleSave}
              className="transition-smooth"
              aria-label={saved ? "Unsave post" : "Save post"}
              aria-pressed={saved}
              data-ocid={`feed.save_button.${index + 1}`}
            >
              <Bookmark
                size={22}
                strokeWidth={1.75}
                className={cn(
                  "transition-all duration-200",
                  saved
                    ? "fill-primary stroke-primary"
                    : "stroke-foreground hover:stroke-primary",
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="px-4 pb-4 pt-1.5">
          <p className="text-sm text-foreground leading-relaxed">
            <button
              type="button"
              onClick={goToProfile}
              className="font-semibold font-display mr-1 hover:text-primary transition-colors duration-200"
            >
              {displayName}
            </button>
            {post.caption}
          </p>
          {Number(post.commentsCount) > 0 && (
            <button
              type="button"
              onClick={goToPost}
              className="text-xs text-muted-foreground mt-1 hover:text-foreground transition-colors duration-200"
              data-ocid={`feed.view_comments.${index + 1}`}
            >
              View all {Number(post.commentsCount)} comment
              {Number(post.commentsCount) !== 1 ? "s" : ""}
            </button>
          )}
        </div>
      )}
    </motion.article>
  );
}
