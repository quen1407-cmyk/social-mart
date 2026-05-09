import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, a as ue } from "./index-CgYOV5jf.js";
import { u as useAuth } from "./index-BikGRg3B.js";
import { u as useRegisterUser } from "./useQueries-B3XIVZSS.js";
import { c as createLucideIcon, m as motion } from "./proxy-BwgDIH52.js";
import { Z as Zap } from "./zap-DpxqxhTP.js";
import { A as ArrowRight } from "./arrow-right-K8uJYWSc.js";
import { U as User } from "./user-D4VcQ6pj.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode);
function RegisterPage() {
  const { isAuthenticated, login, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const registerUser = useRegisterUser();
  const [username, setUsername] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [step, setStep] = reactExports.useState("connect");
  reactExports.useEffect(() => {
    if (isAuthenticated && step === "connect") setStep("profile");
  }, [isAuthenticated, step]);
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) return;
    try {
      await registerUser.mutateAsync({
        username: username.trim(),
        email: email.trim()
      });
      ue.success("Account created! Welcome to Social Mart 🎉");
      navigate({ to: "/" });
    } catch {
      ue.error("Failed to create account. Please try again.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "register.page",
      className: "min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/3 right-1/4 w-56 h-56 rounded-full bg-secondary/10 blur-3xl pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 24 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5 },
            className: "w-full max-w-[380px] relative z-10 space-y-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 28, className: "text-primary", strokeWidth: 2.5 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Create Account" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Join Social Mart today" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-2xl p-6", children: step === "connect" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center", children: "First, connect your Internet Identity to get started." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "register.connect_button",
                    onClick: login,
                    disabled: authLoading,
                    className: "w-full flex items-center justify-center gap-3 h-12 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm transition-smooth hover:opacity-90 active:scale-95 disabled:opacity-60",
                    children: authLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Connect Identity" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 16 })
                    ] })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground", children: [
                  "Already have an account?",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "a",
                    {
                      href: "/auth/login",
                      "data-ocid": "register.login_link",
                      className: "text-primary font-medium hover:underline",
                      children: "Sign in"
                    }
                  )
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleRegister, className: "space-y-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center", children: "Identity connected! Complete your profile." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      User,
                      {
                        size: 16,
                        className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "text",
                        placeholder: "Username",
                        value: username,
                        onChange: (e) => setUsername(e.target.value),
                        "data-ocid": "register.username_input",
                        required: true,
                        className: "w-full pl-10 pr-4 h-12 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Mail,
                      {
                        size: 16,
                        className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "email",
                        placeholder: "Email address",
                        value: email,
                        onChange: (e) => setEmail(e.target.value),
                        "data-ocid": "register.email_input",
                        required: true,
                        className: "w-full pl-10 pr-4 h-12 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "submit",
                    "data-ocid": "register.submit_button",
                    disabled: registerUser.isPending || !username.trim() || !email.trim(),
                    className: "w-full h-12 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm transition-smooth hover:opacity-90 active:scale-95 disabled:opacity-60",
                    children: registerUser.isPending ? "Creating..." : "Create Account"
                  }
                )
              ] }) })
            ]
          }
        )
      ]
    }
  );
}
export {
  RegisterPage as default
};
