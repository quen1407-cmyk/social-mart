import { j as jsxRuntimeExports } from "./index-CgYOV5jf.js";
import { L as Layout, S as ShoppingBag } from "./Layout-B60O5qPC.js";
import { m as motion } from "./proxy-BwgDIH52.js";
import { P as Package } from "./package-CAHd52X1.js";
import { T as Tag } from "./tag-BLMLDK9F.js";
import { S as Sparkles } from "./sparkles-B2VHwmmT.js";
import "./user-D4VcQ6pj.js";
const featureHighlights = [
  { icon: Package, label: "Curated Products" },
  { icon: Tag, label: "Best Prices" },
  { icon: Sparkles, label: "Trending Picks" }
];
function MarketplacePage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-base font-display font-bold text-foreground", children: "Marketplace" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center px-6 pt-12 pb-24 text-center gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: -16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, type: "spring", bounce: 0.35 },
          className: "relative",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-28 h-28 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/20 flex items-center justify-center shadow-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 52, className: "text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                animate: { y: [-4, 4, -4] },
                transition: {
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut"
                },
                className: "absolute -top-2 -left-2 w-5 h-5 rounded-full bg-secondary/30 border border-secondary/40"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                animate: { y: [4, -4, 4] },
                transition: {
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut"
                },
                className: "absolute -bottom-1 -right-2 w-4 h-4 rounded-full bg-primary/30 border border-primary/40"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.15, duration: 0.45 },
          className: "space-y-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold text-foreground", children: "Products coming soon" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed max-w-xs", children: "Browse, discover, and buy unique products from creators you already follow. The marketplace opens soon." })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.28, duration: 0.4 },
          className: "flex flex-col gap-3 w-full max-w-xs",
          children: featureHighlights.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: -16 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: 0.35 + i * 0.08 },
              "data-ocid": `marketplace.feature.${i + 1}`,
              className: "flex items-center gap-3 px-4 py-3 rounded-2xl bg-muted border border-border text-left",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { size: 16, className: "text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: item.label })
              ]
            },
            item.label
          ))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { delay: 0.65 },
          className: "mt-1 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-secondary/10 border border-secondary/25",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-secondary animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-secondary", children: "Launching soon" })
          ]
        }
      )
    ] })
  ] });
}
export {
  MarketplacePage as default
};
