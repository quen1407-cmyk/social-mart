import { Layout } from "@/components/layout/Layout";
import { Compass, Search as SearchIcon, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const categories = [
  { label: "Trending", emoji: "🔥" },
  { label: "Fashion", emoji: "👗" },
  { label: "Electronics", emoji: "⚡" },
  { label: "Food", emoji: "🍜" },
  { label: "Beauty", emoji: "✨" },
];

export default function SearchPage() {
  return (
    <Layout>
      {/* Sticky search header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="relative">
          <SearchIcon
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            placeholder="Search posts, products, people..."
            readOnly
            data-ocid="search.search_input"
            className="w-full pl-10 pr-4 h-11 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth cursor-not-allowed"
          />
        </div>
      </header>

      <div className="flex flex-col items-center px-6 pt-12 pb-24 text-center gap-6">
        {/* Animated icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Compass size={44} className="text-primary" />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center"
          >
            <Sparkles size={13} className="text-secondary" />
          </motion.div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="space-y-2"
        >
          <h1 className="text-2xl font-display font-bold text-foreground">
            Discover
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
            Explore trending posts, creators, and products — search is coming
            very soon.
          </p>
        </motion.div>

        {/* Category chips */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="flex flex-wrap gap-2 justify-center"
        >
          {categories.map((cat, i) => (
            <motion.span
              key={cat.label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.07 }}
              data-ocid={`search.category_chip.${i + 1}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted border border-border text-sm text-muted-foreground font-medium select-none"
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </motion.span>
          ))}
        </motion.div>

        {/* Coming soon badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-2 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary/8 border border-primary/20"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-semibold text-primary">
            Coming soon
          </span>
        </motion.div>
      </div>
    </Layout>
  );
}
