import type { PostPublic } from "@/backend";
import { PostCard } from "@/components/feed/PostCard";
import { Layout } from "@/components/layout/Layout";
import { Avatar } from "@/components/shared/Avatar";
import { PostCardSkeleton } from "@/components/shared/SpinnerOverlay";
import { useAuth } from "@/hooks/use-auth";
import { useGetFeed } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import { Bell, Moon, Package, Plus, Sun, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

type SamplePost = {
  id: string;
  username: string;
  seed: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  time: string;
};

const SAMPLE_STORIES = [
  { username: "aurora_styles", seed: "aurora", viewed: false },
  { username: "tech_by_kai", seed: "kai", viewed: false },
  { username: "mia.creates", seed: "mia", viewed: true },
  { username: "glowlab.id", seed: "glow", viewed: false },
  { username: "zenbrews", seed: "zen", viewed: true },
];

const SAMPLE_POSTS: SamplePost[] = [
  {
    id: "sp1",
    username: "aurora_styles",
    seed: "aurora",
    image: "https://api.dicebear.com/9.x/shapes/svg?seed=post1&backgroundColor=b6e3f4",
    caption: "New collection just dropped! ✨ Minimal premium fashion for everyday moments #OOTD #fashion",
    likes: 2847,
    comments: 134,
    time: "2j",
  },
  {
    id: "sp2",
    username: "tech_by_kai",
    seed: "kai",
    image: "https://api.dicebear.com/9.x/shapes/svg?seed=post2&backgroundColor=c0aede",
    caption: "Setup tour 🖥️ Everything linked in marketplace! #techsetup #productivity",
    likes: 5102,
    comments: 287,
    time: "4j",
  },
  {
    id: "sp3",
    username: "glowlab.id",
    seed: "glow",
    image: "https://api.dicebear.com/9.x/shapes/svg?seed=post3&backgroundColor=d1f4cc",
    caption: "Glass skin routine 🧴 30 days challenge results! #skincare #glowup",
    likes: 4410,
    comments: 320,
    time: "6j",
  },
];

function SamplePostCard({ post }: { post: SamplePost }) {
  const [liked, setLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(post.likes);
  const navigate = useNavigate();

  function handleLike() {
    if (liked) {
      setLiked(false);
      setLocalLikes((n) => n - 1);
    } else {
      setLiked(true);
      setLocalLikes((n) => n + 1);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl overflow-hidden"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <button type="button" onClick={() => navigate({ to: "/profile/$uid", params: { uid: post.seed } })}>
          <Avatar src={`https://api.dicebear.com/9.x/notionists/svg?seed=${post.seed}`} alt={post.username} size="sm" withRing />
        </button>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{post.username}</p>
          <p className="text-[11px] text-muted-foreground">{post.time} yang lalu</p>
        </div>
        <button type="button" className="text-xs text-primary font-semibold border border-primary/30 px-3 py-1 rounded-full">
          Ikuti
        </button>
      </div>
      <div className="aspect-square bg-muted">
        <img src={post.image} alt={post.caption} className="w-full h-full object-cover" />
      </div>
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center gap-4">
          <button type="button" onClick={handleLike} className="flex items-center gap-1.5">
            <motion.div whileTap={{ scale: 1.3 }}>
              <svg viewBox="0 0 24 24" className={`w-6 h-6 ${liked ? "fill-red-500 stroke-red-500" : "fill-transparent stroke-foreground"}`} strokeWidth={2}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </motion.div>
            <span className="text-sm font-medium text-foreground">{localLikes.toLocaleString()}</span>
          </button>
          <button type="button" className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-transparent stroke-foreground" strokeWidth={2}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="text-sm font-medium text-foreground">{post.comments}</span>
          </button>
        </div>
        <p className="text-sm text-foreground">
          <span className="font-semibold">{post.username}</span>{" "}
          <span className="text-muted-foreground">{post.caption}</span>
        </p>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: "/auth/login" });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const { data: feedPage, isLoading, isFetching } = useGetFeed(0n, 10n);
  const hasPosts = (feedPage?.posts?.length ?? 0) > 0;

  return (
    <Layout>
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={20} className="text-primary" strokeWidth={2.5} />
          <span className="text-lg font-display font-bold text-foreground tracking-tight">Social Mart</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-muted transition-smooth"
          >
            {theme === "dark" ? <Sun size={20} strokeWidth={1.75} className="text-foreground" /> : <Moon size={20} strokeWidth={1.75} className="text-foreground" />}
          </button>
          <button type="button" onClick={() => navigate({ to: "/marketplace" })} className="p-2 rounded-full hover:bg-muted transition-smooth">
            <Package size={22} strokeWidth={1.75} className="text-foreground" />
          </button>
          <button type="button" onClick={() => navigate({ to: "/notifications" })} className="relative p-2 rounded-full hover:bg-muted transition-smooth">
            <Bell size={22} strokeWidth={1.75} className="text-foreground" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
          </button>
        </div>
      </header>

      {/* Stories */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {/* Add story button */}
          <button
            type="button"
            onClick={() => navigate({ to: "/story" })}
            className="flex flex-col items-center gap-1.5 shrink-0"
          >
            <div className="relative w-14 h-14 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
              <Plus size={20} className="text-muted-foreground" />
            </div>
            <span className="text-[10px] text-muted-foreground">Story</span>
          </button>

          {SAMPLE_STORIES.map((story) => (
            <button
              key={story.username}
              type="button"
              onClick={() => navigate({ to: "/story" })}
              className="flex flex-col items-center gap-1.5 shrink-0"
            >
              <div className={`p-0.5 rounded-full ${story.viewed ? "bg-border" : "bg-gradient-to-tr from-primary to-secondary"}`}>
                <Avatar
                  src={`https://api.dicebear.com/9.x/notionists/svg?seed=${story.seed}`}
                  alt={story.username}
                  size="sm"
                />
              </div>
              <span className="text-[10px] text-muted-foreground truncate w-14 text-center">{story.username.split("_")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="flex flex-col gap-4 px-4 py-4 pb-8">
        <AnimatePresence mode="popLayout">
          {(isLoading || isFetching) && !hasPosts &&
            Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)
          }
          {hasPosts
            ? feedPage?.posts.map((post: PostPublic) => (
                <PostCard key={post.id.toString()} post={post} />
              ))
            : !isLoading && SAMPLE_POSTS.map((post) => (
                <SamplePostCard key={post.id} post={post} />
              ))
          }
        </AnimatePresence>
      </div>
    </Layout>
  );
}
