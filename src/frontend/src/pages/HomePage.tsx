import { Layout } from "@/components/layout/Layout";
import { Avatar } from "@/components/shared/Avatar";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { Bell, Heart, MessageCircle, Moon, Plus, Search, Send, Sun, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useState } from "react";

const STORIES = [
  { username: "aurora_styles", seed: "aurora", viewed: false },
  { username: "tech_by_kai", seed: "kai", viewed: false },
  { username: "mia.creates", seed: "mia", viewed: true },
  { username: "glowlab.id", seed: "glow", viewed: false },
  { username: "zenbrews", seed: "zen", viewed: true },
];

const POSTS = [
  { id: "1", username: "aurora_styles", seed: "aurora", imgSeed: "post1", imgBg: "b6e3f4", caption: "New collection just dropped! ✨ Minimal premium fashion #OOTD #fashion", likes: 2847, comments: 134, time: "2j" },
  { id: "2", username: "tech_by_kai", seed: "kai", imgSeed: "post2", imgBg: "c0aede", caption: "Setup tour 🖥️ Everything linked in marketplace! #techsetup", likes: 5102, comments: 287, time: "4j" },
  { id: "3", username: "glowlab.id", seed: "glow", imgSeed: "post3", imgBg: "d1f4cc", caption: "Glass skin routine 🧴 30 days challenge! #skincare #glowup", likes: 4410, comments: 320, time: "6j" },
  { id: "4", username: "mia.creates", seed: "mia", imgSeed: "post4", imgBg: "ffd5dc", caption: "Handmade with love 🎨 Each piece is unique! #handmade", likes: 1920, comments: 98, time: "8j" },
];

function PostCard({ post }: { post: typeof POSTS[0] }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <button type="button" onClick={() => navigate({ to: "/profile/$uid", params: { uid: post.seed } })}>
          <Avatar src={`https://api.dicebear.com/9.x/notionists/svg?seed=${post.seed}`} alt={post.username} size="sm" withRing />
        </button>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{post.username}</p>
          <p className="text-[11px] text-muted-foreground">{post.time} yang lalu</p>
        </div>
        <button type="button" className="text-xs text-primary font-semibold border border-primary/30 px-3 py-1 rounded-full">Ikuti</button>
      </div>
      <div className="aspect-square bg-muted">
        <img src={`https://api.dicebear.com/9.x/shapes/svg?seed=${post.imgSeed}&backgroundColor=${post.imgBg}`} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => { setLiked(!liked); setLikes(liked ? likes - 1 : likes + 1); }} className="flex items-center gap-1.5">
            <motion.div whileTap={{ scale: 1.3 }}>
              <Heart size={22} className={cn("transition-all", liked ? "fill-red-500 stroke-red-500" : "stroke-foreground fill-transparent")} />
            </motion.div>
            <span className="text-sm font-medium text-foreground">{likes.toLocaleString()}</span>
          </button>
          <button type="button" className="flex items-center gap-1.5">
            <MessageCircle size={22} className="stroke-foreground fill-transparent" />
            <span className="text-sm font-medium text-foreground">{post.comments}</span>
          </button>
          <button type="button" className="ml-auto"><Send size={20} className="stroke-foreground fill-transparent" /></button>
        </div>
        <p className="text-sm text-foreground">
          <span className="font-semibold">{post.username}</span>{" "}
          <span className="text-muted-foreground">{post.caption}</span>
        </p>
        <button type="button" className="text-xs text-muted-foreground">Lihat semua {post.comments} komentar</button>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/search" });
    }
  }

  return (
    <Layout>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 pt-3 pb-2 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-primary" strokeWidth={2.5} />
            <span className="text-lg font-display font-bold text-foreground tracking-tight">Social Mart</span>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-full hover:bg-muted transition-smooth">
              {theme === "dark" ? <Sun size={20} strokeWidth={1.75} className="text-foreground" /> : <Moon size={20} strokeWidth={1.75} className="text-foreground" />}
            </button>
            <button type="button" onClick={() => navigate({ to: "/notifications" })} className="relative p-2 rounded-full hover:bg-muted transition-smooth">
              <Bell size={22} strokeWidth={1.75} className="text-foreground" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
            </button>
          </div>
        </div>
        {/* Search bar di header */}
        <form onSubmit={handleSearch}>
          <button type="button" onClick={() => navigate({ to: "/search" })} className="flex items-center gap-2 w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:border-primary/40 transition-smooth">
            <Search size={15} className="text-muted-foreground shrink-0" />
            <span>Cari akun, produk, hashtag...</span>
          </button>
        </form>
      </header>

      {/* Dev banner */}
      <div className="bg-secondary/10 border-b border-secondary/20 px-4 py-1.5 flex items-center justify-center">
        <span className="text-[10px] font-semibold text-secondary">🚧 Dalam Tahap Pengembangan oleh JoyDev</span>
      </div>

      {/* Stories */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          <button type="button" onClick={() => navigate({ to: "/story" })} className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="w-14 h-14 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
              <Plus size={20} className="text-muted-foreground" />
            </div>
            <span className="text-[10px] text-muted-foreground">Story</span>
          </button>
          {STORIES.map((s) => (
            <button key={s.username} type="button" onClick={() => navigate({ to: "/story" })} className="flex flex-col items-center gap-1.5 shrink-0">
              <div className={cn("p-0.5 rounded-full", s.viewed ? "bg-border" : "bg-gradient-to-tr from-primary to-secondary")}>
                <Avatar src={`https://api.dicebear.com/9.x/notionists/svg?seed=${s.seed}`} alt={s.username} size="sm" />
              </div>
              <span className="text-[10px] text-muted-foreground truncate w-14 text-center">{s.username.split("_")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="flex flex-col gap-4 px-4 py-4 pb-24">
        {POSTS.map((post) => <PostCard key={post.id} post={post} />)}
      </div>
    </Layout>
  );
}
