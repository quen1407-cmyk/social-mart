import { Layout } from "@/components/layout/Layout";
import { Avatar } from "@/components/shared/Avatar";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AtSign, BookMarked, Camera, CheckCircle,
  Grid3x3, Heart, MessageCircle, Plus,
  Settings, Share2, ShoppingBag, Trash2,
  UserCheck, UserPlus, X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const HIGHLIGHTS = [
  { id: "h1", title: "Fashion", emoji: "👗", color: "b6e3f4" },
  { id: "h2", title: "Travel", emoji: "✈️", color: "c0aede" },
  { id: "h3", title: "Food", emoji: "🍜", color: "ffd5dc" },
];

const SAMPLE_USERS = [
  { username: "aurora_styles", seed: "aurora" },
  { username: "tech_by_kai", seed: "kai" },
  { username: "mia.creates", seed: "mia" },
  { username: "glowlab.id", seed: "glow" },
  { username: "zenbrews", seed: "zen" },
];

const EMOJIS = ["⭐", "❤️", "🔥", "✨", "🎯", "🏆", "💫", "🎨", "🎵", "🌟"];

type Tab = "posts" | "products" | "saved";

export default function ProfilePage() {
  const { uid } = useParams({ strict: false }) as { uid: string };
  const navigate = useNavigate();
  const { user, username: currentUsername, userId } = useAuth();

  const isSelf = uid === "me" || uid === userId;

  const [tab, setTab] = useState<Tab>("posts");
  const [editOpen, setEditOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followCount, setFollowCount] = useState(0);
  const [username, setUsername] = useState(currentUsername || "Joy");
  const [bio, setBio] = useState("✨ Halo! Saya suka fashion & teknologi");
  const [editUsername, setEditUsername] = useState(username);
  const [editBio, setEditBio] = useState(bio);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [highlights, setHighlights] = useState(HIGHLIGHTS);
  const [addHighlightOpen, setAddHighlightOpen] = useState(false);
  const [newHighlightTitle, setNewHighlightTitle] = useState("");
  const [newHighlightEmoji, setNewHighlightEmoji] = useState("⭐");
  const avatarRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    loadProfile();
    loadPosts();
  }, [uid, userId]);

  async function loadProfile() {
    const targetId = isSelf ? userId : uid;
    if (!targetId) return;

    const { data } = await supabase.from("profiles").select("*").eq("id", targetId).single();
    if (data) {
      setUsername(data.username || currentUsername);
      setBio(data.bio || "✨ Halo! Saya suka fashion & teknologi");
      setAvatarUrl(data.avatar_url || "");
    }
  }

  async function loadPosts() {
    const targetId = isSelf ? userId : uid;
    if (!targetId) {
      setLoadingPosts(false);
      return;
    }
    const { data } = await supabase.from("posts").select("*").eq("user_id", targetId).order("created_at", { ascending: false });
    if (data) setPosts(data);
    setLoadingPosts(false);
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setUploadingAvatar(true);

    const ext = file.name.split(".").pop();
    const path = `avatars/${userId}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file, { upsert: true });

    if (!error) {
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      const newUrl = data.publicUrl;
      setAvatarUrl(newUrl);
      await supabase.from("profiles").upsert({ id: userId, avatar_url: newUrl, username, bio });
      toast.success("Foto profil berhasil diubah! 📸");
    } else {
      toast.error("Gagal upload foto profil");
    }
    setUploadingAvatar(false);
  }

  async function saveProfile() {
    if (!userId) return;
    await supabase.from("profiles").upsert({ id: userId, username: editUsername, bio: editBio, avatar_url: avatarUrl });
    setUsername(editUsername);
    setBio(editBio);
    setEditOpen(false);
    toast.success("Profil berhasil diperbarui!");
  }

  async function handleDeletePost(postId: string) {
    const { error } = await supabase.from("posts").delete().eq("id", postId).eq("user_id", userId);
    if (!error) {
      setPosts(prev => prev.filter(p => p.id !== postId));
      toast.success("Postingan dihapus!");
    }
  }

  async function handleFollow() {
    setFollowing(!following);
    setFollowCount(following ? followCount - 1 : followCount + 1);
    toast(following ? "Berhenti mengikuti" : "Mulai mengikuti! 👋");
  }

  function addHighlight() {
    if (!newHighlightTitle.trim()) return;
    setHighlights(prev => [...prev, {
      id: `h${Date.now()}`,
      title: newHighlightTitle,
      emoji: newHighlightEmoji,
      color: ["b6e3f4", "ffd5dc", "c0aede", "d1f4cc", "ffecc8"][Math.floor(Math.random() * 5)],
    }]);
    setNewHighlightTitle("");
    setAddHighlightOpen(false);
    toast.success("Sorotan ditambahkan!");
  }

  function renderBio(text: string) {
    return text.split(/(@[\w.]+)/g).map((part, i) =>
      part.startsWith("@") ? <span key={i} className="text-primary font-semibold">{part}</span> : <span key={i}>{part}</span>
    );
  }

  const avatarSrc = avatarUrl || `https://api.dicebear.com/9.x/notionists/svg?seed=${isSelf ? userId : uid}`;

  return (
    <Layout>
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <span className="text-base font-display font-bold text-foreground">{isSelf ? username : "Profil"}</span>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => toast("Link profil disalin!")} className="p-2 rounded-full hover:bg-muted transition-smooth">
            <Share2 size={18} className="text-foreground" />
          </button>
          {isSelf && (
            <button type="button" onClick={() => navigate({ to: "/settings" })} className="p-2 rounded-full hover:bg-muted transition-smooth">
              <Settings size={18} className="text-foreground" />
            </button>
          )}
        </div>
      </header>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="bg-secondary/10 border-b border-secondary/20 px-4 py-1.5 flex items-center justify-center">
          <span className="text-[10px] font-semibold text-secondary">🚧 Dalam Tahap Pengembangan oleh JoyDev</span>
        </div>

        {/* Profile header */}
        <div className="px-5 pt-5 pb-4 bg-card border-b border-border">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              {uploadingAvatar ? (
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <img src={avatarSrc} alt={username} className="w-20 h-20 rounded-full object-cover border-2 border-primary" />
              )}
              {isSelf && (
                <>
                  <button type="button" onClick={() => avatarRef.current?.click()} className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary border-2 border-card flex items-center justify-center">
                    <Camera size={12} className="text-primary-foreground" />
                  </button>
                  <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-display font-bold text-foreground">{username}</h2>
                <CheckCircle size={16} className="text-primary shrink-0" />
              </div>
              <p className="text-sm text-muted-foreground mt-0.5 leading-snug">{renderBio(bio)}</p>
              <div className="flex gap-5 mt-3">
                {[
                  { label: "Postingan", value: posts.length },
                  { label: "Pengikut", value: followCount || "1.2K" },
                  { label: "Mengikuti", value: 248 },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <p className="font-display font-bold text-sm text-foreground">{value}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            {isSelf ? (
              <>
                <button type="button" onClick={() => { setEditUsername(username); setEditBio(bio); setEditOpen(true); }} className="flex-1 h-10 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-smooth">
                  Edit Profil
                </button>
                <button type="button" onClick={() => setSellOpen(true)} className="flex-1 h-10 rounded-xl bg-secondary/10 border border-secondary/30 text-secondary text-sm font-semibold flex items-center justify-center gap-1.5">
                  <ShoppingBag size={14} /> Jual Produk
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={handleFollow} className={cn("flex-1 h-10 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-smooth", following ? "border border-border text-foreground" : "bg-primary text-primary-foreground")}>
                  {following ? <><UserCheck size={15} /> Mengikuti</> : <><UserPlus size={15} /> Ikuti</>}
                </button>
                <button type="button" className="flex-1 h-10 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-smooth">Pesan</button>
              </>
            )}
          </div>
        </div>

        {/* Highlights/Sorotan */}
        <div className="bg-card border-b border-border px-4 py-3">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {isSelf && (
              <button type="button" onClick={() => setAddHighlightOpen(true)} className="flex flex-col items-center gap-1.5 shrink-0">
                <div className="w-14 h-14 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
                  <Plus size={18} className="text-muted-foreground" />
                </div>
                <span className="text-[10px] text-muted-foreground">Baru</span>
              </button>
            )}
            {highlights.map(h => (
              <button key={h.id} type="button" className="flex flex-col items-center gap-1.5 shrink-0">
                <div className="w-14 h-14 rounded-full border-2 border-border overflow-hidden flex items-center justify-center text-2xl" style={{ background: `#${h.color}` }}>
                  {h.emoji}
                </div>
                <span className="text-[10px] text-foreground truncate w-14 text-center">{h.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-card border-b border-border">
          {([
            ["posts", Grid3x3, "Postingan"],
            ["products", ShoppingBag, "Produk"],
            ...(isSelf ? [["saved", BookMarked, "Disimpan"]] as const : []),
          ] as const).map(([t, Icon, label]) => (
            <button key={t} type="button" onClick={() => setTab(t as Tab)} className={cn("flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-smooth border-b-2", tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground")}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* Posts grid */}
        {tab === "posts" && (
          loadingPosts ? (
            <div className="grid grid-cols-3 gap-0.5 bg-border">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-square bg-muted animate-pulse" />)}
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Grid3x3 size={32} className="text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">{isSelf ? "Belum ada postingan" : "Pengguna ini belum posting"}</p>
              {isSelf && <button type="button" onClick={() => navigate({ to: "/upload" })} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">Buat Postingan</button>}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-0.5 bg-border">
              {posts.map((post, idx) => (
                <motion.div key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.04 }} className="relative aspect-square bg-muted overflow-hidden group cursor-pointer">
                  {post.image_url ? (
                    <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <img src={`https://api.dicebear.com/9.x/shapes/svg?seed=${post.id}&backgroundColor=b6e3f4`} alt="" className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center gap-3">
                    <span className="flex items-center gap-1 text-white text-xs font-bold"><Heart size={13} className="fill-white" /> {post.likes || 0}</span>
                    <span className="flex items-center gap-1 text-white text-xs font-bold"><MessageCircle size={13} className="fill-white" /> 0</span>
                  </div>
                  {isSelf && (
                    <button type="button" onClick={() => handleDeletePost(post.id)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth">
                      <Trash2 size={11} className="text-white" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          )
        )}

        {tab === "products" && (
          <div className="flex flex-col items-center justify-center py-16 gap-4 px-6">
            <ShoppingBag size={32} className="text-muted-foreground/30" />
            <div className="text-center">
              <p className="font-semibold text-foreground">Belum ada produk</p>
              <p className="text-sm text-muted-foreground mt-1">{isSelf ? "Daftar jadi penjual untuk mulai berjualan!" : "Pengguna ini belum punya produk"}</p>
            </div>
            {isSelf && <button type="button" onClick={() => setSellOpen(true)} className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">Daftar Penjual</button>}
          </div>
        )}

        {tab === "saved" && isSelf && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <BookMarked size={32} className="text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Belum ada postingan tersimpan</p>
          </div>
        )}
      </motion.div>

      {/* Edit Profile Sheet */}
      <AnimatePresence>
        {editOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setEditOpen(false)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", bounce: 0.1 }} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card rounded-t-3xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 rounded-full bg-border" /></div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <h2 className="text-base font-display font-bold text-foreground">Edit Profil</h2>
                <button type="button" onClick={() => setEditOpen(false)}><X size={18} className="text-muted-foreground" /></button>
              </div>
              <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto pb-10">
                <div className="flex justify-center">
                  <div className="relative">
                    <img src={avatarUrl || `https://api.dicebear.com/9.x/notionists/svg?seed=${userId}`} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-primary" />
                    <button type="button" onClick={() => avatarRef.current?.click()} className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary border-2 border-card flex items-center justify-center">
                      <Camera size={12} className="text-primary-foreground" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Username</label>
                  <div className="relative mt-1">
                    <AtSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input value={editUsername} onChange={e => setEditUsername(e.target.value)} className="w-full bg-muted border border-border rounded-xl pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Bio</label>
                  <textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={3} maxLength={160} className="mt-1 w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
                  <p className="text-right text-[10px] text-muted-foreground">{editBio.length}/160</p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setEditOpen(false)} className="flex-1 h-11 rounded-xl border border-border text-sm font-semibold">Batal</button>
                  <button type="button" onClick={saveProfile} className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">Simpan</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Highlight Sheet */}
      <AnimatePresence>
        {addHighlightOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setAddHighlightOpen(false)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", bounce: 0.1 }} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card rounded-t-3xl p-5 pb-10" onClick={e => e.stopPropagation()}>
              <div className="flex justify-center mb-4"><div className="w-10 h-1 rounded-full bg-border" /></div>
              <h2 className="text-base font-display font-bold text-foreground mb-4">✨ Tambah Sorotan</h2>
              <div className="space-y-4">
                <input value={newHighlightTitle} onChange={e => setNewHighlightTitle(e.target.value)} placeholder="Nama sorotan..." className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                <div className="flex flex-wrap gap-2">
                  {EMOJIS.map(e => (
                    <button key={e} type="button" onClick={() => setNewHighlightEmoji(e)} className={cn("w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-smooth", newHighlightEmoji === e ? "bg-primary/20 border-2 border-primary" : "bg-muted border border-border")}>
                      {e}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={addHighlight} disabled={!newHighlightTitle.trim()} className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm disabled:opacity-50">
                  Tambah Sorotan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sell Request Sheet */}
      <AnimatePresence>
        {sellOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setSellOpen(false)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", bounce: 0.1 }} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card rounded-t-3xl p-5 pb-10" onClick={e => e.stopPropagation()}>
              <div className="flex justify-center mb-4"><div className="w-10 h-1 rounded-full bg-border" /></div>
              <h2 className="text-base font-display font-bold text-foreground mb-2">Daftar Jadi Penjual</h2>
              <p className="text-xs text-muted-foreground mb-4">Permintaan akan ditinjau oleh JoyDev</p>
              <div className="bg-muted/50 border border-border rounded-xl p-4 mb-4 space-y-2">
                {["Listing produk di Marketplace", "Terima pembayaran dari pembeli", "Kelola pesanan masuk", "Dashboard penjual khusus"].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-primary shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => { setSellOpen(false); navigate({ to: "/seller-apply" }); }} className="w-full py-3.5 rounded-2xl bg-secondary text-secondary-foreground font-bold text-sm">
                Isi Formulir Pendaftaran
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
