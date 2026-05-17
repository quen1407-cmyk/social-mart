import { Layout } from "@/components/layout/Layout";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft, ChevronRight, Filter, Heart, MessageCircle,
  Package, Search, Share2, ShoppingBag, ShoppingCart, Star, Tag, Truck, X, Zap,
} from "lucide-react";
import { useState } from "react";

interface Product {
  id: string; name: string; seller: string; sellerAvatar: string;
  price: number; originalPrice?: number; image: string; rating: number;
  reviews: number; category: string; badge?: string; sold: number;
  description: string; stock: number; specs: string[];
}

interface CartItem extends Product { qty: number; }

const CATEGORIES = ["All", "Fashion", "Tech", "Beauty", "Home", "Food"];

const PRODUCTS: Product[] = [
  { id: "p1", name: "Minimal Linen Tote Bag", seller: "aurora_styles", sellerAvatar: "aurora", price: 89000, originalPrice: 129000, image: "https://api.dicebear.com/9.x/shapes/svg?seed=bag1&backgroundColor=b6e3f4", rating: 4.8, reviews: 312, category: "Fashion", badge: "Best Seller", sold: 1240, description: "Tas tote premium berbahan linen berkualitas tinggi. Cocok untuk daily use, belanja, maupun bepergian. Tersedia dalam berbagai warna.", stock: 45, specs: ["Material: 100% Linen", "Ukuran: 35x40cm", "Kapasitas: 15L", "Warna: Natural/Black/Cream"] },
  { id: "p2", name: "Wireless Earbuds Pro", seller: "tech_by_kai", sellerAvatar: "kai", price: 349000, originalPrice: 499000, image: "https://api.dicebear.com/9.x/shapes/svg?seed=ear2&backgroundColor=c0aede", rating: 4.6, reviews: 876, category: "Tech", badge: "30% Off", sold: 3201, description: "Earbuds wireless premium dengan noise cancellation aktif. Battery 8 jam + case 24 jam. Koneksi Bluetooth 5.3 stabil.", stock: 120, specs: ["Bluetooth 5.3", "ANC (Active Noise Cancelling)", "Battery: 8jam + 24jam case", "Water resistant IPX5"] },
  { id: "p3", name: "Handmade Ceramic Mug", seller: "mia.creates", sellerAvatar: "mia", price: 145000, image: "https://api.dicebear.com/9.x/shapes/svg?seed=mug3&backgroundColor=ffd5dc", rating: 4.9, reviews: 98, category: "Home", badge: "New", sold: 432, description: "Mug keramik handmade unik, dibuat satu per satu oleh pengrajin lokal. Setiap produk punya karakter berbeda.", stock: 12, specs: ["Material: Keramik food-grade", "Kapasitas: 350ml", "Microwave safe", "Dishwasher safe"] },
  { id: "p4", name: "Glass Skin Serum", seller: "glowlab.id", sellerAvatar: "glow", price: 225000, originalPrice: 275000, image: "https://api.dicebear.com/9.x/shapes/svg?seed=serum4&backgroundColor=d1f4cc", rating: 4.7, reviews: 544, category: "Beauty", sold: 2100, description: "Serum wajah dengan kandungan niacinamide 10% dan hyaluronic acid. Mencerahkan, melembapkan, dan meratakan tone kulit.", stock: 78, specs: ["Niacinamide 10%", "Hyaluronic Acid", "Untuk semua jenis kulit", "BPOM Certified"] },
  { id: "p5", name: "Minimalist Desk Lamp", seller: "homecraft.co", sellerAvatar: "lamp", price: 275000, image: "https://api.dicebear.com/9.x/shapes/svg?seed=lamp5&backgroundColor=ffecc8", rating: 4.5, reviews: 203, category: "Home", sold: 780, description: "Lampu meja minimalis dengan 3 mode cahaya. Touch control dan USB charging port. Cocok untuk belajar dan kerja.", stock: 34, specs: ["3 mode cahaya (warm/neutral/cool)", "Touch control", "USB port charging", "Hemat energi LED"] },
  { id: "p6", name: "Matcha Starter Kit", seller: "zenbrews", sellerAvatar: "zen", price: 189000, originalPrice: 210000, image: "https://api.dicebear.com/9.x/shapes/svg?seed=match6&backgroundColor=b6e3b6", rating: 4.8, reviews: 421, category: "Food", badge: "Popular", sold: 1890, description: "Set lengkap untuk membuat matcha latte di rumah. Termasuk matcha grade ceremonial, bamboo whisk, dan bowl.", stock: 56, specs: ["Matcha ceremonial grade", "Bamboo whisk (chasen)", "Ceramic bowl (chawan)", "Panduan resep"] },
];

function formatRp(n: number) { return "Rp " + n.toLocaleString("id-ID"); }

function ProductDetail({ product, onBack, onAddToCart }: { product: Product; onBack: () => void; onAddToCart: (p: Product) => void }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  function handleAdd() {
    for (let i = 0; i < qty; i++) onAddToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
        <button type="button" onClick={onBack} className="p-1.5 rounded-xl hover:bg-muted transition-smooth">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <h1 className="text-sm font-display font-bold text-foreground flex-1 truncate">{product.name}</h1>
        <button type="button" onClick={() => setWishlisted(!wishlisted)} className="p-1.5 rounded-xl hover:bg-muted transition-smooth">
          <Heart size={20} className={cn("transition-all", wishlisted ? "fill-red-500 stroke-red-500" : "stroke-foreground")} />
        </button>
        <button type="button" className="p-1.5 rounded-xl hover:bg-muted transition-smooth">
          <Share2 size={20} className="text-foreground" />
        </button>
      </header>

      <div className="overflow-y-auto pb-32">
        {/* Product image */}
        <div className="aspect-square bg-muted">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Price & badges */}
          <div>
            {product.badge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground mb-2 inline-block">{product.badge}</span>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-display font-bold text-primary">{formatRp(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">{formatRp(product.originalPrice)}</span>
              )}
              {discount > 0 && (
                <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">-{discount}%</span>
              )}
            </div>
            <h2 className="text-base font-bold text-foreground mt-1">{product.name}</h2>
          </div>

          {/* Rating & stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-yellow-400 stroke-yellow-400" />
              <span className="text-sm font-semibold text-foreground">{product.rating}</span>
              <span className="text-xs text-muted-foreground">({product.reviews} ulasan)</span>
            </div>
            <span className="text-xs text-muted-foreground">{product.sold.toLocaleString()} terjual</span>
            <span className="text-xs text-muted-foreground">Stok: {product.stock}</span>
          </div>

          {/* Seller */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
            <img src={`https://api.dicebear.com/9.x/notionists/svg?seed=${product.sellerAvatar}`} alt="" className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{product.seller}</p>
              <p className="text-xs text-muted-foreground">Penjual Terverifikasi ✓</p>
            </div>
            <button type="button" className="text-xs text-primary font-semibold border border-primary/30 px-3 py-1.5 rounded-full">Kunjungi</button>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-2">Deskripsi Produk</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {/* Specs */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-2">Spesifikasi</h3>
            <div className="space-y-1.5">
              {product.specs.map((spec, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-sm text-muted-foreground">{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-xl px-3 py-2.5">
            <Truck size={14} className="text-primary shrink-0" />
            Gratis ongkir untuk pembelian di atas Rp 150.000
          </div>

          {/* Reviews preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-foreground">Ulasan</h3>
              <button type="button" className="text-xs text-primary font-semibold flex items-center gap-0.5">
                Lihat semua <ChevronRight size={12} />
              </button>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border">
              <img src={`https://api.dicebear.com/9.x/notionists/svg?seed=reviewer`} alt="" className="w-8 h-8 rounded-full" />
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={10} className="fill-yellow-400 stroke-yellow-400" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Produk bagus, sesuai deskripsi! Pengiriman cepat 👍</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card/95 backdrop-blur-md border-t border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
            <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="w-6 h-6 rounded-lg bg-card flex items-center justify-center font-bold text-foreground">−</button>
            <span className="text-sm font-semibold w-6 text-center text-foreground">{qty}</span>
            <button type="button" onClick={() => setQty(Math.min(product.stock, qty + 1))} className="w-6 h-6 rounded-lg bg-card flex items-center justify-center font-bold text-foreground">+</button>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className={cn("flex-1 py-3 rounded-2xl font-display font-bold text-sm transition-smooth", addedToCart ? "bg-green-500/20 border border-green-500/30 text-green-400" : "bg-primary text-primary-foreground hover:opacity-90")}
          >
            {addedToCart ? "✅ Ditambahkan!" : `+ Keranjang • ${formatRp(product.price * qty)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ cart, onClose, onQtyChange, onRemove }: { cart: CartItem[]; onClose: () => void; onQtyChange: (id: string, delta: number) => void; onRemove: (id: string) => void; }) {
  const [checked, setChecked] = useState(false);
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", bounce: 0.1, duration: 0.45 }} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card rounded-t-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 rounded-full bg-border" /></div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h2 className="text-base font-display font-bold text-foreground flex items-center gap-2">
            <ShoppingCart size={18} className="text-primary" /> Keranjang ({cart.length})
          </h2>
          <button type="button" onClick={onClose} className="p-1.5 rounded-xl hover:bg-muted transition-smooth">
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[45vh] px-5 py-3 flex flex-col gap-3">
          {cart.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">Keranjang kosong 🛒</div>
          ) : cart.map(item => (
            <div key={item.id} className="flex items-center gap-3">
              <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover bg-muted border border-border" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                <p className="text-xs text-primary font-semibold">{formatRp(item.price)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" onClick={() => onQtyChange(item.id, -1)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center font-bold hover:bg-primary/20 transition-smooth">−</button>
                <span className="text-sm font-semibold w-4 text-center">{item.qty}</span>
                <button type="button" onClick={() => onQtyChange(item.id, 1)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center font-bold hover:bg-primary/20 transition-smooth">+</button>
                <button type="button" onClick={() => onRemove(item.id)} className="w-7 h-7 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive ml-1">
                  <X size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="px-5 pb-8 pt-3 border-t border-border space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-base font-display font-bold text-foreground">{formatRp(total)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-xl px-3 py-2">
              <Truck size={14} className="text-primary shrink-0" /> Gratis ongkir di atas Rp 150.000
            </div>
            {checked ? (
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full py-3.5 rounded-2xl bg-green-500/20 border border-green-500/30 text-green-400 font-semibold text-sm text-center">
                ✅ Pesanan berhasil dibuat!
              </motion.div>
            ) : (
              <button type="button" onClick={() => setChecked(true)} className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-sm hover:opacity-90 transition-smooth">
                Checkout Sekarang →
              </button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function ProductCard({ product, index, onAddToCart, onClick }: { product: Product; index: number; onAddToCart: (p: Product) => void; onClick: () => void; }) {
  const [wishlisted, setWishlisted] = useState(false);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col cursor-pointer" onClick={onClick}>
      <div className="relative aspect-square bg-muted">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        {product.badge && <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">{product.badge}</span>}
        {discount > 0 && <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">-{discount}%</span>}
        <button type="button" onClick={e => { e.stopPropagation(); setWishlisted(!wishlisted); }} className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center transition-smooth">
          <Heart size={15} className={cn("transition-all", wishlisted ? "fill-red-500 stroke-red-500" : "stroke-muted-foreground")} />
        </button>
      </div>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <img src={`https://api.dicebear.com/9.x/notionists/svg?seed=${product.sellerAvatar}`} className="w-4 h-4 rounded-full" alt="" /> {product.seller}
        </p>
        <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2">{product.name}</p>
        <div className="flex items-center gap-1">
          <Star size={11} className="fill-yellow-400 stroke-yellow-400" />
          <span className="text-[11px] text-foreground font-medium">{product.rating}</span>
          <span className="text-[11px] text-muted-foreground">({product.reviews})</span>
        </div>
        <div className="mt-auto pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-display font-bold text-primary">{formatRp(product.price)}</span>
            {product.originalPrice && <span className="text-[11px] text-muted-foreground line-through">{formatRp(product.originalPrice)}</span>}
          </div>
          <p className="text-[10px] text-muted-foreground">{product.sold.toLocaleString()} terjual</p>
        </div>
        <button type="button" onClick={e => { e.stopPropagation(); onAddToCart(product); }} className="w-full mt-1 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-smooth">
          + Keranjang
        </button>
      </div>
    </motion.div>
  );
}

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  function addToCart(product: Product) {
    setCart(prev => {
      const existing = prev.find(c => c.id === product.id);
      if (existing) return prev.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function changeQty(id: string, delta: number) {
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: c.qty + delta } : c).filter(c => c.qty > 0));
  }

  function removeItem(id: string) { setCart(prev => prev.filter(c => c.id !== id)); }

  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (selectedProduct) {
    return <ProductDetail product={selectedProduct} onBack={() => setSelectedProduct(null)} onAddToCart={addToCart} />;
  }

  return (
    <Layout>
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-primary" />
            <h1 className="text-base font-display font-bold text-foreground">Marketplace</h1>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="p-2 rounded-full hover:bg-muted transition-smooth">
              <Filter size={18} className="text-muted-foreground" />
            </button>
            <button type="button" onClick={() => setCartOpen(true)} className="relative p-2 rounded-full hover:bg-muted transition-smooth">
              <ShoppingCart size={20} className="text-foreground" />
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">{cartCount}</span>}
            </button>
          </div>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari produk..." className="w-full bg-muted border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
      </header>

      <div className="mx-4 mt-4 px-4 py-3 rounded-2xl bg-gradient-to-r from-secondary/20 to-primary/10 border border-secondary/30 flex items-center gap-3">
        <Zap size={20} className="text-secondary shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-bold text-foreground">Flash Sale Hari Ini!</p>
          <p className="text-[11px] text-muted-foreground">Diskon hingga 40% untuk produk pilihan</p>
        </div>
        <button type="button" className="flex items-center gap-0.5 text-xs text-primary font-semibold shrink-0">
          Lihat <ChevronRight size={14} />
        </button>
      </div>

      <div className="flex gap-2 px-4 mt-4 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map(cat => (
          <button key={cat} type="button" onClick={() => setActiveCategory(cat)} className={cn("px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 border transition-smooth", activeCategory === cat ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border")}>
            {cat}
          </button>
        ))}
      </div>

      <div className="flex gap-3 px-4 mt-4">
        {[{ icon: Package, label: "Produk", value: `${PRODUCTS.length}+` }, { icon: Tag, label: "Brand", value: "50+" }, { icon: Truck, label: "Gratis Ongkir", value: "Ya!" }].map(s => (
          <div key={s.label} className="flex-1 bg-muted/60 border border-border rounded-xl px-3 py-2.5 text-center">
            <s.icon size={16} className="text-primary mx-auto mb-1" />
            <p className="text-xs font-bold text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="px-4 mt-4 pb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-display font-bold text-foreground">{activeCategory === "All" ? "Semua Produk" : activeCategory}</h2>
          <span className="text-xs text-muted-foreground">{filtered.length} produk</span>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">Tidak ada produk ditemukan</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} onAddToCart={addToCart} onClick={() => setSelectedProduct(p)} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onQtyChange={changeQty} onRemove={removeItem} />}
      </AnimatePresence>
    </Layout>
  );
}
