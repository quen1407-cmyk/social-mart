import { u as useNavigate, j as jsxRuntimeExports, c as cn, b as useParams, r as reactExports, a as ue } from "./index-CgYOV5jf.js";
import { A as Avatar } from "./Avatar-DYvFa4y-.js";
import { b as useGetUser, c as useGetPost, d as useGetComments, e as useAddComment, f as useLikePost, g as useUnlikePost, h as useSavePost } from "./useQueries-B3XIVZSS.js";
import { L as Layout } from "./Layout-B60O5qPC.js";
import { S as Skeleton } from "./skeleton-6hK8UmDr.js";
import { u as useAuth } from "./index-BikGRg3B.js";
import { c as createLucideIcon, m as motion } from "./proxy-BwgDIH52.js";
import { M as MessageCircle, H as Heart, B as Bookmark } from "./message-circle-B6UI5p2X.js";
import { A as AnimatePresence } from "./index-C5JKQtdB.js";
import { S as Send } from "./send-C19q2KBk.js";
import "./user-D4VcQ6pj.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode);
function formatRelativeTime$1(ts) {
  const ms = Number(ts) / 1e6;
  const diff = Date.now() - ms;
  if (diff < 6e4) return "just now";
  if (diff < 36e5) return `${Math.floor(diff / 6e4)}m`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}h`;
  return `${Math.floor(diff / 864e5)}d`;
}
function CommentItem({
  comment,
  index,
  isOptimistic = false
}) {
  const navigate = useNavigate();
  const uid = comment.userId.toText();
  const { data: user } = useGetUser(uid);
  const handleProfileClick = () => {
    navigate({ to: "/profile/$uid", params: { uid } });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `post.comment.${index}`,
      className: cn("flex gap-3 items-start", isOptimistic && "opacity-60"),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Avatar,
          {
            src: user == null ? void 0 : user.avatarUrl,
            alt: (user == null ? void 0 : user.username) ?? "User",
            size: "xs",
            onClick: handleProfileClick
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 bg-muted rounded-2xl px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleProfileClick,
                className: "text-xs font-semibold text-foreground hover:text-primary transition-colors duration-200 truncate",
                children: (user == null ? void 0 : user.username) ?? "@user"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground shrink-0", children: isOptimistic ? "sending…" : formatRelativeTime$1(comment.createdAt) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground mt-0.5 leading-relaxed break-words", children: comment.text })
        ] })
      ]
    }
  );
}
function formatRelativeTime(ts) {
  const ms = Number(ts) / 1e6;
  const diff = Date.now() - ms;
  if (diff < 6e4) return "just now";
  if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
  if (diff < 2592e6) return `${Math.floor(diff / 864e5)}d ago`;
  return new Date(ms).toLocaleDateString();
}
function PostSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "post.loading_state", className: "animate-pulse", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-9 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-28 rounded" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-2.5 w-16 rounded" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-square w-full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 flex gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-14 rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-14 rounded" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 space-y-2 pb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-4/5 rounded" })
    ] })
  ] });
}
function PostAuthor({
  userId,
  createdAt
}) {
  const uid = userId.toText();
  const navigate = useNavigate();
  const { data: user } = useGetUser(uid);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Avatar,
      {
        src: user == null ? void 0 : user.avatarUrl,
        alt: (user == null ? void 0 : user.username) ?? "User",
        size: "sm",
        withRing: true,
        onClick: () => navigate({ to: "/profile/$uid", params: { uid } })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => navigate({ to: "/profile/$uid", params: { uid } }),
          className: "font-display font-semibold text-sm text-foreground hover:text-primary transition-colors duration-200 block truncate",
          children: (user == null ? void 0 : user.username) ?? "@user"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatRelativeTime(createdAt) })
    ] })
  ] });
}
function PostDetailPage() {
  const { postId } = useParams({ strict: false });
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: post, isLoading: postLoading } = useGetPost(postId ?? "");
  const { data: comments = [], isLoading: commentsLoading } = useGetComments(
    postId ?? ""
  );
  const addComment = useAddComment();
  const likePost = useLikePost();
  const unlikePost = useUnlikePost();
  const savePost = useSavePost();
  const [comment, setComment] = reactExports.useState("");
  const [liked, setLiked] = reactExports.useState(false);
  const [saved, setSaved] = reactExports.useState(false);
  const [optimisticComments, setOptimisticComments] = reactExports.useState(
    []
  );
  const commentInputRef = reactExports.useRef(null);
  const allComments = [...comments, ...optimisticComments];
  const handleLike = async () => {
    if (!isAuthenticated) {
      ue.error("Sign in to like posts");
      return;
    }
    const next = !liked;
    setLiked(next);
    try {
      if (next) await likePost.mutateAsync(postId);
      else await unlikePost.mutateAsync(postId);
    } catch {
      setLiked(!next);
      ue.error("Something went wrong");
    }
  };
  const handleSave = async () => {
    if (!isAuthenticated) {
      ue.error("Sign in to save posts");
      return;
    }
    setSaved((v) => !v);
    try {
      await savePost.mutateAsync(postId);
    } catch {
      setSaved((v) => !v);
      ue.error("Something went wrong");
    }
  };
  const handleAddComment = async (e) => {
    e.preventDefault();
    const text = comment.trim();
    if (!text) return;
    if (!isAuthenticated) {
      ue.error("Sign in to comment");
      return;
    }
    const fakeId = `opt-${Date.now()}`;
    const optimistic = {
      commentId: fakeId,
      postId,
      text,
      userId: { toText: () => "" },
      createdAt: BigInt(Date.now()) * 1000000n
    };
    setOptimisticComments((prev) => [...prev, optimistic]);
    setComment("");
    try {
      await addComment.mutateAsync({ postId, text });
      setOptimisticComments(
        (prev) => prev.filter((c) => c.commentId !== fakeId)
      );
    } catch {
      setOptimisticComments(
        (prev) => prev.filter((c) => c.commentId !== fakeId)
      );
      ue.error("Failed to post comment");
    }
  };
  const scrollToComments = () => {
    var _a;
    (_a = commentInputRef.current) == null ? void 0 : _a.focus();
  };
  const displayedLikesCount = post ? Number(post.likesCount) + (liked ? 1 : 0) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": "post.back_button",
          onClick: () => navigate({ to: "/" }),
          className: "p-2 -ml-2 rounded-full hover:bg-muted transition-smooth active:scale-90",
          "aria-label": "Go back",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 22, className: "text-foreground" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-display font-bold text-foreground", children: "Post" })
    ] }),
    postLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(PostSkeleton, {}) : !post ? (
      /* Error / not found */
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          "data-ocid": "post.error_state",
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          className: "flex flex-col items-center justify-center py-24 gap-4 px-8 text-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 28, className: "text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-lg", children: "Post not found" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "This post may have been removed or the link is invalid." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => navigate({ to: "/" }),
                "data-ocid": "post.back_home_button",
                className: "mt-2 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold transition-smooth hover:opacity-90",
                children: "Back to Feed"
              }
            )
          ]
        }
      )
    ) : (
      /* Post content */
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.25 },
          className: "pb-32",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PostAuthor, { userId: post.userId, createdAt: post.createdAt }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square w-full overflow-hidden bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.img,
              {
                src: post.imageUrl,
                alt: post.caption,
                className: "h-full w-full object-cover",
                initial: { scale: 1.03, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                transition: { duration: 0.4 }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 flex items-center gap-5 border-b border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.button,
                {
                  type: "button",
                  "data-ocid": "post.like_button",
                  onClick: handleLike,
                  whileTap: { scale: 0.85 },
                  className: "flex items-center gap-1.5 transition-smooth",
                  "aria-label": liked ? "Unlike" : "Like",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Heart,
                      {
                        size: 24,
                        className: liked ? "fill-primary stroke-primary" : "stroke-foreground"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `text-sm font-medium ${liked ? "text-primary" : "text-foreground"}`,
                        children: displayedLikesCount
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.button,
                {
                  type: "button",
                  "data-ocid": "post.comment_button",
                  onClick: scrollToComments,
                  whileTap: { scale: 0.85 },
                  className: "flex items-center gap-1.5",
                  "aria-label": "Comment",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 24, className: "stroke-foreground" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: Number(post.commentsCount) + optimisticComments.length })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.button,
                {
                  type: "button",
                  "data-ocid": "post.save_button",
                  onClick: handleSave,
                  whileTap: { scale: 0.85 },
                  "aria-label": saved ? "Unsave" : "Save",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Bookmark,
                    {
                      size: 24,
                      className: saved ? "fill-primary stroke-primary" : "stroke-foreground"
                    }
                  )
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed break-words", children: post.caption }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-4 pb-2 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider", children: [
                "Comments",
                allComments.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1.5", children: [
                  "(",
                  allComments.length,
                  ")"
                ] })
              ] }),
              commentsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  "data-ocid": "post.comments.loading_state",
                  className: "space-y-3",
                  children: ["c1", "c2", "c3"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 items-start", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-7 rounded-full shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24 rounded" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full rounded" })
                    ] })
                  ] }, k))
                }
              ) : allComments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  "data-ocid": "post.comments.empty_state",
                  className: "text-sm text-muted-foreground py-6 text-center",
                  children: "No comments yet. Be the first to share your thoughts!"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: allComments.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -6 },
                  transition: { duration: 0.2, delay: i < 5 ? i * 0.04 : 0 },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CommentItem,
                    {
                      comment: c,
                      index: i + 1,
                      isOptimistic: c.commentId.startsWith("opt-")
                    }
                  )
                },
                c.commentId
              )) })
            ] })
          ]
        }
      )
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-16 left-0 right-0 max-w-lg mx-auto bg-card/95 backdrop-blur-md border-t border-border px-4 py-3 z-30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddComment, className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { alt: "Me", size: "xs" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: commentInputRef,
          type: "text",
          placeholder: isAuthenticated ? "Add a comment…" : "Sign in to comment",
          value: comment,
          onChange: (e) => setComment(e.target.value),
          "data-ocid": "post.comment_input",
          disabled: !isAuthenticated || addComment.isPending,
          className: "flex-1 min-w-0 h-10 px-4 rounded-full bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth disabled:opacity-50"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.button,
        {
          type: "submit",
          "data-ocid": "post.submit_comment_button",
          disabled: !comment.trim() || addComment.isPending || !isAuthenticated,
          whileTap: { scale: 0.9 },
          className: "h-10 w-10 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 transition-smooth hover:opacity-90",
          "aria-label": "Post comment",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 15 })
        }
      )
    ] }) })
  ] });
}
export {
  PostDetailPage as default
};
