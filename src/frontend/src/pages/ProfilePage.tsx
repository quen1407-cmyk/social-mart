import { Layout } from "@/components/layout/Layout";
import { Avatar } from "@/components/shared/Avatar";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AtSign, BookMarked, Camera, CheckCircle,
  Grid3x3, Heart, MessageCircle, Plus,
  Settings, Share2, ShoppingBag, UserCheck, UserPlus, X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const SAMPLE_POSTS = [
  { id: "p1", seed: "post1", bg: "b6e3f4", likes: 234, comments: 12 },
  { id: "p2", seed: "post2", bg: "ffd5dc", likes: 891, comments: 45 },
  { id: "p3", seed: "post3", bg: "c0aede", likes: 156, comments: 8 },
  { id: "p4", seed: "post4", bg: "d1f4cc", likes: 432, comments: 23 },
  { id: "p5", seed: "post5", bg: "ffecc8", likes: 678, comments: 31 },
  { id: "p6", seed: "post6", bg: "b6e3b6", likes: 321, comments: 17 },
];

const SAMPLE_USERS = [
  { username: "aurora_styles", seed: "aurora" },
  { username: "tech_by_kai", seed: "kai" },
  { username: "mia.creates", seed: "mia" },
  { username: "glowlab.id", seed: "glow" },
  { username: "zenbrews", seed: "zen" },
];

// Sorotan/Highlights data
const INITIAL_HIGHLIGHTS = [
  { id: "h1", title: "Fashion", emoji: "👗", color: "b6e3f4" },
  { id: "h2", title: "Travel", emoji: "✈️", color: "c0aede" },
  { id: "h3", title: "Food", emoji: "🍜", color: "ffd5dc" },
];

function TagTextarea({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = SAMPLE_USERS.filter(u => u.username.includes(search));

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const v = e.target.value;
    onChange(v);
    const lastWord = v.split(/\s/).pop() ?? "";
    if (lastWord.startsWith("@") && lastWord.length > 1) {
      setSearch(lastWord.slice(1));
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }

  function pickUser(username: string) {
    const words = value.split(/\s/);
    words[words.length - 1] = `@${username}`;
    onChange(words.join(" ") + " ");
    setShowDropdown(false);
  }

  return (
    <div className="relative">
      <textarea value={value} onChange={handleChange} placeholder={placeholder} rows={3} maxLength={160}
        className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
      <AnimatePresence>
        {showDropdown && filtered.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute z-20 bottom-full mb-1 left-0 right-0 bg-card border border-border rounded-xl overflow-hidden shadow-xl">
            {filtered.slice(0, 4).map(u => (
              <button key={u.username} type="button" onClick={() => pickUser(u.username)} className="flex items-center gap-2 w-full px-3 py-2.5 hover:bg-muted transition-smooth">
                <Avatar src={`https://api.dicebear.com/9.x/notionists/svg?seed=${u.seed}`} alt={u.username} size="sm" />
                <span className="text-sm font-medium">@{u.username}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-right text-[10px] text-muted-foreground mt-1">{value.length}/160</p>
    </div>
  );
}

type Tab = "posts" | "products" | "saved";

export default function ProfilePage() {
  const { uid } = useParams({ strict: false }) as { uid: string };
  const navigate = useNavigate();
  const isSelf = uid === "me";

  const [tab, setTab] = useState<Tab>("posts");
  const [editOpen, setEditOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const [following, setFollowing] = useState(false);
  const [username, setUsername] = useState("Joy");
  const [bio, setBio] = useState("✨ Halo! Saya suka fashion & teknologi");
  const [editUsername, setEditUsername] = useState(username);
  const [editBio, setEditBio] = useState(bio);
  const [highlights, setHighlights] = useState(INITIAL_HIGHLIGHTS);
  const [addHighlightOpen, setAddHighlightOpen] = useState(false);
  const [newHighlightTitle, setNewHighlightTitle] = useState("");
  const [newHighlightEmoji, setNewHighlightEmoji] = useState("⭐");

  function saveProfile() {
    setUsername(editUsername);
    setBio(editBio);
    setEditOpen(false);
    toast.success("Profil berhasil diperbarui!");
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
      part.startsWith("@")
        ? <span key={i} className="text-primary font-semibold cursor-pointer">{part}</span>
        : <span key={i}>{part}</span>
    );
  }

  const EMOJIS = ["⭐", "❤️", "🔥", "✨", "🎯", "🏆", "💫", "🎨", "🎵", "🌟"];

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
        {/* Dev banner */}
        <div className="bg-secondary/10 border-b border-secondary/20 px-4 py-1.5 flex items-center justify-center gap-2">
          <span className="text-[10px] font-semibold text-secondary">🚧 Dalam Tahap Pengembangan oleh JoyDev</span>
        </div>

        {/* Profile header */}
        <div className="px-5 pt-5 pb-4 bg-card border-b border-border">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <Avatar src={`https://api.dicebear.com/9.x/notionists/svg?seed=${uid}`} alt={username} size="xl" withRing />
              {isSelf && (
                <button type="button" onClick={() => setEditOpen(true)} className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary border-2 border-card flex items-center justify-center">
                  <Camera size={12} className="text-primary-foreground" />
                </button>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-display font-bold text-foreground">{isSelf ? username : "aurora_styles"}</h2>
                <CheckCircle size={16} className="text-primary shrink-0" />
              </div>
              <p className="text-sm text-muted-foreground mt-0.5 leading-snug">{renderBio(bio)}</p>
              <div className="flex gap-5 mt-3">
                {[{ label: "Postingan", value: SAMPLE_POSTS.length }, { label: "Pengikut", value: "1.2K" }, { label: "Mengikuti", value: 248 }].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <p className="font-display font-bold text-sm text-foreground">{value}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
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
                <button type="button" onClick={() => { setFollowing(!following); toast(following ? "Berhenti mengikuti" : "Mulai mengikuti!"); }}
                  className={cn("flex-1 h-10 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-smooth", following ? "border border-border text-foreground" : "bg-primary text-primary-foreground")}>
                  {following ? <><UserCheck size={15} /> Mengikuti</> : <><UserPlus size={15} /> Ikuti</>}
                </button>
                <button type="button" className="flex-1 h-10 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-smooth">Pesan</button>
              </>
            )}
          </div>
        </div>

        {/* ✨ SOROTAN / HIGHLIGHTS */}
        <div className="bg-card border-b border-border px-4 py-3">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {/* Add highlight button (only self) */}
            {isSelf && (
              <button type="button" onClick={() => setAddHighlightOpen(true)} className="flex flex-col items-center gap-1.5 shrink-0">
                <div className="w-14 h-14 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
                  <Plus size={18} className="text-muted-foreground" />
                </div>
                <span className="text-[10px] text-muted-foreground">Baru</span>
              </button>
            )}
            {highlights.map((h) => (
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
            <button key={t} type="button" onClick={() => setTab(t as Tab)}
              className={cn("flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-smooth border-b-2", tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground")}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* Posts grid */}
        {tab === "posts" && (
          <div className="grid grid-cols-3 gap-0.5 bg-border">
            {SAMPLE_POSTS.map((post, idx) => (
              <motion.div key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.04 }} className="relative aspect-square bg-muted overflow-hidden group cursor-pointer">
                <img src={`https://api.dicebear.com/9.x/shapes/svg?seed=${post.seed}&backgroundColor=${post.bg}`} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center gap-4">
                  <span className="flex items-center gap-1 text-white text-xs font-bold"><Heart size={13} className="fill-white" /> {post.likes}</span>
                  <span className="flex items-center gap-1 text-white text-xs font-bold"><MessageCircle size={13} className="fill-white" /> {post.comments}</span>
                </div>
              </motion.div>
            ))}
          </div>
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
          <div className="grid grid-cols-3 gap-0.5 bg-border">
            {SAMPLE_POSTS.slice(0, 3).map((post, idx) => (
              <motion.div key={post.id + "-saved"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.04 }} className="relative aspect-square bg-muted overflow-hidden group cursor-pointer">
                <img src={`https://api.dicebear.com/9.x/shapes/svg?seed=${post.seed}s&backgroundColor=${post.bg}`} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center gap-4">
                  <span className="flex items-center gap-1 text-white text-xs font-bold"><Heart size={13} className="fill-white" /> {post.likes}</span>
                  <span className="flex items-center gap-1 text-white text-xs font-bold"><MessageCircle size={13} className="fill-white" /> {post.comments}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Edit Profile Sheet */}
      <AnimatePresence>
        {editOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setEditOpen(false)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", bounce: 0.1 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card rounded-t-3xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 rounded-full bg-border" /></div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <h2 className="text-base font-display font-bold text-foreground">Edit Profil</h2>
                <button type="button" onClick={() => setEditOpen(false)}><X size={18} className="text-muted-foreground" /></button>
              </div>
              <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto pb-10">
                <div className="flex justify-center">
                  <div className="relative">
                    <Avatar src={`https://api.dicebear.com/9.x/notionists/svg?seed=${uid}`} alt={username} size="xl" withRing />
                    <button type="button" className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary border-2 border-card flex items-center justify-center">
                      <Camera size={12} className="text-primary-foreground" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Username</label>
                  <div className="relative mt-1">
                    <AtSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input value={editUsername} onChange={e => setEditUsername(e.target.value)} placeholder="Username" className="w-full bg-muted border border-border rounded-xl pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Bio <span className="text-primary text-[10px]">(ketik @ untuk tag)</span></label>
                  <div className="mt-1"><TagTextarea value={editBio} onChange={setEditBio} placeholder="Tulis bio kamu..." /></div>
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
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", bounce: 0.1 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card rounded-t-3xl p-5 pb-10" onClick={e => e.stopPropagation()}>
              <div className="flex justify-center mb-4"><div className="w-10 h-1 rounded-full bg-border" /></div>
              <h2 className="text-base font-display font-bold text-foreground mb-4 flex items-center gap-2">
                <BookMarked size={18} className="text-primary" /> Tambah Sorotan
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Nama Sorotan</label>
                  <input value={newHighlightTitle} onChange={e => setNewHighlightTitle(e.target.value)} placeholder="contoh: Fashion, Travel..." className="mt-1 w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Pilih Emoji</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {EMOJIS.map(e => (
                      <button key={e} type="button" onClick={() => setNewHighlightEmoji(e)}
                        className={cn("w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-smooth", newHighlightEmoji === e ? "bg-primary/20 border-2 border-primary" : "bg-muted border border-border")}>
                        {e}
                      </button>
                    ))}
                  </div>
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
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", bounce: 0.1 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card rounded-t-3xl p-5 pb-10" onClick={e => e.stopPropagation()}>
              <div className="flex justify-center mb-4"><div className="w-10 h-1 rounded-full bg-border" /></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                  <ShoppingBag size={24} className="text-secondary" />
                </div>
                <div>
                  <h2 className="text-base font-display font-bold text-foreground">Daftar Jadi Penjual</h2>
                  <p className="text-xs text-muted-foreground">Permintaan akan ditinjau oleh JoyDev</p>
                </div>
              </div>
              <div className="bg-muted/50 border border-border rounded-xl p-4 mb-4 space-y-2">
                {["Bisa listing produk di Marketplace", "Terima pembayaran dari pembeli", "Kelola pesanan masuk", "Dashboard penjual khusus"].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-primary shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => { setSellOpen(false); toast("Permintaan dikirim ke JoyDev! 🙏"); }} className="w-full py-3.5 rounded-2xl bg-secondary text-secondary-foreground font-bold text-sm">
                Kirim Permintaan ke JoyDev
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
