import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle, ChevronRight, FileText, ShoppingBag, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export default function SellerApplyPage() {
  const navigate = useNavigate();
  const { username, userId } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    birth_date: "",
    id_number: "",
    phone: "",
    email: "",
    address: "",
    product_type: "",
    reason: "",
    agree: false,
  });

  function updateForm(key: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function getAge(birthDate: string) {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  async function handleSubmit() {
    const age = getAge(form.birth_date);
    if (age < 15) {
      toast.error("Minimal umur 15 tahun untuk mendaftar sebagai penjual!");
      return;
    }
    if (!form.full_name || !form.id_number || !form.phone || !form.email || !form.address || !form.product_type || !form.reason) {
      toast.error("Semua field harus diisi!");
      return;
    }
    if (!form.agree) {
      toast.error("Kamu harus menyetujui syarat & ketentuan!");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("seller_applications").insert({
      full_name: form.full_name,
      username: username,
      email: form.email,
      phone: form.phone,
      id_number: form.id_number,
      address: form.address,
      product_type: form.product_type,
      reason: form.reason,
      status: "pending",
    });

    setLoading(false);
    if (!error) {
      setSubmitted(true);
    } else {
      toast.error("Gagal mengirim permohonan. Coba lagi!");
    }
  }

  if (submitted) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 gap-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.4 }}>
            <div className="w-24 h-24 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <CheckCircle size={48} className="text-green-400" />
            </div>
          </motion.div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-display font-bold text-foreground">Permohonan Dikirim! 🎉</h2>
            <p className="text-sm text-muted-foreground">Permohonan kamu sudah diterima dan akan ditinjau oleh JoyDev dalam 1-3 hari kerja.</p>
            <p className="text-xs text-muted-foreground">Kamu akan dihubungi melalui email yang didaftarkan.</p>
          </div>
          <button type="button" onClick={() => navigate({ to: "/profile/me" })} className="w-full max-w-xs py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm">
            Kembali ke Profil
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
        <button type="button" onClick={() => navigate({ to: "/profile/me" })} className="p-1">
          <X size={20} className="text-foreground" />
        </button>
        <h1 className="text-base font-display font-bold text-foreground flex-1">Formulir Pendaftaran Penjual</h1>
        <span className="text-xs text-muted-foreground">{step}/2</span>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <motion.div animate={{ width: `${(step / 2) * 100}%` }} className="h-full bg-primary rounded-full transition-all" />
      </div>

      <div className="px-4 py-5 pb-24 space-y-4">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={18} className="text-primary" />
              <h2 className="text-sm font-bold text-foreground">Data Diri</h2>
            </div>

            <div className="bg-secondary/10 border border-secondary/20 rounded-xl px-4 py-3">
              <p className="text-xs text-secondary font-semibold">⚠️ Minimal umur 15 tahun untuk mendaftar sebagai penjual</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground font-medium">Nama Lengkap *</label>
                <input value={form.full_name} onChange={e => updateForm("full_name", e.target.value)} placeholder="Sesuai KTP/Kartu Pelajar" className="mt-1 w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium">Tanggal Lahir * <span className="text-primary">(min. 15 tahun)</span></label>
                <input type="date" value={form.birth_date} onChange={e => updateForm("birth_date", e.target.value)} className="mt-1 w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                {form.birth_date && (
                  <p className={`text-xs mt-1 ${getAge(form.birth_date) >= 15 ? "text-green-400" : "text-destructive"}`}>
                    Umur: {getAge(form.birth_date)} tahun {getAge(form.birth_date) >= 15 ? "✓" : "✗ Belum memenuhi syarat"}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium">No. KTP / Kartu Pelajar *</label>
                <input value={form.id_number} onChange={e => updateForm("id_number", e.target.value)} placeholder="16 digit NIK" maxLength={16} className="mt-1 w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium">No. WhatsApp *</label>
                <input type="tel" value={form.phone} onChange={e => updateForm("phone", e.target.value)} placeholder="08xxxxxxxxxx" className="mt-1 w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium">Email *</label>
                <input type="email" value={form.email} onChange={e => updateForm("email", e.target.value)} placeholder="email@example.com" className="mt-1 w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium">Alamat Lengkap *</label>
                <textarea value={form.address} onChange={e => updateForm("address", e.target.value)} rows={3} placeholder="Jalan, Kota, Provinsi" className="mt-1 w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!form.full_name || !form.birth_date || !form.id_number || !form.phone || !form.email || !form.address) {
                  toast.error("Semua field harus diisi!");
                  return;
                }
                if (getAge(form.birth_date) < 15) {
                  toast.error("Minimal umur 15 tahun!");
                  return;
                }
                setStep(2);
              }}
              className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2"
            >
              Lanjut <ChevronRight size={16} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag size={18} className="text-primary" />
              <h2 className="text-sm font-bold text-foreground">Informasi Jualan</h2>
            </div>

            <div>
              <label className="text-xs text-muted-foreground font-medium">Jenis Produk yang Dijual *</label>
              <select value={form.product_type} onChange={e => updateForm("product_type", e.target.value)} className="mt-1 w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                <option value="">Pilih kategori</option>
                <option value="Fashion">Fashion & Pakaian</option>
                <option value="Tech">Teknologi & Gadget</option>
                <option value="Beauty">Kecantikan & Perawatan</option>
                <option value="Home">Rumah & Dekorasi</option>
                <option value="Food">Makanan & Minuman</option>
                <option value="Handmade">Kerajinan Tangan</option>
                <option value="Other">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground font-medium">Alasan Ingin Berjualan *</label>
              <textarea value={form.reason} onChange={e => updateForm("reason", e.target.value)} rows={4} placeholder="Ceritakan alasanmu bergabung sebagai penjual di Social Mart..." maxLength={500} className="mt-1 w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
              <p className="text-right text-[10px] text-muted-foreground">{form.reason.length}/500</p>
            </div>

            <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-foreground">Syarat & Ketentuan Penjual:</p>
              {["Minimal umur 15 tahun", "Produk yang dijual harus legal dan halal", "Tidak boleh menjual produk berbahaya/ilegal", "Wajib merespons pesanan dalam 24 jam", "JoyDev berhak menolak/menangguhkan akun penjual"].map(s => (
                <div key={s} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span className="text-xs text-muted-foreground">{s}</span>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-3">
              <button type="button" onClick={() => updateForm("agree", !form.agree)} className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-smooth ${form.agree ? "bg-primary border-primary" : "border-border"}`}>
                {form.agree && <CheckCircle size={12} className="text-primary-foreground" />}
              </button>
              <p className="text-xs text-muted-foreground">Saya menyetujui semua syarat & ketentuan penjual Social Mart dan menjamin kebenaran data yang saya berikan.</p>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="flex-1 h-12 rounded-2xl border border-border text-sm font-semibold text-foreground">Kembali</button>
              <button type="button" onClick={handleSubmit} disabled={loading || !form.agree} className="flex-1 h-12 rounded-2xl bg-primary text-primary-foreground font-bold text-sm disabled:opacity-60">
                {loading ? "Mengirim..." : "Kirim Permohonan"}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
