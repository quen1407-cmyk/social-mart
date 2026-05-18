import { supabase } from "@/lib/supabase";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Mail, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");

  async function handleSubmit() {
    if (!email || !password) {
      toast.error("Email dan password harus diisi!");
      return;
    }
    if (isRegister && !username) {
      toast.error("Username harus diisi!");
      return;
    }

    setLoading(true);

    if (isRegister) {
      // Daftar akun baru
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Buat profil
        await supabase.from("profiles").upsert({
          id: data.user.id,
          username,
          bio: "",
          avatar_url: "",
        });
        toast.success("Akun berhasil dibuat! Silakan login 🎉");
        setIsRegister(false);
      }
    } else {
      // Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email atau password salah!");
        } else {
          toast.error(error.message);
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        toast.success("Selamat datang kembali! 👋");
        navigate({ to: "/" });
      }
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-3 mb-10"
      >
        <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Zap size={32} className="text-primary" strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground">Social Mart</h1>
        <p className="text-sm text-muted-foreground">by JoyDev</p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-sm space-y-4"
      >
        <h2 className="text-xl font-display font-bold text-foreground text-center">
          {isRegister ? "Buat Akun Baru" : "Masuk"}
        </h2>
        <p className="text-sm text-muted-foreground text-center">
          {isRegister ? "Daftar untuk mulai menggunakan Social Mart" : "Masuk ke akun kamu"}
        </p>

        {isRegister && (
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
            <input
              value={username}
              onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s/g, "_"))}
              placeholder="username"
              className="w-full bg-muted border border-border rounded-xl pl-8 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        )}

        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-muted border border-border rounded-xl pl-9 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type={showPass ? "text" : "password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="Password"
            className="w-full bg-muted border border-border rounded-xl pl-9 pr-10 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2">
            {showPass ? <EyeOff size={16} className="text-muted-foreground" /> : <Eye size={16} className="text-muted-foreground" />}
          </button>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-sm hover:opacity-90 transition-smooth disabled:opacity-60"
        >
          {loading ? "Memproses..." : isRegister ? "Daftar Sekarang" : "Masuk"}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-sm text-primary font-semibold"
          >
            {isRegister ? "Sudah punya akun? Masuk" : "Belum punya akun? Daftar"}
          </button>
        </div>

        {!isRegister && (
          <div className="text-center">
            <button type="button" className="text-xs text-muted-foreground">
              Lupa password?
            </button>
          </div>
        )}
      </motion.div>

      <p className="text-[10px] text-muted-foreground mt-10 text-center">
        🚧 Dalam Tahap Pengembangan oleh JoyDev
      </p>
    </div>
  );
}
