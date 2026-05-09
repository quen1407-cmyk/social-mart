import { Layout } from "@/components/layout/Layout";
import { Package, ShoppingBag, Sparkles, Tag } from "lucide-react";
import { motion } from "motion/react";

const featureHighlights = [
  { icon: Package, label: "Curated Products" },
  { icon: Tag, label: "Best Prices" },
  { icon: Sparkles, label: "Trending Picks" },
];

export default function MarketplacePage() {
  return (
    <Layout>
      {/* Page header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-4">
        <h1 className="text-base font-display font-bold text-foreground">
          Marketplace
        </h1>
      </header>

      <div className="flex flex-col items-center px-6 pt-12 pb-24 text-center gap-6">
        {/* Animated shopping bag illustration */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, type: "spring", bounce: 0.35 }}
          className="relative"
        >
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/20 flex items-center justify-center shadow-subtle">
            <ShoppingBag size={52} className="text-primary" />
          </div>
          {/* decorative dots */}
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-secondary/30 border border-secondary/40"
          />
          <motion.div
            animate={{ y: [4, -4, 4] }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute -bottom-1 -right-2 w-4 h-4 rounded-full bg-primary/30 border border-primary/40"
          />
        </motion.div>

        {/* Heading + description */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="space-y-2"
        >
          <h2 className="text-2xl font-display font-bold text-foreground">
            Products coming soon
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
            Browse, discover, and buy unique products from creators you already
            follow. The marketplace opens soon.
          </p>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.4 }}
          className="flex flex-col gap-3 w-full max-w-xs"
        >
          {featureHighlights.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.08 }}
              data-ocid={`marketplace.feature.${i + 1}`}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-muted border border-border text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon size={16} className="text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">
                {item.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Coming soon badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="mt-1 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-secondary/10 border border-secondary/25"
        >
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-sm font-semibold text-secondary">
            Launching soon
          </span>
        </motion.div>
      </div>
    </Layout>
  );
}
