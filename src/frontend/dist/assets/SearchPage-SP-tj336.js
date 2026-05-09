import { j as jsxRuntimeExports } from "./index-CgYOV5jf.js";
import { L as Layout, a as Search } from "./Layout-B60O5qPC.js";
import { c as createLucideIcon, m as motion } from "./proxy-BwgDIH52.js";
import { S as Sparkles } from "./sparkles-B2VHwmmT.js";
import "./user-D4VcQ6pj.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z",
      key: "9ktpf1"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
];
const Compass = createLucideIcon("compass", __iconNode);
const categories = [
  { label: "Trending", emoji: "🔥" },
  { label: "Fashion", emoji: "👗" },
  { label: "Electronics", emoji: "⚡" },
  { label: "Food", emoji: "🍜" },
  { label: "Beauty", emoji: "✨" }
];
function SearchPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Search,
        {
          size: 18,
          className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "search",
          placeholder: "Search posts, products, people...",
          readOnly: true,
          "data-ocid": "search.search_input",
          className: "w-full pl-10 pr-4 h-11 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth cursor-not-allowed"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center px-6 pt-12 pb-24 text-center gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.5, type: "spring", bounce: 0.4 },
          className: "relative",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Compass, { size: 44, className: "text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                animate: { rotate: 360 },
                transition: {
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear"
                },
                className: "absolute -top-1 -right-1 w-7 h-7 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 13, className: "text-secondary" })
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Discover" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed max-w-xs", children: "Explore trending posts, creators, and products — search is coming very soon." })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.25, duration: 0.4 },
          className: "flex flex-wrap gap-2 justify-center",
          children: categories.map((cat, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.span,
            {
              initial: { opacity: 0, scale: 0.85 },
              animate: { opacity: 1, scale: 1 },
              transition: { delay: 0.3 + i * 0.07 },
              "data-ocid": `search.category_chip.${i + 1}`,
              className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted border border-border text-sm text-muted-foreground font-medium select-none",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: cat.emoji }),
                cat.label
              ]
            },
            cat.label
          ))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { delay: 0.6 },
          className: "mt-2 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary/8 border border-primary/20",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-primary animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-primary", children: "Coming soon" })
          ]
        }
      )
    ] })
  ] });
}
export {
  SearchPage as default
};
