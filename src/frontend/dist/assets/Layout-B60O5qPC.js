import { u as useNavigate, d as useRouterState, j as jsxRuntimeExports, c as cn } from "./index-CgYOV5jf.js";
import { c as createLucideIcon } from "./proxy-BwgDIH52.js";
import { U as User } from "./user-D4VcQ6pj.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }],
  ["path", { d: "M12 8v8", key: "napkw2" }]
];
const CirclePlus = createLucideIcon("circle-plus", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "1d0kgt"
    }
  ]
];
const House = createLucideIcon("house", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z", key: "hou9p0" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M16 10a4 4 0 0 1-8 0", key: "1ltviw" }]
];
const ShoppingBag = createLucideIcon("shopping-bag", __iconNode);
const navItems = [
  { to: "/", icon: House, label: "Home", ocid: "bottomnav.home_tab" },
  {
    to: "/search",
    icon: Search,
    label: "Search",
    ocid: "bottomnav.search_tab"
  },
  {
    to: "/upload",
    icon: CirclePlus,
    label: "Upload",
    ocid: "bottomnav.upload_tab"
  },
  {
    to: "/marketplace",
    icon: ShoppingBag,
    label: "Market",
    ocid: "bottomnav.marketplace_tab"
  },
  {
    to: "/profile/me",
    icon: User,
    label: "Profile",
    ocid: "bottomnav.profile_tab"
  }
];
function BottomNav() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const isActive = (to) => {
    if (to === "/") return currentPath === "/";
    return currentPath.startsWith(to.replace("/me", ""));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "nav",
    {
      "data-ocid": "bottomnav",
      className: "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 border-t border-border bg-card/95 backdrop-blur-md",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-around h-16 px-2", children: navItems.map(({ to, icon: Icon, label, ocid }) => {
        const active = isActive(to);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": ocid,
            onClick: () => navigate({ to }),
            className: cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-smooth min-w-0",
              active ? "nav-tab-active" : "nav-tab-inactive"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Icon,
                {
                  size: 22,
                  strokeWidth: active ? 2.5 : 1.75,
                  className: cn(
                    "transition-smooth",
                    active && "drop-shadow-[0_0_6px_oklch(0.7_0.2_190/0.6)]"
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium tracking-tight", children: label })
            ]
          },
          to
        );
      }) })
    }
  );
}
function Layout({ children, hideNav = false }) {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const utm = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "w-full max-w-[430px] flex-1 bg-background pb-20", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-[430px] pb-20 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-[10px] text-muted-foreground/50 py-2", children: [
      "© ",
      year,
      ". Built with love using",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: utm,
          target: "_blank",
          rel: "noreferrer",
          className: "hover:text-muted-foreground transition-smooth",
          children: "caffeine.ai"
        }
      )
    ] }) }),
    !hideNav && /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
export {
  Layout as L,
  ShoppingBag as S,
  Search as a
};
