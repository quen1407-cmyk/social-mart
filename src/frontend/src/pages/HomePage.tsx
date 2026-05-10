import type { PostPublic } from "@/backend";
import { PostCard } from "@/components/feed/PostCard";
import { Layout } from "@/components/layout/Layout";
import { Avatar } from "@/components/shared/Avatar";
import { PostCardSkeleton } from "@/components/shared/SpinnerOverlay";
import { useAuth } from "@/hooks/use-auth";
import { useGetFeed } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import { Bell, ChevronDown, Moon, Package, Sun, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { toast } from "sonner";

// ─── Static sample posts shown when backend feed is empty ───────────────────
type SamplePost = {
  id: string;
  username: string;
  seed: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  createdAt: bigint;
};

const SAMPLE_POSTS: SamplePost[] = [
  {
    id: "s1",
    username: "aurora_styles",
    seed: "aurora",
    image: "/assets/generated/hero-feed-1.dim_800x800.jpg",
    caption:
      "New collection just dropped ✨ Minimal premium fashion for everyday moments.",
    likes: 2847,
    comments: 134,
    createdAt: BigInt(Date.now() - 2 * 3_600_000) * 1_000_000n,
  },
  {
    id: "s2",
    username: "tech_by_kai",
    seed: "kai",
    image: "/assets/generated/hero-feed-2.dim_800x800.jpg",
    caption:
      "Unboxed the most satisfying workspace setup 🖥️ Everything linked in marketplace.",
    likes: 5102,
    comments: 287,
    createdAt: BigInt(Date.now() - 4 * 3_600_000) * 1_000_000n,
  },
  {
    id: "s3",
    username: "mia.creates",
    seed: "mia",
    image: "/assets/generated/hero-feed-3.dim_800x800.jpg",
    caption:
      "Handmade ceramic mugs 🍵 Each one unique, made with love. Shop now!",
    likes: 1920,
    comments: 98,
    createdAt: BigInt(Date.now() - 6 * 3_600_000) * 1_000_000n,
  },
];

const STORY_USERS = ["Aurora", "Kai", "Mia", "Dev", "Zoe", "Leo", "Sam", "Ana"];

export default function HomePage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // Auth guard: redirect unauthenticated users to login
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: "/auth/login" });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const { data: feedPage, isLoading, isFetching } = useGetFeed(0n, 10n);

  const hasPosts = (feedPage?.posts?.length ?? 0) > 0;
  const hasMore = feedPage?.nextOffset != null;

  return (
    <Layout>
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={20} className="text-primary" strokeWidth={2.5} />
          <span className="text-lg font-display font-bold text-foreground tracking-tight">
            Social Mart
          </span>
        </div>
        <div className="flex items-center gap-1">
          {/* Theme toggle */}
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-muted transition-smooth"
            aria-label="Toggle theme"
            data-ocid="home.theme_toggle"
          >
            {theme === "dark" ? (
              <Sun size={20} strokeWidth={1.75} className="text-foreground" />
            ) : (
              <Moon size={20} strokeWidth={1.75} className="text-foreground" />
            )}
          </button>
          <button
            type="button"
            data-ocid="home.marketplace_button"
            onClick={() => navigate({ to: "/marketplace" })}
            className="p-2 rounded-full hover:bg-muted transition-smooth"
            aria-label="Marketplace"
          >
            <Package size={22} strokeWidth={1.75} className="text-foreground" />
          </button>
          <button
            type="button"
            data-ocid="home.notifications_button"
            onClick={() => toast.info("Notifikasi segera hadir!")}
            className="relative p-2 rounded-full hover:bg-muted transition-smooth"
            aria-label="Notifications"
          >
            <Bell size={22} strokeWidth={1.75} className="text-foreground" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
          </button>
        </div>
      </header>

      {/* Stories strip */}
      <div className="flex gap-3 px-4 py-3 overflow-x-auto no-scrollbar border-b border-border/40">
        {!isAuthenticated && (
          <button
            type="button"
            data-ocid="home.login_cta"
            onClick={() => navigate({ to: "/auth/login" })}
            className="flex flex-col items-center gap-1.5 shrink-0"
          >
            <div className="h-14 w-14 rounded-full border-2 border-dashed border-primary/50 flex items-center justify-center bg-primary/5">
              <span className="text-2xl text-primary font-light">+</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Sign in</span>
          </button>
        )}
        {STORY_USERS.map((name) => (
          <div
            key={name}
            className="flex flex-col items-center gap-1.5 shrink-0"
          >
            <Avatar
              alt={name}
              size="lg"
              withRing
              src={`https://api.dicebear.com/9.x/notionists/svg?seed=${name}`}
            />
            <span className="text-[10px] text-muted-foreground truncate max-w-[52px] text-center">
              {name}
            </span>
          </div>
        ))}
      </div>

      {/* Feed */}
      <div className="pb-6">
        {isLoading ? (
          <div className="flex flex-col">
            {["sk-a", "sk-b", "sk-c"].map((k) => (
              <div key={k} className="mx-4 my-2">
                <PostCardSkeleton />
              </div>
            ))}
          </div>
        ) : hasPosts ? (
          <>
            <AnimatePresence initial={false}>
              {feedPage!.posts.map((post, i) => (
                <PostCard key={post.postId} post={post} index={i} />
              ))}
            </AnimatePresence>

            {/* Load more */}
            {hasMore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mt-4 mb-2"
              >
                <p
                  className="text-center text-xs text-muted-foreground py-4"
                  data-ocid="feed.load_more_button"
                >
                  {isFetching ? "Loading more posts…" : "Scroll for more"}
                </p>
              </motion.div>
            )}

            {!hasMore && feedPage!.posts.length > 0 && (
              <p
                className="text-center text-xs text-muted-foreground py-6"
                data-ocid="feed.end_state"
              >
                You’re all caught up ✨
              </p>
            )}
          </>
        ) : (
          <SampleFeed />
        )}
      </div>
    </Layout>
  );
}

// ─── Sample feed (when no backend posts yet) ─────────────────────────────────
function SampleFeed() {
  return (
    <div className="flex flex-col" data-ocid="feed.sample_list">
      {SAMPLE_POSTS.map((p, i) => (
        <SamplePostCard key={p.id} post={p} index={i} />
      ))}
      <p
        className="text-center text-xs text-muted-foreground py-6"
        data-ocid="feed.empty_state"
      >
        Be the first to share something! 🚀
      </p>
    </div>
  );
}

function sampleToPostPublic(p: SamplePost): PostPublic {
  return {
    postId: p.id,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userId: { toString: () => p.seed } as PostPublic["userId"],
    imageUrl: p.image,
    caption: p.caption,
    likesCount: BigInt(p.likes),
    commentsCount: BigInt(p.comments),
    createdAt: p.createdAt,
  };
}

function SamplePostCard({ post, index }: { post: SamplePost; index: number }) {
  return (
    <PostCard
      index={index}
      username={post.username}
      avatarUrl={`https://api.dicebear.com/9.x/notionists/svg?seed=${post.seed}`}
      post={sampleToPostPublic(post)}
    />
  );
}

// Remove unused icon
void ChevronDown;
