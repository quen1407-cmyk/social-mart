import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, c as cn, a as ue, P as PostCardSkeleton } from "./index-CgYOV5jf.js";
import { A as Avatar } from "./Avatar-DYvFa4y-.js";
import { f as useLikePost, g as useUnlikePost, h as useSavePost, i as useGetFeed } from "./useQueries-B3XIVZSS.js";
import { c as createLucideIcon, m as motion } from "./proxy-BwgDIH52.js";
import { H as Heart, M as MessageCircle, B as Bookmark } from "./message-circle-B6UI5p2X.js";
import { L as Layout } from "./Layout-B60O5qPC.js";
import { u as useAuth } from "./index-BikGRg3B.js";
import { Z as Zap } from "./zap-DpxqxhTP.js";
import { P as Package } from "./package-CAHd52X1.js";
import { A as AnimatePresence } from "./index-C5JKQtdB.js";
import "./user-D4VcQ6pj.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
];
const Bell = createLucideIcon("bell", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "19", cy: "12", r: "1", key: "1wjl8i" }],
  ["circle", { cx: "5", cy: "12", r: "1", key: "1pcz8c" }]
];
const Ellipsis = createLucideIcon("ellipsis", __iconNode);
function formatRelativeTime(ts) {
  const ms = Number(ts / 1000000n);
  const diff = Date.now() - ms;
  if (diff < 6e4) return "just now";
  if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
  if (diff < 6048e5) return `${Math.floor(diff / 864e5)}d ago`;
  return new Date(ms).toLocaleDateString(void 0, {
    month: "short",
    day: "numeric"
  });
}
function PostCard({ post, index, username, avatarUrl }) {
  const navigate = useNavigate();
  const likePost = useLikePost();
  const unlikePost = useUnlikePost();
  const savePost = useSavePost();
  const [liked, setLiked] = reactExports.useState(false);
  const [saved, setSaved] = reactExports.useState(false);
  const [localLikes, setLocalLikes] = reactExports.useState(Number(post.likesCount));
  const [imgError, setImgError] = reactExports.useState(false);
  const uid = post.userId.toString();
  const displayName = username ?? `${uid.slice(0, 8)}…`;
  const avatarSrc = avatarUrl ?? `https://api.dicebear.com/9.x/notionists/svg?seed=${uid.slice(0, 8)}`;
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.article,
    {
      initial: { opacity: 0, y: 14 },
      animate: { opacity: 1, y: 0 },
      transition: {
        delay: index * 0.06,
        duration: 0.32,
        ease: [0.4, 0, 0.2, 1]
      },
      className: "feed-card mx-4 my-2 overflow-hidden",
      "data-ocid": `feed.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 pt-4 pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Avatar,
            {
              src: avatarSrc,
              alt: displayName,
              size: "sm",
              withRing: true,
              onClick: goToProfile,
              "data-ocid": `feed.avatar.${index + 1}`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: goToProfile,
                className: "font-display font-semibold text-sm text-foreground truncate block hover:text-primary transition-colors duration-200",
                "data-ocid": `feed.username.${index + 1}`,
                children: displayName
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: timeLabel })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "p-1.5 rounded-lg hover:bg-muted transition-smooth text-muted-foreground",
              "aria-label": "More options",
              "data-ocid": `feed.more_button.${index + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { size: 18 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            onClick: goToPost,
            "aria-label": "View post",
            "data-ocid": `feed.post_image.${index + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative aspect-square overflow-hidden bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: imgError ? "/assets/images/placeholder.svg" : post.imageUrl,
                alt: post.caption || "Post image",
                className: "h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]",
                loading: "lazy",
                onError: () => setImgError(true)
              }
            ) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-3 pb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handleLike,
              className: cn(
                "flex items-center gap-1.5 transition-smooth group",
                liked ? "text-primary" : "text-foreground"
              ),
              "aria-label": liked ? "Unlike post" : "Like post",
              "aria-pressed": liked,
              "data-ocid": `feed.like_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Heart,
                  {
                    size: 22,
                    strokeWidth: 1.75,
                    className: cn(
                      "transition-all duration-200",
                      liked ? "fill-primary stroke-primary scale-110" : "stroke-foreground group-hover:stroke-primary"
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium tabular-nums", children: localLikes })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: goToPost,
              className: "flex items-center gap-1.5 text-foreground transition-smooth group",
              "aria-label": "View comments",
              "data-ocid": `feed.comment_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  MessageCircle,
                  {
                    size: 22,
                    strokeWidth: 1.75,
                    className: "stroke-foreground group-hover:stroke-primary transition-colors duration-200"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium tabular-nums", children: Number(post.commentsCount) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleSave,
              className: "transition-smooth",
              "aria-label": saved ? "Unsave post" : "Save post",
              "aria-pressed": saved,
              "data-ocid": `feed.save_button.${index + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Bookmark,
                {
                  size: 22,
                  strokeWidth: 1.75,
                  className: cn(
                    "transition-all duration-200",
                    saved ? "fill-primary stroke-primary" : "stroke-foreground hover:stroke-primary"
                  )
                }
              )
            }
          ) })
        ] }) }),
        post.caption && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-4 pt-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground leading-relaxed", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: goToProfile,
                className: "font-semibold font-display mr-1 hover:text-primary transition-colors duration-200",
                children: displayName
              }
            ),
            post.caption
          ] }),
          Number(post.commentsCount) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: goToPost,
              className: "text-xs text-muted-foreground mt-1 hover:text-foreground transition-colors duration-200",
              "data-ocid": `feed.view_comments.${index + 1}`,
              children: [
                "View all ",
                Number(post.commentsCount),
                " comment",
                Number(post.commentsCount) !== 1 ? "s" : ""
              ]
            }
          )
        ] })
      ]
    }
  );
}
const SAMPLE_POSTS = [
  {
    id: "s1",
    username: "aurora_styles",
    seed: "aurora",
    image: "/assets/generated/hero-feed-1.dim_800x800.jpg",
    caption: "New collection just dropped ✨ Minimal premium fashion for everyday moments.",
    likes: 2847,
    comments: 134,
    createdAt: BigInt(Date.now() - 2 * 36e5) * 1000000n
  },
  {
    id: "s2",
    username: "tech_by_kai",
    seed: "kai",
    image: "/assets/generated/hero-feed-2.dim_800x800.jpg",
    caption: "Unboxed the most satisfying workspace setup 🖥️ Everything linked in marketplace.",
    likes: 5102,
    comments: 287,
    createdAt: BigInt(Date.now() - 4 * 36e5) * 1000000n
  },
  {
    id: "s3",
    username: "mia.creates",
    seed: "mia",
    image: "/assets/generated/hero-feed-3.dim_800x800.jpg",
    caption: "Handmade ceramic mugs 🍵 Each one unique, made with love. Shop now!",
    likes: 1920,
    comments: 98,
    createdAt: BigInt(Date.now() - 6 * 36e5) * 1000000n
  }
];
const STORY_USERS = ["Aurora", "Kai", "Mia", "Dev", "Zoe", "Leo", "Sam", "Ana"];
function HomePage() {
  var _a;
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: "/auth/login" });
    }
  }, [isAuthenticated, authLoading, navigate]);
  const { data: feedPage, isLoading, isFetching } = useGetFeed(0n, 10n);
  const hasPosts = (((_a = feedPage == null ? void 0 : feedPage.posts) == null ? void 0 : _a.length) ?? 0) > 0;
  const hasMore = (feedPage == null ? void 0 : feedPage.nextOffset) != null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 20, className: "text-primary", strokeWidth: 2.5 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-display font-bold text-foreground tracking-tight", children: "Social Mart" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": "home.marketplace_button",
            onClick: () => navigate({ to: "/marketplace" }),
            className: "p-2 rounded-full hover:bg-muted transition-smooth",
            "aria-label": "Marketplace",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 22, strokeWidth: 1.75, className: "text-foreground" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "home.notifications_button",
            onClick: () => ue.info("Notifications coming soon"),
            className: "relative p-2 rounded-full hover:bg-muted transition-smooth",
            "aria-label": "Notifications",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 22, strokeWidth: 1.75, className: "text-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 px-4 py-3 overflow-x-auto no-scrollbar border-b border-border/40", children: [
      !isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": "home.login_cta",
          onClick: () => navigate({ to: "/auth/login" }),
          className: "flex flex-col items-center gap-1.5 shrink-0",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-full border-2 border-dashed border-primary/50 flex items-center justify-center bg-primary/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl text-primary font-light", children: "+" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Sign in" })
          ]
        }
      ),
      STORY_USERS.map((name) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center gap-1.5 shrink-0",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Avatar,
              {
                alt: name,
                size: "lg",
                withRing: true,
                src: `https://api.dicebear.com/9.x/notionists/svg?seed=${name}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground truncate max-w-[52px] text-center", children: name })
          ]
        },
        name
      ))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pb-6", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col", children: ["sk-a", "sk-b", "sk-c"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-4 my-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PostCardSkeleton, {}) }, k)) }) : hasPosts ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: feedPage.posts.map((post, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(PostCard, { post, index: i }, post.postId)) }),
      hasMore && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          className: "flex justify-center mt-4 mb-2",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-center text-xs text-muted-foreground py-4",
              "data-ocid": "feed.load_more_button",
              children: isFetching ? "Loading more posts…" : "Scroll for more"
            }
          )
        }
      ),
      !hasMore && feedPage.posts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-center text-xs text-muted-foreground py-6",
          "data-ocid": "feed.end_state",
          children: "You’re all caught up ✨"
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(SampleFeed, {}) })
  ] });
}
function SampleFeed() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", "data-ocid": "feed.sample_list", children: [
    SAMPLE_POSTS.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SamplePostCard, { post: p, index: i }, p.id)),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        className: "text-center text-xs text-muted-foreground py-6",
        "data-ocid": "feed.empty_state",
        children: "Be the first to share something! 🚀"
      }
    )
  ] });
}
function sampleToPostPublic(p) {
  return {
    postId: p.id,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userId: { toString: () => p.seed },
    imageUrl: p.image,
    caption: p.caption,
    likesCount: BigInt(p.likes),
    commentsCount: BigInt(p.comments),
    createdAt: p.createdAt
  };
}
function SamplePostCard({ post, index }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    PostCard,
    {
      index,
      username: post.username,
      avatarUrl: `https://api.dicebear.com/9.x/notionists/svg?seed=${post.seed}`,
      post: sampleToPostPublic(post)
    }
  );
}
export {
  HomePage as default
};
