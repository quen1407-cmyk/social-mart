import { useAuth } from "@/hooks/use-auth";
import { useRegisterUser } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Mail, User, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
  const { isAuthenticated, login, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const registerUser = useRegisterUser();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"connect" | "profile">("connect");

  useEffect(() => {
    if (isAuthenticated && step === "connect") setStep("profile");
  }, [isAuthenticated, step]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) return;
    try {
      await registerUser.mutateAsync({
        username: username.trim(),
        email: email.trim(),
      });
      toast.success("Account created! Welcome to Social Mart 🎉");
      navigate({ to: "/" });
    } catch {
      toast.error("Failed to create account. Please try again.");
    }
  };

  return (
    <div
      data-ocid="register.page"
      className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden"
    >
      <div className="absolute top-1/3 right-1/4 w-56 h-56 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[380px] relative z-10 space-y-6"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-14 w-14 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Zap size={28} className="text-primary" strokeWidth={2.5} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-display font-bold text-foreground">
              Create Account
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Join Social Mart today
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          {step === "connect" ? (
            <div className="space-y-5">
              <p className="text-sm text-muted-foreground text-center">
                First, connect your Internet Identity to get started.
              </p>
              <button
                type="button"
                data-ocid="register.connect_button"
                onClick={login}
                disabled={authLoading}
                className="w-full flex items-center justify-center gap-3 h-12 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm transition-smooth hover:opacity-90 active:scale-95 disabled:opacity-60"
              >
                {authLoading ? (
                  <div className="h-5 w-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                ) : (
                  <>
                    <span>Connect Identity</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
              <p className="text-center text-xs text-muted-foreground">
                Already have an account?{" "}
                <a
                  href="/auth/login"
                  data-ocid="register.login_link"
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </a>
              </p>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5">
              <p className="text-sm text-muted-foreground text-center">
                Identity connected! Complete your profile.
              </p>
              <div className="space-y-3">
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    data-ocid="register.username_input"
                    required
                    className="w-full pl-10 pr-4 h-12 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth"
                  />
                </div>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-ocid="register.email_input"
                    required
                    className="w-full pl-10 pr-4 h-12 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth"
                  />
                </div>
              </div>
              <button
                type="submit"
                data-ocid="register.submit_button"
                disabled={
                  registerUser.isPending || !username.trim() || !email.trim()
                }
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm transition-smooth hover:opacity-90 active:scale-95 disabled:opacity-60"
              >
                {registerUser.isPending ? "Creating..." : "Create Account"}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
