import { Layout } from "@/components/layout/Layout";
import { Avatar } from "@/components/shared/Avatar";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell, BookMarked, Camera, CheckCircle,
  ChevronRight, Globe, Grid3x3, Heart,
  HelpCircle, Info, Lock, LogOut, MessageCircle,
  Moon, Palette, Settings, Shield, Sun,
  Trash2, User, Volume2,
} from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "sonner";

const MY_POSTS = [
  { id: "p1", seed: "post1", bg: "b6e3f4", likes: 234, comments: 12 },
  { id: "p2", seed: "post2", bg: "ffd5dc", likes: 891, comments: 45 },
  { id: "p3", seed: "post3", bg: "c0aede", likes: 156, comments: 8 },
  { id: "p4", seed: "post4", bg: "d1f4cc", likes: 432, comments: 23 },
  { id: "p5", seed: "post5", bg: "ffecc8", likes: 678, comments: 31 },
  { id: "p6", seed: "post6", bg: "b6e3b6", likes: 321, comments: 17 },
];

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)} className={cn("w-11 h-6 rounded-full transition-smooth relative shrink-0", value ? "bg-primary" : "bg-muted border border-border")}>
      <motion.div animate={{ x: value ? 20 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className="w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5" />
    </button>
  );
}

function Row({ icon: Icon, label, description, onClick, danger, right }: { icon: typeof Bell; label: string; description?: string; onClick?: () => void; danger?: boolean; right?: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-muted/50 transition-smooth">
      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", danger ? "bg-destructive/10" : "bg-muted")}>
        <Icon size={18} className={danger ? "text-destructive" : "text-foreground"} />
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className={cn("text-sm font-medium", danger ? "text-destructive" : "text-foreground")}>{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {right ?? <ChevronRight size={16} className="text-muted-foreground shrink-0" />}
    </button>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <p className="px-4 pt-5 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{title}</p>;
}

type SettingsTab = "main" | "posts";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SettingsTab>("main");
  const [notifPush, setNotifPush] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);
  const [notifSound, setNotifSound] = useState(true);
  const [privateAcc, setPrivateAcc] = useState(false);

  return (
    <Layout>
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
        <button type="button" onClick={() => navigate({ to: "/profile/me" })} className="p-1">
          <ChevronRight size={20} className="text-foreground rotate-180" />
        </button>
        <h1 className="text-base font-display font-bold text-foreground flex-1">Pengaturan</h1>
      </header>

      {/* Profile preview */}
      <div className="bg-card border-b border-border px-5 py-4 flex items-center gap-4">
        <div className="relative">
          <Avatar src="https://api.dicebear.com/9.x/notionists/svg?seed=me" alt="Joy" size="lg" withRing />
          <button type="button" className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary border-2 border-card flex items-center justify-center">
            <Camera size={10} className="text-primary-foreground" />
          </button>
        </div>
        <div className="flex-1">
          <p className="font-display font-bold text-foreground">Joy</p>
          <p className="text-xs text-muted-foreground">@joy • 12 postingan • 1.2K pengikut</p>
        </div>
        <button type="button" onClick={() => navigate({ to: "/profile/me" })} className="px-3 py-1.5 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted transition-smooth">
          Lihat Profil
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-card border-b border-border">
        {([["main", Settings, "Pengaturan"], ["posts", Grid3x3, "Postingan Saya"]] as const).map(([t, Icon, label]) => (
          <button key={t} type="button" onClick={() => setActiveTab(t)}
            className={cn("flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-smooth border-b-2", activeTab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground")}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {activeTab === "posts" && (
        <div className="pb-24">
          <div className="px-4 py-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Semua Postingan ({MY_POSTS.length})</p>
            <button type="button" onClick={() => navigate({ to: "/upload" })} className="text-xs text-primary font-semibold">+ Unggah</button>
          </div>
          <div className="grid grid-cols-3 gap-0.5 bg-border">
            {MY_POSTS.map((post, idx) => (
              <motion.div key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.04 }} className="relative aspect-square bg-muted overflow-hidden group cursor-pointer">
                <img src={`https://api.dicebear.com/9.x/shapes/svg?seed=${post.seed}&backgroundColor=${post.bg}`} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center gap-3">
                  <span className="flex items-center gap-1 text-white text-xs font-bold"><Heart size={12} className="fill-white" /> {post.likes}</span>
                  <span className="flex items-center gap-1 text-white text-xs font-bold"><MessageCircle size={12} className="fill-white" /> {post.comments}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "main" && (
        <div className="pb-24">
          <SectionTitle title="Akun" />
          <div className="bg-card border-y border-border divide-y divide-border">
            <Row icon={User} label="Edit Profil" description="Ubah foto, username, bio" onClick={() => navigate({ to: "/profile/me" })} />
            <Row icon={Lock} label="Ubah Password" onClick={() => toast("Fitur ubah password segera hadir!")} />
            <Row icon={BookMarked} label="Postingan Tersimpan" onClick={() => navigate({ to: "/profile/me" })} />
            <Row icon={Shield} label="Akun Privat" description="Hanya pengikut yang bisa lihat" onClick={() => {}} right={<Toggle value={privateAcc} onChange={setPrivateAcc} />} />
          </div>

          <SectionTitle title="Notifikasi" />
          <div className="bg-card border-y border-border divide-y divide-border">
            <Row icon={Bell} label="Push Notification" onClick={() => {}} right={<Toggle value={notifPush} onChange={setNotifPush} />} />
            <Row icon={Volume2} label="Suara Notifikasi" onClick={() => {}} right={<Toggle value={notifSound} onChange={setNotifSound} />} />
            <Row icon={Bell} label="Email Notification" onClick={() => {}} right={<Toggle value={notifEmail} onChange={setNotifEmail} />} />
          </div>

          <SectionTitle title="Tampilan" />
          <div className="bg-card border-y border-border divide-y divide-border">
            <Row icon={theme === "dark" ? Moon : Sun} label="Tema" description={theme === "dark" ? "Mode Gelap" : "Mode Terang"} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              right={<div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">{theme === "dark" ? "Gelap" : "Terang"}</span><ChevronRight size={16} className="text-muted-foreground" /></div>} />
            <Row icon={Palette} label="Bahasa" description="Indonesia / English" onClick={() => toast("Pengaturan bahasa segera hadir!")} />
            <Row icon={Globe} label="Wilayah" description="Indonesia" onClick={() => toast("Pengaturan wilayah segera hadir!")} />
          </div>

          <SectionTitle title="Tentang" />
          <div className="bg-card border-y border-border divide-y divide-border">
            <Row icon={Info} label="Versi Aplikasi" description="Social Mart v1.0 — by JoyDev" onClick={() => {}} right={<span className="text-xs text-muted-foreground">v1.0</span>} />
            <Row icon={HelpCircle} label="Pusat Bantuan" onClick={() => toast("Pusat bantuan segera hadir!")} />
            <Row icon={CheckCircle} label="Kebijakan Privasi" onClick={() => toast("Membuka kebijakan privasi...")} />
          </div>

          <SectionTitle title="Keluar" />
          <div className="bg-card border-y border-border divide-y divide-border">
            <Row icon={LogOut} label="Keluar" danger onClick={() => { toast("Berhasil keluar!"); navigate({ to: "/auth/login" }); }} />
            <Row icon={Trash2} label="Hapus Akun" description="Tindakan ini tidak bisa dibatalkan" danger onClick={() => toast.error("Fitur hapus akun segera hadir!")} />
          </div>

          <div className="px-4 py-6 text-center">
            <p className="text-xs text-muted-foreground font-semibold">Social Mart</p>
            <p className="text-[11px] text-muted-foreground/60 mt-0.5">Dibuat dengan ❤️ oleh JoyDev</p>
            <p className="text-[10px] text-muted-foreground/40 mt-1">🚧 Aplikasi masih dalam tahap pengembangan</p>
          </div>
        </div>
      )}
    </Layout>
  );
}
