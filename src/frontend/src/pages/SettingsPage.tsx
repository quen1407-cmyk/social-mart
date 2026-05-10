import { Layout } from "@/components/layout/Layout";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell, ChevronRight, Globe, HelpCircle, Info,
  Lock, LogOut, Moon, Palette, Shield, Sun,
  Trash2, User, Volume2,
} from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "sonner";

function SettingItem({
  icon: Icon,
  label,
  description,
  onClick,
  danger,
  right,
}: {
  icon: typeof Bell;
  label: string;
  description?: string;
  onClick?: () => void;
  danger?: boolean;
  right?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-muted/50 transition-smooth"
    >
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

function SectionHeader({ title }: { title: string }) {
  return <p className="px-4 pt-5 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{title}</p>;
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cn("w-11 h-6 rounded-full transition-smooth relative shrink-0", value ? "bg-primary" : "bg-muted border border-border")}
    >
      <motion.div
        animate={{ x: value ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5"
      />
    </button>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
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
        <h1 className="text-base font-display font-bold text-foreground">Pengaturan</h1>
      </header>

      <div className="pb-24">
        {/* Account */}
        <SectionHeader title="Akun" />
        <div className="bg-card border-y border-border divide-y divide-border">
          <SettingItem icon={User} label="Edit Profil" description="Ubah foto, username, bio" onClick={() => navigate({ to: "/profile/me" })} />
          <SettingItem icon={Lock} label="Ubah Password" onClick={() => toast("Fitur ubah password segera hadir!")} />
          <SettingItem icon={Shield} label="Akun Privat" description="Hanya pengikut yang bisa lihat postingan" onClick={() => {}} right={<Toggle value={privateAcc} onChange={setPrivateAcc} />} />
        </div>

        {/* Notifikasi */}
        <SectionHeader title="Notifikasi" />
        <div className="bg-card border-y border-border divide-y divide-border">
          <SettingItem icon={Bell} label="Push Notification" description="Terima notif di perangkat" onClick={() => {}} right={<Toggle value={notifPush} onChange={setNotifPush} />} />
          <SettingItem icon={Volume2} label="Suara Notifikasi" onClick={() => {}} right={<Toggle value={notifSound} onChange={setNotifSound} />} />
          <SettingItem icon={Bell} label="Email Notification" onClick={() => {}} right={<Toggle value={notifEmail} onChange={setNotifEmail} />} />
        </div>

        {/* Tampilan */}
        <SectionHeader title="Tampilan" />
        <div className="bg-card border-y border-border divide-y divide-border">
          <SettingItem
            icon={theme === "dark" ? Moon : Sun}
            label="Tema"
            description={theme === "dark" ? "Mode Gelap" : "Mode Terang"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            right={
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{theme === "dark" ? "Gelap" : "Terang"}</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            }
          />
          <SettingItem icon={Palette} label="Bahasa" description="Indonesia / English" onClick={() => toast("Pengaturan bahasa segera hadir!")} />
          <SettingItem icon={Globe} label="Wilayah" description="Indonesia" onClick={() => toast("Pengaturan wilayah segera hadir!")} />
        </div>

        {/* Tentang */}
        <SectionHeader title="Tentang" />
        <div className="bg-card border-y border-border divide-y divide-border">
          <SettingItem icon={Info} label="Versi Aplikasi" description="Social Mart v1.0 — by JoyDev" onClick={() => {}} right={<span className="text-xs text-muted-foreground">v1.0</span>} />
          <SettingItem icon={HelpCircle} label="Pusat Bantuan" onClick={() => toast("Pusat bantuan segera hadir!")} />
          <SettingItem icon={Shield} label="Kebijakan Privasi" onClick={() => toast("Membuka kebijakan privasi...")} />
        </div>

        {/* Berbahaya */}
        <SectionHeader title="Akun" />
        <div className="bg-card border-y border-border divide-y divide-border">
          <SettingItem icon={LogOut} label="Keluar" danger onClick={() => { toast("Berhasil keluar!"); navigate({ to: "/auth/login" }); }} />
          <SettingItem icon={Trash2} label="Hapus Akun" description="Tindakan ini tidak bisa dibatalkan" danger onClick={() => toast.error("Fitur hapus akun segera hadir!")} />
        </div>

        {/* Footer */}
        <div className="px-4 py-6 text-center">
          <p className="text-xs text-muted-foreground">Social Mart</p>
          <p className="text-[11px] text-muted-foreground/60 mt-0.5">Dibuat dengan ❤️ oleh JoyDev</p>
          <p className="text-[10px] text-muted-foreground/40 mt-1">🚧 Aplikasi masih dalam tahap pengembangan</p>
        </div>
      </div>
    </Layout>
  );
}
