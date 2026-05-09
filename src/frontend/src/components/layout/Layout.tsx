import { BottomNav } from "./BottomNav";

interface LayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

export function Layout({ children, hideNav = false }: LayoutProps) {
  const year = new Date().getFullYear();
  const utm = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;
  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <main className="w-full max-w-[430px] flex-1 bg-background pb-20">
        {children}
      </main>
      <div className="w-full max-w-[430px] pb-20 px-4">
        <p className="text-center text-[10px] text-muted-foreground/50 py-2">
          &copy; {year}. Built with love using{" "}
          <a
            href={utm}
            target="_blank"
            rel="noreferrer"
            className="hover:text-muted-foreground transition-smooth"
          >
            caffeine.ai
          </a>
        </p>
      </div>
      {!hideNav && <BottomNav />}
    </div>
  );
}
