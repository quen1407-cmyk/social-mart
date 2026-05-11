import { cn } from "@/lib/utils";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Home, Play, PlusCircle, ShoppingBag, User } from "lucide-react";

const navItems = [
  { to: "/", icon: Home, label: "Beranda" },
  { to: "/upload", icon: PlusCircle, label: "Unggah" },
  { to: "/reels", icon: Play, label: "Reels" },
  { to: "/marketplace", icon: ShoppingBag, label: "Pasar" },
  { to: "/profile/me", icon: User, label: "Profil" },
];

export function BottomNav() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = (to: string) => {
    if (to === "/") return currentPath === "/";
    return currentPath.startsWith(to.replace("/me", ""));
  };

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 border-t border-border bg-card/95 backdrop-blur-md">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = isActive(to);
          return (
            <button
              key={to}
              type="button"
              onClick={() => navigate({ to })}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-smooth",
                active ? "nav-tab-active" : "nav-tab-inactive"
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.75} className={cn("transition-smooth", active && "drop-shadow-[0_0_6px_oklch(0.7_0.2_190/0.6)]")} />
              <span className="text-[9px] font-medium tracking-tight">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
