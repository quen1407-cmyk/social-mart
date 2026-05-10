import { Layout } from "@/components/layout/Layout";
import { Avatar } from "@/components/shared/Avatar";
import { cn } from "@/lib/utils";
import { Bell, Heart, MessageCircle, ShoppingBag, UserPlus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

type NotifType = "like" | "comment" | "follow" | "order";

interface Notif {
  id: string;
  type: NotifType;
  username: string;
  avatarSeed: string;
  message: string;
  time: string;
  read: boolean;
}

const NOTIFS: Notif[] = [
  { id: "n1", type: "like", username: "aurora_styles", avatarSeed: "aurora", message: "menyukai foto kamu", time: "2m", read: false },
  { id: "n2", type: "follow", username: "tech_by_kai", avatarSeed: "kai", message: "mulai mengikuti kamu", time: "15m", read: false },
  { id: "n3", type: "comment", username: "mia.creates", avatarSeed: "mia", message: "berkomentar: \"Keren banget! 🔥\"", time: "1j", read: false },
  { id: "n4", type: "order", username: "glowlab.id", avatarSeed: "glow", message: "memesan produk kamu - Rp 225.000", time: "2j", read: true },
  { id: "n5", type: "like", username: "zenbrews", avatarSeed: "zen", message: "menyukai foto kamu", time: "3j", read: true },
  { id: "n6", type: "follow", username: "homecraft.co", avatarSeed: "lamp", message: "mulai mengikuti kamu", time: "5j", read: true },
  { id: "n7", type: "comment", username: "aurora_styles", avatarSeed: "aurora", message: "berkomentar: \"Aku mau beli ini!\"", time: "1h", read: true },
  { id: "n8", type: "order", username: "tech_by_kai", avatarSeed: "kai", message: "memesan produk kamu - Rp 349.000", time: "2h", read: true },
];

const iconMap: Record<NotifType, { icon: typeof Heart; color: string; bg: string }> = {
  like: { icon: Heart, color: "text-red-400", bg: "bg-red-500/15" },
  comment: { icon: MessageCircle, color: "text-blue-400", bg: "bg-blue-500/15" },
  follow: { icon: UserPlus, color: "text-primary", bg: "bg-primary/15" },
  order: { icon: ShoppingBag, color: "text-secondary", bg: "bg-secondary/15" },
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(NOTIFS);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  const markAllRead = () => setNotifs((n) => n.map((x) => ({ ...x, read: true })));
  const markRead = (id: string) => setNotifs((n) => n.map((x) => x.id === id ? { ...x, read: true } : x));

  const unreadCount = notifs.filter((n) => !n.read).length;
  const displayed = activeTab === "unread" ? notifs.filter((n) => !n.read) : notifs;

  return (
    <Layout>
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-primary" />
            <h1 className="text-base font-display font-bold text-foreground">Notifikasi</h1>
            {unreadCount > 0 && (
              <span className="h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button type="button" onClick={markAllRead} className="text-xs text-primary font-semibold">
              Tandai semua dibaca
            </button>
          )}
        </div>
        <div className="flex gap-2 mt-3">
          {(["all", "unread"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-semibold border transition-smooth",
                activeTab === tab
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-border"
              )}
            >
              {tab === "all" ? "Semua" : `Belum dibaca (${unreadCount})`}
            </button>
          ))}
        </div>
      </header>

      <div className="divide-y divide-border">
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Bell size={40} className="text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Tidak ada notifikasi</p>
          </div>
        ) : (
          displayed.map((notif, i) => {
            const { icon: Icon, color, bg } = iconMap[notif.type];
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => markRead(notif.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-muted/50 transition-smooth",
                  !notif.read && "bg-primary/5"
                )}
              >
                <div className="relative shrink-0">
                  <Avatar
                    src={`https://api.dicebear.com/9.x/notionists/svg?seed=${notif.avatarSeed}`}
                    alt={notif.username}
                    size="sm"
                  />
                  <div className={cn("absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center", bg)}>
                    <Icon size={10} className={color} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">{notif.username}</span>{" "}
                    {notif.message}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{notif.time} yang lalu</p>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </Layout>
  );
}
