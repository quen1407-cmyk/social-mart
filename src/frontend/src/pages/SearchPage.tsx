import { Layout } from "@/components/layout/Layout";
import { Avatar } from "@/components/shared/Avatar";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { Heart, Search, ShoppingBag, Star, UserPlus, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const ACCOUNTS = [
  { username: "aurora_styles", seed: "aurora", bio: "Fashion & Lifestyle ✨", followers: "12.4K" },
  { username: "tech_by_kai", seed: "kai", bio: "Tech enthusiast 💻", followers: "8.1K" },
  { username: "mia.creates", seed: "mia", bio: "Handmade ceramics 🎨", followers: "5.3K" },
  { username: "glowlab.id", seed: "glow", bio: "Skincare & Beauty 🧴", followers: "21.7K" },
  { username: "zenbrews", seed: "zen", bio: "Matcha & Tea lover 🍵", followers: "3.9K" },
  { username: "homecraft.co", seed: "lamp", bio: "Home decor & lifestyle 🏠", followers: "7.2K" },
];

const PRODUCTS = [
  { id: "p1", name: "Minimal Linen Tote Bag", seller: "aurora_styles", price: 89000, seed: "bag1", bg: "b6e3f4", rating: 4.8 },
  { id: "p2", name: "Wireless Earbuds Pro", seller: "tech_by_kai", price: 349000, seed: "ear2", bg: "c0aede", rating: 4.6 },
  { id: "p3", name: "Handmade Ceramic Mug", seller: "mia.creates", price: 145000, seed: "mug3", bg: "ffd5dc", rating: 4.9 },
  { id: "p4", name: "Glass Skin Serum", seller: "glowlab.id", price: 225000, seed: "serum4", bg: "d1f4cc", rating: 4.7 },
  { id: "p5", name: "Matcha Starter Kit", seller: "zenbrews", price: 189000, seed: "match6", bg: "b6e3b6", rating: 4.8 },
  { id: "p6", name: "Minimalist Desk Lamp", seller: "homecraft.co", price: 275000, seed: "lamp5", bg: "ffecc8", rating: 4.5 },
];

const TRENDING = ["#OOTD", "#skincare", "#handmade", "#techsetup", "#matcha", "#homedecor", "#fashion", "#glowup"];

type Tab = "all" | "accounts" | "products";

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [following, setFollowing] = useState<string[]>([]);
  const navigate = useNavigate();

  const filteredAccounts = ACCOUNTS.filter(
    (a) => a.username.toLowerCase().includes(query.toLowerCase()) || a.bio.toLowerCase().includes(query.toLowerCase())
  );
  const filteredProducts = PRODUCTS.filter(
    (p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.seller.toLowerCase().includes(query.toLowerCase())
  );

  function toggleFollow(username: string) {
    setFollowing((prev) =>
      prev.includes(username) ? prev.filter((u) => u !== username) : [...prev, username]
    );
  }

  return (
    <Layout>
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari akun, produk, hashtag..."
            className="w-full bg-muted border border-border rounded-xl pl-9 pr-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            autoFocus
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={15} className="text-muted-foreground" />
            </button>
          )}
        </div>
        {query && (
          <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
            {(["all", "accounts", "products"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 border transition-smooth",
                  tab === t ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border"
                )}
              >
                {t === "all" ? "Semua" : t === "accounts" ? "Akun" : "Produk"}
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="pb-8">
        {!query ? (
          <div className="px-4 py-4 space-y-5">
            {/* Trending */}
            <div>
              <h2 className="text-sm font-display font-bold text-foreground mb-3">🔥 Trending</h2>
              <div className="flex flex-wrap gap-2">
                {TRENDING.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 rounded-full bg-muted border border-border text-xs font-semibold text-foreground hover:border-primary/40 transition-smooth"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Suggested accounts */}
            <div>
              <h2 className="text-sm font-display font-bold text-foreground mb-3">👥 Akun yang Mungkin Kamu Kenal</h2>
              <div className="space-y-2">
                {ACCOUNTS.slice(0, 4).map((acc, i) => (
                  <motion.div
                    key={acc.username}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border"
                  >
                    <button type="button" onClick={() => navigate({ to: "/profile/$uid", params: { uid: acc.seed } })}>
                      <Avatar src={`https://api.dicebear.com/9.x/notionists/svg?seed=${acc.seed}`} alt={acc.username} size="sm" withRing />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{acc.username}</p>
                      <p className="text-xs text-muted-foreground">{acc.followers} pengikut</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleFollow(acc.username)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-semibold transition-smooth",
                        following.includes(acc.username)
                          ? "bg-muted border border-border text-foreground"
                          : "bg-primary text-primary-foreground"
                      )}
                    >
                      {following.includes(acc.username) ? "Mengikuti" : "Ikuti"}
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Popular products */}
            <div>
              <h2 className="text-sm font-display font-bold text-foreground mb-3">🛍️ Produk Populer</h2>
              <div className="grid grid-cols-2 gap-3">
                {PRODUCTS.slice(0, 4).map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card border border-border rounded-2xl overflow-hidden"
                  >
                    <div className="aspect-square bg-muted">
                      <img src={`https://api.dicebear.com/9.x/shapes/svg?seed=${p.seed}&backgroundColor=${p.bg}`} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-semibold text-foreground line-clamp-1">{p.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star size={10} className="fill-yellow-400 stroke-yellow-400" />
                        <span className="text-[10px] text-muted-foreground">{p.rating}</span>
                      </div>
                      <p className="text-xs font-bold text-primary mt-1">{formatRp(p.price)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={query + tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-4 space-y-4">
              {/* Accounts */}
              {(tab === "all" || tab === "accounts") && filteredAccounts.length > 0 && (
                <div>
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Akun</h2>
                  <div className="space-y-2">
                    {filteredAccounts.map((acc) => (
                      <div key={acc.username} className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border">
                        <button type="button" onClick={() => navigate({ to: "/profile/$uid", params: { uid: acc.seed } })}>
                          <Avatar src={`https://api.dicebear.com/9.x/notionists/svg?seed=${acc.seed}`} alt={acc.username} size="sm" withRing />
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">{acc.username}</p>
                          <p className="text-xs text-muted-foreground">{acc.bio}</p>
                          <p className="text-[10px] text-muted-foreground">{acc.followers} pengikut</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleFollow(acc.username)}
                          className={cn(
                            "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-smooth",
                            following.includes(acc.username)
                              ? "bg-muted border border-border text-foreground"
                              : "bg-primary text-primary-foreground"
                          )}
                        >
                          {following.includes(acc.username) ? "Mengikuti" : <><UserPlus size={11} /> Ikuti</>}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
              {(tab === "all" || tab === "products") && filteredProducts.length > 0 && (
                <div>
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Produk</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {filteredProducts.map((p) => (
                      <div key={p.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                        <div className="aspect-square bg-muted relative">
                          <img src={`https://api.dicebear.com/9.x/shapes/svg?seed=${p.seed}&backgroundColor=${p.bg}`} alt={p.name} className="w-full h-full object-cover" />
                          <button type="button" className="absolute top-2 right-2 w-7 h-7 rounded-full bg-card/80 flex items-center justify-center">
                            <Heart size={13} className="stroke-muted-foreground" />
                          </button>
                        </div>
                        <div className="p-2.5">
                          <p className="text-xs font-semibold text-foreground line-clamp-2">{p.name}</p>
                          <p className="text-[10px] text-muted-foreground">{p.seller}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star size={10} className="fill-yellow-400 stroke-yellow-400" />
                            <span className="text-[10px] text-muted-foreground">{p.rating}</span>
                          </div>
                          <p className="text-xs font-bold text-primary mt-1">{formatRp(p.price)}</p>
                          <button
                            type="button"
                            onClick={() => navigate({ to: "/marketplace" })}
                            className="w-full mt-1.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] font-semibold flex items-center justify-center gap-1"
                          >
                            <ShoppingBag size={10} /> Beli
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredAccounts.length === 0 && filteredProducts.length === 0 && (
                <div className="text-center py-16">
                  <Search size={40} className="text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Tidak ditemukan untuk "{query}"</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </Layout>
  );
}
