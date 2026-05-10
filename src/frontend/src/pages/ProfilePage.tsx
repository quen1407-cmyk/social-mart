import { Layout } from "@/components/layout/Layout";
import { Avatar } from "@/components/shared/Avatar";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AtSign,
  Camera,
  Grid3x3,
  Heart,
  MessageCircle,
  Settings,
  Share2,
  ShoppingBag,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const SAMPLE_USERS = [
  { username: "aurora_styles", seed: "aurora" },
  { username: "tech_by_kai", seed: "kai" },
  { username: "mia.creates", seed: "mia" },
  { username: "glowlab.id", seed: "glow" },
  { username: "zenbrews", seed: "zen" },
];

const SAMPLE_POSTS = [
  { id: "p1", image: "https://api.dicebear.com/9.x/shapes/svg?seed=post1&backgroundColor=b6e3f4", likes: 234, comments: 12 },
  { id: "p2", image: "https://api.dicebear.com/9.x/shapes/svg?seed=post2&backgroundColor=ffd5dc", likes: 891, comments: 45 },
  { id: "p3", image: "https://api.dicebear.com/9.x/shapes/svg?seed=post3&backgroundColor=c0aede", likes: 156, comments: 8 },
  { id: "p4", image: "https://api.dicebear.com/9.x/shapes/svg?seed=post4&backgroundColor=d1f4cc", likes: 432, comments: 23 },
  { id: "p5", image: "https://api.dicebear.com/9.x/shapes/svg?seed=post5&backgroundColor=ffecc8", likes: 678, comments: 31 },
  { id: "p6", image: "https://api.dicebear.com/9.x/shapes/svg?seed=post6&backgroundColor=b6e3b6", likes: 321, comments: 17 },
];

function TagInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const tagged = value ? value.match(/@[\w.]+/g) ?? [] : [];
  const filtered = SAMPLE_USERS.filter(u =>
    u.username.includes(input.replace("@", "")) && !tagged.includes(`@${u.username}`)
  );

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const v = e.target.value;
    onChange(v);
    const lastWord = v.split(" ").pop() ?? "";
    if (lastWord.startsWith("@") && lastWord.length > 1) {
      setInput(lastWord);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
      setInput("");
    }
  }

  function pickUser(username: string) {
    const words = value.split(" ");
    words[words.length - 1] = `@${username}`;
    onChange(words.join(" ") + " ");
    setShowDropdown(false);
    setInput("");
  }

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={handleChange}
        placeholder="Tulis bio kamu... ketik @ untuk tag orang"
        rows={3}
        maxLength={160}
        className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
      />
      <AnimatePresence>
        {showDropdown && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute z-10 bottom-full mb-1 left-0 right-0 bg-card border border-border rounded-xl overflow-hidden shadow-lg"
          >
            {filtered.slice(0, 4).map((u) => (
              <button
                key={u.username}
                type="button"
                onClick={() => pickUser(u.username)}
                className="flex items-center gap-2 w-full px-3 py-2.5 hover:bg-muted transition-smooth"
              >
                <Avatar src={`https://api.dicebear.com/9.x/notionists/svg?seed=${u.seed}`} alt={u.username} size="sm" />
                <span className="text-sm font-medium text-foreground">{u.username}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-right text-[10px] text-muted-foreground mt-1">{value.length}/160</p>
    </div>
  );
}

export default function ProfilePage() {
  const { uid } = useParams({ strict: false }) as { uid: string };
  const navigate = useNavigate();
  const isSelf = uid === "me";

  const [tab, setTab] = useState<"posts" | "products">("posts");
  const [editOpen, setEditOpen] = useState(false);
  const [following, setFollowing] = useState(false);
  const [username, setUsername] = useState("Joy");
  const [bio, setBio] = useState("✨ Halo! Saya suka fashion & teknologi");
  const [editUsername, setEditUsername] = useState(username);
  const [editBio, setEditBio] = useState(bio);

  function saveProfile() {
    setUsername(editUsername);
    setBio(editBio);
    setEditOpen(false);
    toast.success("Profil berhasil diperbarui!");
  }

  function renderBioWithTags(text: string) {
    const parts = text.split(/(@[\w.]+)/g);
    return parts.map((part, i) =>
      part.startsWith("@") ? (
        <span key={i} className="text-primary font-semibold">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  }

  return (
    <Layout>
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <span className="text-base font-display font-bold text-foreground">{username}</span>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => toast("Link profil disalin!")} className="p-2 rounded-full hover:bg-muted transition-smooth">
            <Share2 size={18} className="text-foreground" />
          </button>
          {isSelf && (
            <button type="button" onClick={() => toast("Pengaturan segera hadir!")} className="p-2 rounded-full hover:bg-muted transition-smooth">
              <Settings size={18} className="text-foreground" />
            </button>
          )}
        </div>
      </header>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Profile header */}
        <div className="px-5 pt-5 pb-4 bg-card border-b border-border">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <Avatar
                src={`https://api.dicebear.com/9.x/notionists/svg?seed=${uid}`}
                alt={username}
                size="xl"
                withRing
              />
              {isSelf && (
                <button type="button" onClick={() => setEditOpen(true)} className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center border-2 border-card">
                  <Camera size={12} className="text-primary-foreground" />
                </button>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-display font-bold text-foreground">{username}</h2>
              <p className="text-sm text-muted-foreground mt-0.5 leading-snug">
                {renderBioWithTags(bio)}
              </p>
              <div className="flex gap-5 mt-3">
                {[
                  { label: "Postingan", value: 12 },
                  { label: "Pengikut", value: "1.2K" },
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
              <button
                type="button"
                onClick={() => { setEditUsername(username); setEditBio(bio); setEditOpen(true); }}
                className="flex-1 h-10 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-smooth"
              >
                Edit Profil
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => { setFollowing(!following); toast(following ? "Berhenti mengikuti" : "Mengikuti!"); }}
                  className={cn(
                    "flex-1 h-10 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-smooth",
                    following ? "border border-border text-foreground hover:bg-muted" : "bg-primary text-primary-foreground hover:opacity-90"
                  )}
                >
                  {following ? <><UserCheck size={15} /> Mengikuti</> : <><UserPlus size={15} /> Ikuti</>}
                </button>
                <button type="button" className="flex-1 h-10 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-smooth">
                  Pesan
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-card border-b border-border">
          {([["posts", Grid3x3, "Postingan"], ["products", ShoppingBag, "Produk"]] as const).map(([t, Icon, label]) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-smooth border-b-2",
                tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground"
              )}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {/* Posts grid */}
        {tab === "posts" && (
          <div className="grid grid-cols-3 gap-0.5 bg-border">
            {SAMPLE_POSTS.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.04 }}
                className="relative aspect-square bg-muted overflow-hidden group cursor-pointer"
              >
                <img src={post.image} alt={`Post ${idx + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center gap-4">
                  <span className="flex items-center gap-1 text-white text-xs font-bold">
                    <Heart size={14} className="fill-white" /> {post.likes}
                  </span>
                  <span className="flex items-center gap-1 text-white text-xs font-bold">
                    <MessageCircle size={14} className="fill-white" /> {post.comments}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === "products" && (
          <div className="flex flex-col items-center justify-center py-16 gap-4 px-6">
            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
              <ShoppingBag size={28} className="text-muted-foreground/50" />
            </div>
            <div className="text-center">
              <p className="font-display font-semibold text-foreground">Belum ada produk</p>
              <p className="text-sm text-muted-foreground mt-1">
                {isSelf ? "Mulai jual produkmu!" : "Pengguna ini belum punya produk"}
              </p>
            </div>
            {isSelf && (
              <button
                type="button"
                onClick={() => navigate({ to: "/marketplace" })}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
              >
                Jual Produk
              </button>
            )}
          </div>
        )}
      </motion.div>

      {/* Edit Profile Sheet */}
      <AnimatePresence>
        {editOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setEditOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", bounce: 0.1 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card rounded-t-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>
              <div className="px-5 py-3 border-b border-border">
                <h2 className="text-base font-display font-bold text-foreground">Edit Profil</h2>
              </div>
              <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto pb-8">
                <div className="flex justify-center">
                  <div className="relative">
                    <Avatar src={`https://api.dicebear.com/9.x/notionists/svg?seed=${uid}`} alt={username} size="xl" withRing />
                    <button type="button" className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center border-2 border-card">
                      <Camera size={12} className="text-primary-foreground" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Username</label>
                  <div className="relative mt-1">
                    <AtSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      placeholder="Username"
                      className="w-full bg-muted border border-border rounded-xl pl-8 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                    Bio <span className="text-primary text-[10px]">(ketik @ untuk tag orang)</span>
                  </label>
                  <div className="mt-1">
                    <TagInput value={editBio} onChange={setEditBio} />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setEditOpen(false)} className="flex-1 h-11 rounded-xl border border-border text-sm font-semibold text-foreground">
                    Batal
                  </button>
                  <button type="button" onClick={saveProfile} className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">
                    Simpan
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
