import { Layout } from "@/components/layout/Layout";
import { Avatar } from "@/components/shared/Avatar";
import { supabase, type Story } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Camera, ChevronRight, Image, Plus, Search, Tag, Video, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const SAMPLE_USERS = [
  { username: "aurora_styles", seed: "aurora" },
  { username: "tech_by_kai", seed: "kai" },
  { username: "mia.creates", seed: "mia" },
  { username: "glowlab.id", seed: "glow" },
  { username: "zenbrews", seed: "zen" },
];

export default function StoryPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [myStory, setMyStory] = useState<Story | null>(null);
  const [step, setStep] = useState<"list" | "create" | "preview">("list");
  const [preview, setPreview] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [tagSearch, setTagSearch] = useState("");
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);
  const [showTagPanel, setShowTagPanel] = useState(false);
  const [viewingStory, setViewingStory] = useState<Story | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const filteredUsers = SAMPLE_USERS.filter(u => u.username.includes(tagSearch) && !taggedUsers.includes(u.username));

  useEffect(() => {
    loadStories();
    const interval = setInterval(loadStories, 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadStories() {
    const { data } = await supabase
      .from("stories")
      .select("*")
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });
    if (data) {
      const mine = data.find(s => s.username === "Joy");
      const others = data.filter(s => s.username !== "Joy");
      if (mine) setMyStory(mine);
      setStories(others);
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewFile(file);
    setPreview(URL.createObjectURL(file));
    setStep("preview");
  }

  async function uploadStory() {
    setUploading(true);
    let media_url = "";

    if (previewFile) {
      const ext = previewFile.name.split(".").pop();
      const path = `stories/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("media").upload(path, previewFile);
      if (!error) {
        const { data } = supabase.storage.from("media").getPublicUrl(path);
        media_url = data.publicUrl;
      }
    }

    const storyData = {
      username: "Joy",
      media_url,
      caption,
      tagged_users: taggedUsers,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    const { data, error } = await supabase.from("stories").insert(storyData).select().single();
    setUploading(false);

    if (!error && data) {
      setMyStory(data);
      toast.success("Story berhasil diunggah! 🎉");
    } else {
      toast.error("Gagal upload story");
    }

    setStep("list");
    setPreview(null);
    setCaption("");
    setTaggedUsers([]);
    loadStories();
  }

  function timeLeft(expiresAt: string) {
    const diff = new Date(expiresAt).getTime() - Date.now();
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    if (hours > 0) return `${hours}j tersisa`;
    return `${mins}m tersisa`;
  }

  if (viewingStory) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <div className="absolute inset-0">
          {viewingStory.media_url ? (
            <img src={viewingStory.media_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-violet-900 via-purple-800 to-indigo-900 flex items-center justify-center">
              <div className="text-8xl">✨</div>
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none" />
        <div className="absolute top-4 left-4 right-4">
          <div className="h-0.5 bg-white/30 rounded-full overflow-hidden">
            <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 5, ease: "linear" }} onAnimationComplete={() => setViewingStory(null)} className="h-full bg-white rounded-full" />
          </div>
        </div>
        <div className="absolute top-8 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar src={`https://api.dicebear.com/9.x/notionists/svg?seed=${viewingStory.username}`} alt={viewingStory.username} size="sm" withRing />
            <span className="text-white font-semibold text-sm drop-shadow">{viewingStory.username}</span>
            <span className="text-white/60 text-xs">{timeLeft(viewingStory.expires_at)}</span>
          </div>
          <button type="button" onClick={() => setViewingStory(null)} className="p-2 rounded-full bg-black/30">
            <X size={20} className="text-white" />
          </button>
        </div>
        {viewingStory.caption && (
          <div className="absolute bottom-20 left-4 right-4">
            <p className="text-white text-sm drop-shadow text-center">{viewingStory.caption}</p>
          </div>
        )}
        {viewingStory.tagged_users?.length > 0 && (
          <div className="absolute bottom-10 left-4 flex flex-wrap gap-1">
            {viewingStory.tagged_users.map(u => (
              <span key={u} className="bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">@{u}</span>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (step === "create" || step === "preview") {
    return (
      <Layout>
        <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
          <button type="button" onClick={() => { setStep("list"); setPreview(null); }} className="p-1">
            <X size={20} className="text-foreground" />
          </button>
          <h1 className="text-base font-display font-bold text-foreground flex-1">Buat Story</h1>
          {step === "preview" && (
            <button type="button" onClick={uploadStory} disabled={uploading} className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-bold disabled:opacity-60">
              {uploading ? "Mengunggah..." : "Bagikan"}
            </button>
          )}
        </header>

        {step === "create" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-6">
            <div className="w-24 h-24 rounded-3xl bg-muted border-2 border-dashed border-border flex items-center justify-center">
              <Camera size={36} className="text-muted-foreground" />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm">
                <Image size={16} /> Galeri
              </button>
              <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-muted border border-border font-semibold text-sm">
                <Video size={16} /> Video
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFile} className="hidden" />
          </div>
        )}

        {step === "preview" && preview && (
          <div className="flex flex-col gap-4 p-4">
            <div className="relative rounded-2xl overflow-hidden aspect-[9/16] bg-black max-h-[50vh]">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              {taggedUsers.length > 0 && (
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                  {taggedUsers.map(u => (
                    <span key={u} className="bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">@{u}</span>
                  ))}
                </div>
              )}
            </div>
            <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="Tambah caption..." rows={2} className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
            <button type="button" onClick={() => setShowTagPanel(!showTagPanel)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted border border-border text-sm font-semibold">
              <Tag size={16} className="text-primary" /> Tag Orang
              {taggedUsers.length > 0 && <span className="ml-auto text-xs text-primary">{taggedUsers.length} ditag</span>}
            </button>
            <AnimatePresence>
              {showTagPanel && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="bg-muted/50 border border-border rounded-xl p-3 space-y-2">
                    {taggedUsers.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {taggedUsers.map(u => (
                          <span key={u} className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                            @{u} <button type="button" onClick={() => setTaggedUsers(p => p.filter(x => x !== u))}><X size={10} /></button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input value={tagSearch} onChange={e => setTagSearch(e.target.value)} placeholder="Cari pengguna..." className="w-full bg-card border border-border rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none" />
                    </div>
                    {filteredUsers.map(u => (
                      <button key={u.username} type="button" onClick={() => { setTaggedUsers(p => [...p, u.username]); setTagSearch(""); }} className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-muted transition-smooth">
                        <Avatar src={`https://api.dicebear.com/9.x/notionists/svg?seed=${u.seed}`} alt={u.username} size="sm" />
                        <span className="text-sm font-medium">{u.username}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3">
        <h1 className="text-base font-display font-bold text-foreground">Story</h1>
      </header>
      <div className="px-4 py-4 space-y-4">
        <div>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Story Kamu</h2>
          {myStory ? (
            <button type="button" onClick={() => setViewingStory(myStory)} className="flex items-center gap-3 w-full p-3 rounded-2xl bg-card border border-primary/30">
              <div className="p-0.5 rounded-full bg-gradient-to-tr from-primary to-secondary">
                {myStory.media_url ? (
                  <img src={myStory.media_url} alt="" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <Avatar src="https://api.dicebear.com/9.x/notionists/svg?seed=me" alt="Joy" size="md" />
                )}
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-semibold text-foreground">Story kamu</p>
                <p className="text-xs text-muted-foreground">{timeLeft(myStory.expires_at)}</p>
              </div>
              <button type="button" onClick={e => { e.stopPropagation(); setStep("create"); }} className="p-2 rounded-full bg-muted">
                <Plus size={16} className="text-foreground" />
              </button>
            </button>
          ) : (
            <button type="button" onClick={() => setStep("create")} className="flex items-center gap-3 w-full p-3 rounded-2xl bg-muted/50 border border-dashed border-border hover:border-primary/40 transition-smooth">
              <div className="w-12 h-12 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
                <Plus size={20} className="text-muted-foreground" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">Buat Story</p>
                <p className="text-xs text-muted-foreground">Akan hilang dalam 24 jam</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground ml-auto" />
            </button>
          )}
        </div>

        {stories.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Story Teman</h2>
            <div className="space-y-2">
              {stories.map((story, i) => (
                <motion.button key={story.id} type="button" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => setViewingStory(story)} className="flex items-center gap-3 w-full p-3 rounded-2xl hover:bg-muted/50 transition-smooth">
                  <div className="p-0.5 rounded-full bg-gradient-to-tr from-primary to-secondary">
                    {story.media_url ? (
                      <img src={story.media_url} alt="" className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <Avatar src={`https://api.dicebear.com/9.x/notionists/svg?seed=${story.username}`} alt={story.username} size="md" />
                    )}
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold text-foreground">{story.username}</p>
                    <p className="text-xs text-muted-foreground">{timeLeft(story.expires_at)}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
