import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Shield, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

export default function LoginPage() {
  const { isAuthenticated, login, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate({ to: "/" });
  }, [isAuthenticated, navigate]);

  return (
    <div
      data-ocid="login.page"
      className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden"
    >
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[380px] flex flex-col items-center gap-8 relative z-10"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center shadow-card">
            <Zap size={32} className="text-primary" strokeWidth={2.5} />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-display font-bold text-foreground">
              Social Mart
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Shop, connect, and discover
            </p>
          </div>
        </div>

        <div className="w-full bg-card border border-border rounded-2xl p-6 space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-display font-semibold text-foreground">
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground">
              Sign in with Internet Identity to continue
            </p>
          </div>

          <div className="flex items-start gap-3 bg-muted/50 rounded-xl p-3">
            <Shield size={18} className="text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Internet Identity provides secure, passwordless authentication.
            </p>
          </div>

          <button
            type="button"
            data-ocid="login.submit_button"
            onClick={login}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 h-12 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm transition-smooth hover:opacity-90 active:scale-95 disabled:opacity-60 shadow-card"
          >
            {isLoading ? (
              <div className="h-5 w-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
            ) : (
              <>
                <span>Continue with Internet Identity</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Don't have an account?{" "}
            <a
              href="/auth/register"
              data-ocid="login.register_link"
              className="text-primary font-medium hover:underline"
            >
              Create one
            </a>
          </p>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          By continuing, you agree to our Terms of Service.
        </p>
      </motion.div>
    </div>
  );
}
