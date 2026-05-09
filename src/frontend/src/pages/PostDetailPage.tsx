import type { CommentPublic } from "@/backend";
import { CommentItem } from "@/components/feed/CommentItem";
import { Layout } from "@/components/layout/Layout";
import { Avatar } from "@/components/shared/Avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import {
  useAddComment,
  useGetComments,
  useGetPost,
  useGetUser,
  useLikePost,
  useSavePost,
  useUnlikePost,
} from "@/hooks/useQueries";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Bookmark,
  ChevronLeft,
  Heart,
  MessageCircle,
  Send,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatRelativeTime(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const diff = Date.now() - ms;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 2_592_000_000) return `${Math.floor(diff / 86_400_000)}d ago`;
  return new Date(ms).toLocaleDateString();
}

// ─── Post Skeleton ───────────────────────────────────────────────────────────

function PostSkeleton() {
  return (
    <div data-ocid="post.loading_state" className="animate-pulse">
      <div className="flex items-center gap-3 px-4 py-3">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-3 w-28 rounded" />
          <Skeleton className="h-2.5 w-16 rounded" />
        </div>
      </div>
      <Skeleton className="aspect-square w-full" />
      <div className="px-4 py-3 flex gap-4">
        <Skeleton className="h-6 w-14 rounded" />
        <Skeleton className="h-6 w-14 rounded" />
      </div>
      <div className="px-4 space-y-2 pb-4">
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-4/5 rounded" />
      </div>
    </div>
  );
}

// ─── Post Author Header ──────────────────────────────────────────────────────

function PostAuthor({
  userId,
  createdAt,
}: {
  userId: { toText(): string };
  createdAt: bigint;
}) {
  const uid = userId.toText();
  const navigate = useNavigate();
  const { data: user } = useGetUser(uid);

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Avatar
        src={user?.avatarUrl}
        alt={user?.username ?? "User"}
        size="sm"
        withRing
        onClick={() => navigate({ to: "/profile/$uid", params: { uid } })}
      />
      <div className="flex-1 min-w-0">
        <button
          type="button"
          onClick={() => navigate({ to: "/profile/$uid", params: { uid } })}
          className="font-display font-semibold text-sm text-foreground hover:text-primary transition-colors duration-200 block truncate"
        >
          {user?.username ?? "@user"}
        </button>
        <p className="text-xs text-muted-foreground">
          {formatRelativeTime(createdAt)}
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function PostDetailPage() {
  const { postId } = useParams({ strict: false }) as { postId: string };
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { data: post, isLoading: postLoading } = useGetPost(postId ?? "");
  const { data: comments = [], isLoading: commentsLoading } = useGetComments(
    postId ?? "",
  );

  const addComment = useAddComment();
  const likePost = useLikePost();
  const unlikePost = useUnlikePost();
  const savePost = useSavePost();

  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [optimisticComments, setOptimisticComments] = useState<CommentPublic[]>(
    [],
  );
  const commentInputRef = useRef<HTMLInputElement>(null);

  const allComments = [...comments, ...optimisticComments];

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Sign in to like posts");
      return;
    }
    const next = !liked;
    setLiked(next);
    try {
      if (next) await likePost.mutateAsync(postId);
      else await unlikePost.mutateAsync(postId);
    } catch {
      setLiked(!next);
      toast.error("Something went wrong");
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error("Sign in to save posts");
      return;
    }
    setSaved((v) => !v);
    try {
      await savePost.mutateAsync(postId);
    } catch {
      setSaved((v) => !v);
      toast.error("Something went wrong");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = comment.trim();
    if (!text) return;
    if (!isAuthenticated) {
      toast.error("Sign in to comment");
      return;
    }

    // Optimistic update
    const fakeId = `opt-${Date.now()}`;
    const optimistic: CommentPublic = {
      commentId: fakeId,
      postId,
      text,
      userId: { toText: () => "" } as unknown as CommentPublic["userId"],
      createdAt: BigInt(Date.now()) * 1_000_000n,
    };
    setOptimisticComments((prev) => [...prev, optimistic]);
    setComment("");

    try {
      await addComment.mutateAsync({ postId, text });
      setOptimisticComments((prev) =>
        prev.filter((c) => c.commentId !== fakeId),
      );
    } catch {
      setOptimisticComments((prev) =>
        prev.filter((c) => c.commentId !== fakeId),
      );
      toast.error("Failed to post comment");
    }
  };

  const scrollToComments = () => {
    commentInputRef.current?.focus();
  };

  const displayedLikesCount = post
    ? Number(post.likesCount) + (liked ? 1 : 0)
    : 0;

  return (
    <Layout>
      {/* Sticky header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          data-ocid="post.back_button"
          onClick={() => navigate({ to: "/" })}
          className="p-2 -ml-2 rounded-full hover:bg-muted transition-smooth active:scale-90"
          aria-label="Go back"
        >
          <ChevronLeft size={22} className="text-foreground" />
        </button>
        <span className="text-base font-display font-bold text-foreground">
          Post
        </span>
      </header>

      {/* Loading skeleton */}
      {postLoading ? (
        <PostSkeleton />
      ) : !post ? (
        /* Error / not found */
        <motion.div
          data-ocid="post.error_state"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 gap-4 px-8 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
            <MessageCircle size={28} className="text-muted-foreground" />
          </div>
          <div>
            <p className="font-display font-bold text-foreground text-lg">
              Post not found
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              This post may have been removed or the link is invalid.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            data-ocid="post.back_home_button"
            className="mt-2 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold transition-smooth hover:opacity-90"
          >
            Back to Feed
          </button>
        </motion.div>
      ) : (
        /* Post content */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="pb-32"
        >
          {/* Author row */}
          <PostAuthor userId={post.userId} createdAt={post.createdAt} />

          {/* Post image */}
          <div className="aspect-square w-full overflow-hidden bg-muted">
            <motion.img
              src={post.imageUrl}
              alt={post.caption}
              className="h-full w-full object-cover"
              initial={{ scale: 1.03, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* Actions row */}
          <div className="px-4 py-3 flex items-center gap-5 border-b border-border">
            {/* Like */}
            <motion.button
              type="button"
              data-ocid="post.like_button"
              onClick={handleLike}
              whileTap={{ scale: 0.85 }}
              className="flex items-center gap-1.5 transition-smooth"
              aria-label={liked ? "Unlike" : "Like"}
            >
              <Heart
                size={24}
                className={
                  liked ? "fill-primary stroke-primary" : "stroke-foreground"
                }
              />
              <span
                className={`text-sm font-medium ${
                  liked ? "text-primary" : "text-foreground"
                }`}
              >
                {displayedLikesCount}
              </span>
            </motion.button>

            {/* Comment */}
            <motion.button
              type="button"
              data-ocid="post.comment_button"
              onClick={scrollToComments}
              whileTap={{ scale: 0.85 }}
              className="flex items-center gap-1.5"
              aria-label="Comment"
            >
              <MessageCircle size={24} className="stroke-foreground" />
              <span className="text-sm font-medium text-foreground">
                {Number(post.commentsCount) + optimisticComments.length}
              </span>
            </motion.button>

            {/* Save (right-aligned) */}
            <div className="ml-auto">
              <motion.button
                type="button"
                data-ocid="post.save_button"
                onClick={handleSave}
                whileTap={{ scale: 0.85 }}
                aria-label={saved ? "Unsave" : "Save"}
              >
                <Bookmark
                  size={24}
                  className={
                    saved ? "fill-primary stroke-primary" : "stroke-foreground"
                  }
                />
              </motion.button>
            </div>
          </div>

          {/* Caption */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm text-foreground leading-relaxed break-words">
              {post.caption}
            </p>
          </div>

          {/* Comments section */}
          <div className="px-4 pt-4 pb-2 space-y-3">
            <h3 className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider">
              Comments
              {allComments.length > 0 && (
                <span className="ml-1.5">({allComments.length})</span>
              )}
            </h3>

            {commentsLoading ? (
              <div
                data-ocid="post.comments.loading_state"
                className="space-y-3"
              >
                {["c1", "c2", "c3"].map((k) => (
                  <div key={k} className="flex gap-3 items-start">
                    <Skeleton className="h-7 w-7 rounded-full shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-24 rounded" />
                      <Skeleton className="h-3 w-full rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : allComments.length === 0 ? (
              <p
                data-ocid="post.comments.empty_state"
                className="text-sm text-muted-foreground py-6 text-center"
              >
                No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              <AnimatePresence initial={false}>
                {allComments.map((c, i) => (
                  <motion.div
                    key={c.commentId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, delay: i < 5 ? i * 0.04 : 0 }}
                  >
                    <CommentItem
                      comment={c}
                      index={i + 1}
                      isOptimistic={c.commentId.startsWith("opt-")}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      )}

      {/* Comment input — sticky above bottom nav */}
      <div className="fixed bottom-16 left-0 right-0 max-w-lg mx-auto bg-card/95 backdrop-blur-md border-t border-border px-4 py-3 z-30">
        <form onSubmit={handleAddComment} className="flex items-center gap-3">
          <Avatar alt="Me" size="xs" />
          <input
            ref={commentInputRef}
            type="text"
            placeholder={
              isAuthenticated ? "Add a comment…" : "Sign in to comment"
            }
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            data-ocid="post.comment_input"
            disabled={!isAuthenticated || addComment.isPending}
            className="flex-1 min-w-0 h-10 px-4 rounded-full bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth disabled:opacity-50"
          />
          <motion.button
            type="submit"
            data-ocid="post.submit_comment_button"
            disabled={
              !comment.trim() || addComment.isPending || !isAuthenticated
            }
            whileTap={{ scale: 0.9 }}
            className="h-10 w-10 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 transition-smooth hover:opacity-90"
            aria-label="Post comment"
          >
            <Send size={15} />
          </motion.button>
        </form>
      </div>
    </Layout>
  );
}
