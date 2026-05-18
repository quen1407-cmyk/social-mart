import { Layout } from "@/components/layout/Layout";
import { Avatar } from "@/components/shared/Avatar";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { Bell, Heart, MessageCircle, Moon, Plus, Search, Send, Sun, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SAMPLE_STORIES = [
  { username: "aurora_styles", seed: "aurora", viewed: false },
  { username: "tech_by_kai", seed: "kai", viewed: false },
  { username: "mia.creates", seed: "mia", viewed: true },
  { username: "glowlab.id", seed: "glow", viewed: false },
];

const FALLBACK_POSTS = [
  { id: "f1", username: "aurora_styles", seed: "aurora", imgSeed: "post1", imgBg: "b6e3f4", caption: "New collection! ✨ #OOTD #fashion", likes: 2847, comments: 134, time: "2j", image_url: "", user_id: "" },
  { id: "f2", username: "tech_by_kai", seed: "kai", imgSeed: "post2", imgBg: "c0aede", caption: "Setup tour 🖥️ #techsetup", likes: 5102, comments: 287, time: "4j", image_url: "", user_id: "" },
  { id: "f3", username: "glowlab.id", seed: "glow", imgSeed: "post3", imgBg: "d1f4cc", caption: "Glass skin routine 🧴 #skincare", likes: 4410, comments: 320, time: "6j", image_url: "", user_id: "" },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}j`;
  return `${Math.floor(hours / 24)}h`;
}

function PostCard({ post, currentUserId, currentUsername, onDelete }: {
  post: any; currentUserId: string | null; currentUsername: string; onDelete?: (id: string) => void;
}) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const isOwner = currentUserId && post.user_id === currentUserId;

  async function loadComments() {
    if (post.id.startsWith("f")) return;
    const { data } = await supabase.from("comments").select("*").eq("post_id", post.id).order("created_at");
    if (data) setComments(data);
  }

  async function handleLike() {
    const newLikes = liked ? likes - 1 : likes + 1;
    setLiked(!liked);
    setLikes(newLikes);
    if (!post.id.startsWith("f")) {
      await supabase.from("posts").update({ likes: newLikes }).eq("id", post.id);
    }
  }

  async function submitComment() {
    if (!newComment.trim()) return;
    const comment = { post_id: post.id, user_id: currentUserId, username: currentUsername, content: newComment };
    setComments(prev => [...prev, { ...comment, id: Date.now().toString(), created_at: new Date().toISOString() }]);
    setNewComment("");
    if (!post.id.startsWith("f")) {
      await supabase.from("comments").insert(comment);
    }
  }

  async function handleDelete() {
    if (!isOwner) return;
    const { error } = await supabase.from("posts").delete().eq("id", post.id);
    if (!error) {
      toast.success("Postingan dihapus!");
      onDelete?.(post.id);
    }
    setShowMenu(false);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <button type="button" onClick={() => navigate({ to: "/profile/$uid", params: { uid: post.user_id || post.seed } })}>
          <Avatar src={`https://api.dicebear.com/9.x/notionists/svg?seed=${post.seed || post.username}`} alt={post.username} size="sm" withRing />
        </button>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{post.username}</p>
          <p className="text-[11px] text-muted-foreground">{post.time || (post.created_at ? timeAgo(post.created_at) : "2j")} yang lalu</p>
        </div>
        {isOwner ? (
          <div className="relative">
            <button type="button" onClick={() => setShowMenu(!showMenu)} className="text-xs text-muted-foreground px-2 py-1 rounded-full hover:bg-muted">•••</button>
            {showMenu && (
              <div className="absolute right-0 top-8 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden">
                <button type="button" onClick={handleDelete} className="block w-full px-4 py-2.5 text-xs text-destructive font-semibold hover:bg-muted text-left">Hapus Postingan</button>
              </div>
            )}
          </div>
        ) : (
          <button type="button" className="text-xs text-primary font-semibold border border-primary/30 px-3 py-1 rounded-full">Ikuti</button>
        )}
      </div>

      <div className="aspect-square bg-muted">
        {post.image_url ? (
          <img src={post.image_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <img src={`https://api.dicebear.com/9.x/shapes/svg?seed=${post.imgSeed || post.id}&backgroundColor=${post.imgBg || "b6e3f4"}`} alt="" className="w-full h-full object-cover" />
        )}
      </div>

      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center gap-4">
          <button type="button" onClick={handleLike} className="flex items-center gap-1.5">
            <motion.div whileTap={{ scale: 1.3 }}>
              <Heart size={22} className={cn("transition-all", liked ? "fill-red-500 stroke-red-500" : "stroke-foreground fill-transparent")} />
            </motion.div>
            <span className="text-sm font-medium text-foreground">{likes.toLocaleString()}</span>
          </button>
          <button type="button" onClick={() => { setShowComments(!showComments); if (!showComments) loadComments(); }} className="flex items-center gap-1.5">
            <MessageCircle size={22} className="stroke-foreground fill-transparent" />
            <span className="text-sm font-medium text-foreground">{comments.length || post.comments || 0}</span>
          </button>
          <button type="button" className="ml-auto"><Send size={20} className="stroke-foreground fill-transparent" /></button>
        </div>

        <p className="text-sm text-foreground">
          <span className="font-semibold">{post.username}</span>{" "}
          <span className="text-muted-foreground">{post.caption}</span>
        </p>

        <AnimatePresence>
          {showComments && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2 border-t border-border pt-2">
              {comments.length === 0 && <p className="text-xs text-muted-foreground">Belum ada komentar</p>}
              {comments.map(c => (
                <div key={c.id} className="flex items-start gap-2">
                  <Avatar src={`https://api.dicebear.com/9.x/notionists/svg?seed=${c.username}`} alt={c.username} size="sm" />
                  <div className="flex-1 bg-muted rounded-xl px-3 py-2">
                    <p className="text-xs font-semibold text-foreground">{c.username}</p>
                    <p className="text-xs text-muted-foreground">{c.content}</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-2">
                <input value={newComment} onChange={e => setNewComment(e.target.value)} onKeyDown={e => e.key === "Enter" && submitComment()} placeholder="Tulis komentar..." className="flex-1 bg-muted border border-border rounded-full px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40" />
                <button type="button" onClick={submitComment} className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">Kirim</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, isLoading, username, userId } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/auth/login" });
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    if (isAuthenticated) loadPosts();
  }, [isAuthenticated]);

  async function loadPosts() {
    const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(20);
    if (data && data.length > 0) {
      setPosts(data.map(p => ({ ...p, seed: p.username?.split("_")[0] || "user" })));
    } else {
      setPosts(FALLBACK_POSTS);
    }
    setLoadingPosts(false);
  }

  function handleDeletePost(id: string) {
    setPosts(prev => prev.filter(p => p.id !== id));
  }

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <Layout>
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
        <button type="button" onClick={() => navigate({ to: "/search" })} className="flex items-center gap-2 w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:border-primary/40 transition-smooth">
          <Search size={15} className="shrink-0" />
          <span>Cari akun, produk, hashtag...</span>
        </button>
      </header>

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
          {SAMPLE_STORIES.map(s => (
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
        {loadingPosts ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 rounded-full bg-muted" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 bg-muted rounded w-24" />
                  <div className="h-2 bg-muted rounded w-16" />
                </div>
              </div>
              <div className="aspect-square bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-muted rounded w-32" />
              </div>
            </div>
          ))
        ) : (
          posts.map(post => (
            <PostCard key={post.id} post={post} currentUserId={userId} currentUsername={username} onDelete={handleDeletePost} />
          ))
        )}
      </div>
    </Layout>
  );
}
