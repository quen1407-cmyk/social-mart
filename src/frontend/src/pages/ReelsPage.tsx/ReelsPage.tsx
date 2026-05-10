import { Layout } from "@/components/layout/Layout";
import { Avatar } from "@/components/shared/Avatar";
import { cn } from "@/lib/utils";
import {
  Bookmark,
  Heart,
  MessageCircle,
  Music2,
  MoreHorizontal,
  Play,
  Send,
  ShoppingBag,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useCallback } from "react";

interface Reel {
  id: string;
  username: string;
  avatarSeed: string;
  caption: string;
  song: string;
  likes: number;
  comments: number;
  bgGradient: string;
  emoji: string;
  hasProduct?: boolean;
  productName?: string;
  productPrice?: number;
}

const REELS: Reel[] = [
  {
    id: "r1",
    username: "aurora_styles",
    avatarSeed: "aurora",
    caption: "New collection just dropped ✨ Minimal premium fashion for everyday moments #OOTD #fashion",
    song: "Espresso - Sabrina Carpenter",
    likes: 28470,
    comments: 1340,
    bgGradient: "from-violet-900 via-purple-800 to-indigo-900",
    emoji: "👗",
    hasProduct: true,
    productName: "Linen Set Premium",
    productPrice: 299000,
  },
  {
    id: "r2",
    username: "tech_by_kai",
    avatarSeed: "kai",
    caption: "Setup tour 🖥️ Everything linked in marketplace! #techsetup #productivity",
    song: "Blinding Lights - The Weeknd",
    likes: 51020,
    comments: 2870,
    bgGradient: "from-slate-900 via-blue-900 to-cyan-900",
    emoji: "💻",
    hasProduct: true,
    productName: "Wireless Earbuds Pro",
    productPrice: 349000,
  },
  {
    id: "r3",
    username: "mia.creates",
    avatarSeed: "mia",
    caption: "Handmade with love 🍵 Each piece is unique, no two are the same. Shop now! #handmade #ceramic",
    song: "Flowers - Miley Cyrus",
    likes: 19200,
    comments: 980,
    bgGradient: "from-rose-900 via-pink-800 to-orange-900",
    emoji: "🎨",
    hasProduct: true,
    productName: "Ceramic Mug Set",
    productPrice: 145000,
  },
  {
    id: "r4",
    username: "glowlab.id",
    avatarSeed: "glow",
    caption: "Glass skin routine 🧴 Before & after - 30 days challenge! #skincare #glowup",
    song: "As It Was - Harry Styles",
    likes: 44100,
    comments: 3200,
    bgGradient: "from-emerald-900 via-teal-800 to-green-900",
    emoji: "✨",
    hasProduct: true,
    productName: "Glass Skin Serum",
    productPrice: 225000,
  },
];

function formatNum(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function ReelItem({
  reel,
  isActive,
}: {
  reel: Reel;
  isActive: boolean;
}) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [localLikes, setLocalLikes] = useState(reel.likes);
  const [muted, setMuted] = useState(true);
  const [showProduct, setShowProduct] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);

  function handleDoubleTap() {
    if (!liked) {
      setLiked(true);
      setLocalLikes((n) => n + 1);
    }
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 900);
  }

  function handleLike() {
    if (liked) {
      setLiked(false);
      setLocalLikes((n) => Math.max(0, n - 1));
    } else {
      setLiked(true);
      setLocalLikes((n) => n + 1);
    }
  }

  return (
    <div className="relative w-full h-full flex-shrink-0 snap-start overflow-hidden">
      {/* BG */}
      <div className={cn("absolute inset-0 bg-gradient-to-b", reel.bgGradient)} />

      {/* Center emoji / visual */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        onDoubleClick={handleDoubleTap}
      >
        <motion.div
          animate={isActive ? { scale: [1, 1.05, 1] } : { scale: 1 }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-[120px] select-none"
        >
          {reel.emoji}
        </motion.div>

        {/* Double tap heart */}
        <AnimatePresence>
          {likeAnim && (
            <motion.div
              key="heart-anim"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1.4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute"
            >
              <Heart size={80} className="fill-white stroke-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Gradient overlay bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-4">
        <h1 className="text-white font-display font-bold text-base drop-shadow">Reels</h1>
        <button
          type="button"
          onClick={() => setMuted((v) => !v)}
          className="p-2 rounded-full bg-black/30 backdrop-blur-sm"
        >
          {muted ? <VolumeX size={18} className="text-white" /> : <Volume2 size={18} className="text-white" />}
        </button>
      </div>

      {/* Right action bar */}
      <div className="absolute right-3 bottom-32 flex flex-col items-center gap-5">
        <button type="button" onClick={handleLike} className="flex flex-col items-center gap-1">
          <motion.div whileTap={{ scale: 1.3 }}>
            <Heart
              size={28}
              className={cn("transition-all drop-shadow-lg", liked ? "fill-red-500 stroke-red-500" : "stroke-white fill-transparent")}
            />
          </motion.div>
          <span className="text-white text-xs font-semibold drop-shadow">{formatNum(localLikes)}</span>
        </button>

        <button type="button" className="flex flex-col items-center gap-1">
          <MessageCircle size={28} className="stroke-white fill-transparent drop-shadow-lg" />
          <span className="text-white text-xs font-semibold drop-shadow">{formatNum(reel.comments)}</span>
        </button>

        <button type="button" className="flex flex-col items-center gap-1">
          <Send size={26} className="stroke-white fill-transparent drop-shadow-lg" />
          <span className="text-white text-xs font-semibold drop-shadow">Share</span>
        </button>

        <button type="button" onClick={() => setSaved((v) => !v)} className="flex flex-col items-center gap-1">
          <Bookmark size={26} className={cn("drop-shadow-lg transition-all", saved ? "fill-white stroke-white" : "stroke-white fill-transparent")} />
          <span className="text-white text-xs font-semibold drop-shadow">Save</span>
        </button>

        <button type="button" className="flex flex-col items-center gap-1">
          <MoreHorizontal size={26} className="stroke-white drop-shadow-lg" />
        </button>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-20 left-0 right-16 px-4 space-y-2">
        <div className="flex items-center gap-2">
          <Avatar
            src={`https://api.dicebear.com/9.x/notionists/svg?seed=${reel.avatarSeed}`}
            alt={reel.username}
            size="sm"
            withRing
          />
          <span className="text-white font-display font-bold text-sm drop-shadow">{reel.username}</span>
          <button type="button" className="ml-1 px-3 py-0.5 rounded-full border border-white/70 text-white text-xs font-semibold">
            Follow
          </button>
        </div>
        <p className="text-white text-sm leading-snug drop-shadow line-clamp-2">{reel.caption}</p>

        {/* Music tag */}
        <div className="flex items-center gap-1.5">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 rounded-full bg-white/20 border border-white/40 flex items-center justify-center"
          >
            <Music2 size={10} className="text-white" />
          </motion.div>
          <span className="text-white/80 text-xs truncate max-w-[180px]">{reel.song}</span>
        </div>

        {/* Shop tag */}
        {reel.hasProduct && (
          <motion.button
            type="button"
            onClick={() => setShowProduct((v) => !v)}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-xl px-3 py-2 w-fit"
          >
            <ShoppingBag size={14} className="text-white shrink-0" />
            <span className="text-white text-xs font-semibold">{reel.productName}</span>
            <span className="text-white/70 text-xs">{formatRupiah(reel.productPrice!)}</span>
          </motion.button>
        )}
      </div>

      {/* Product panel */}
      <AnimatePresence>
        {showProduct && reel.hasProduct && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", bounce: 0.15 }}
            className="absolute bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md rounded-t-3xl p-5 pb-24 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-3">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>
            <div className="flex gap-4 items-center">
              <div className={cn("w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-3xl", reel.bgGradient)}>
                {reel.emoji}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">{reel.productName}</p>
                <p className="text-xs text-muted-foreground">by {reel.username}</p>
                <p className="text-base font-display font-bold text-primary mt-1">{formatRupiah(reel.productPrice!)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowProduct(false)}
              className="w-full mt-4 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm"
            >
              + Tambah ke Keranjang
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ReelsPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const height = containerRef.current.clientHeight;
    const idx = Math.round(scrollTop / height);
    setActiveIndex(idx);
  }, []);

  return (
    <Layout hideNav={false}>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-[calc(100vh-4rem)] overflow-y-scroll snap-y snap-mandatory no-scrollbar"
        style={{ scrollBehavior: "smooth" }}
      >
        {REELS.map((reel, i) => (
          <div key={reel.id} className="h-[calc(100vh-4rem)] snap-start relative">
            <ReelItem reel={reel} isActive={i === activeIndex} />
          </div>
        ))}
      </div>
    </Layout>
  );
}
