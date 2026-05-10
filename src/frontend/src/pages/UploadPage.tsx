import { Layout } from "@/components/layout/Layout";
import { Avatar } from "@/components/shared/Avatar";
import { cn } from "@/lib/utils";
import {
  Camera,
  Film,
  Image,
  MapPin,
  Search,
  ShoppingBag,
  Tag,
  Video,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const SAMPLE_USERS = [
  { username: "aurora_styles", seed: "aurora" },
  { username: "tech_by_kai", seed: "kai" },
  { username: "mia.creates", seed: "mia" },
  { username: "glowlab.id", seed: "glow" },
  { username: "zenbrews", seed: "zen" },
  { username: "homecraft.co", seed: "lamp" },
];

type MediaType = "photo" | "video" | null;

export default function UploadPage() {
  const [mediaType, setMediaType] = useState<MediaType>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [tagSearch, setTagSearch] = useState("");
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);
  const [showTagPanel, setShowTagPanel] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState<"select" | "edit">("select");
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const filteredUsers = SAMPLE_USERS.filter(
    (u) => u.username.includes(tagSearch) && !taggedUsers.includes(u.username)
  );

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setStep("edit");
  }

  function tagUser(username: string) {
    setTaggedUsers((prev) => [...prev, username]);
    setTagSearch("");
  }

  function removeTag(username: string) {
    setTaggedUsers((prev) => prev.filter((u) => u !== username));
  }

  function reset() {
    setStep("select");
    setPreview(null);
    setCaption("");
    setLocation("");
    setTaggedUsers([]);
    setMediaType(null);
    setShowTagPanel(false);
  }

  async function handleUpload() {
    if (!preview) return;
    setIsUploading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsUploading(false);
    toast.success("Postingan berhasil diunggah! 🎉");
    reset();
  }

  if (step === "select") {
    return (
      <Layout>
        <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3">
          <h1 className="text-base font-display font-bold text-foreground">Unggah</h1>
        </header>

        <div className="px-4 py-6 space-y-4">
          <p className="text-sm text-muted-foreground text-center">Pilih jenis konten yang ingin diunggah</p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { setMediaType("photo"); photoRef.current?.click(); }}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-card border-2 border-border hover:border-primary/50 transition-smooth"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Image size={28} className="text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-foreground">Foto</p>
                <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG, WEBP</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => { setMediaType("video"); videoRef.current?.click(); }}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-card border-2 border-border hover:border-secondary/50 transition-smooth"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <Video size={28} className="text-secondary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-foreground">Video</p>
                <p className="text-xs text-muted-foreground mt-0.5">MP4, MOV</p>
              </div>
            </button>
          </div>

          <button
            type="button"
            onClick={() => { setMediaType("photo"); photoRef.current?.click(); }}
            className="flex items-center gap-3 w-full p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-smooth"
          >
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              <Camera size={22} className="text-muted-foreground" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-foreground">Buka Kamera</p>
              <p className="text-xs text-muted-foreground">Ambil foto atau video langsung</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => { setMediaType("video"); videoRef.current?.click(); }}
            className="flex items-center gap-3 w-full p-4 rounded-2xl bg-card border border-border hover:border-secondary/40 transition-smooth"
          >
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              <Film size={22} className="text-muted-foreground" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-foreground">Unggah Reels</p>
              <p className="text-xs text-muted-foreground">Video pendek seperti TikTok</p>
            </div>
          </button>

          <input ref={photoRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          <input ref={videoRef} type="file" accept="video/*" onChange={handleFile} className="hidden" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
        <button type="button" onClick={reset} className="p-1">
          <X size={20} className="text-foreground" />
        </button>
        <h1 className="text-base font-display font-bold text-foreground flex-1">
          {mediaType === "photo" ? "Postingan Baru" : "Unggah Reels"}
        </h1>
        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading}
          className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-bold disabled:opacity-60"
        >
          {isUploading ? "Mengunggah..." : "Bagikan"}
        </button>
      </header>

      <div className="flex flex-col gap-4 p-4 pb-8">
        {/* Preview */}
        {preview && (
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-square">
            {mediaType === "video" ? (
              <video src={preview} className="w-full h-full object-cover" controls />
            ) : (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            )}
            {taggedUsers.length > 0 && (
              <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                {taggedUsers.map((u) => (
                  <span key={u} className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                    @{u}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Caption */}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Tulis caption... gunakan #hashtag"
          rows={3}
          className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
        />

        {/* Location */}
        <div className="relative">
          <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Tambah lokasi..."
            className="w-full bg-muted border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Tag people */}
        <button
          type="button"
          onClick={() => setShowTagPanel(!showTagPanel)}
          className="flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm font-semibold text-foreground"
        >
          <Tag size={16} className="text-primary" />
          Tag Orang
          {taggedUsers.length > 0 && (
            <span className="ml-auto text-xs text-primary font-semibold">{taggedUsers.length} ditag</span>
          )}
        </button>

        <AnimatePresence>
          {showTagPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-muted/50 border border-border rounded-xl p-3 space-y-2">
                {taggedUsers.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {taggedUsers.map((u) => (
                      <span key={u} className="flex items-center gap-1 bg-primary/10 border border-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                        @{u}
                        <button type="button" onClick={() => removeTag(u)}><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    placeholder="Cari pengguna..."
                    className="w-full bg-card border border-border rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none"
                  />
                </div>
                {filteredUsers.slice(0, 5).map((u) => (
                  <button
                    key={u.username}
                    type="button"
                    onClick={() => tagUser(u.username)}
                    className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-muted transition-smooth"
                  >
                    <Avatar src={`https://api.dicebear.com/9.x/notionists/svg?seed=${u.seed}`} alt={u.username} size="sm" />
                    <span className="text-sm font-medium text-foreground">{u.username}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Jual produk */}
        <button
          type="button"
          className="flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm font-semibold text-foreground"
        >
          <ShoppingBag size={16} className="text-secondary" />
          Tandai Produk
          <span className="ml-auto text-xs text-muted-foreground">Opsional</span>
        </button>
      </div>
    </Layout>
  );
}
