"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Loader2, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    const supabase = createBrowserClient(supabaseUrl, supabaseKey);

    if (isRegister) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Kayıt başarılı! E-postanızı kontrol edin veya giriş yapın.");
        setIsRegister(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("Giriş başarısız. Bilgilerinizi kontrol edin.");
      } else {
        router.push("/kuyumcu-paneli");
        router.refresh();
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#060606] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md space-y-8 bg-[#0a0a0a] border border-[#222] p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold-primary/10 rounded-full blur-[80px]" />
        
        <div className="text-center space-y-2 relative z-10">
          <div className="flex justify-center mb-4">
            <div className="bg-gold-primary/10 p-4 rounded-2xl border border-gold-primary/20">
              <ShieldCheck size={32} className="text-gold-light" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
            {isRegister ? "Kuyumcu Kaydi" : "Kuyumcu Girişi"}
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            {isRegister ? "Platforma katılmak için hesap oluşturun" : "Panelinize erişmek için bilgilerinizi girin"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] pl-1">E-Posta Adresi</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-700" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-4 text-white focus:border-gold-primary outline-none transition-all placeholder:text-gray-800"
                placeholder="isletme@altinciniz.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] pl-1">Güvenli Şifre</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-700" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-4 text-white focus:border-gold-primary outline-none transition-all placeholder:text-gray-800"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-[11px] font-bold bg-red-500/5 p-4 rounded-2xl border border-red-500/10 text-center uppercase tracking-tighter italic">{error}</div>}
          {success && <div className="text-emerald-500 text-[11px] font-bold bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10 text-center uppercase tracking-tighter italic">{success}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gold-primary hover:scale-[1.02] text-black font-black py-5 rounded-2xl transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3 uppercase italic tracking-widest text-sm"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isRegister ? "HESABI OLUŞTUR" : "GİRİŞ YAP")}
          </button>
        </form>

        <div className="text-center relative z-10 space-y-4">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-gold-primary hover:text-white text-xs font-black uppercase tracking-tighter transition-colors italic"
          >
            {isRegister ? "Zaten hesabınız var mı? Giriş Yapın" : "Yeni işletme hesabı oluşturun"}
          </button>
          <div className="pt-4 border-t border-white/5">
            <Link href="/" className="text-gray-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors tracking-widest">← ANA SAYFA</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
