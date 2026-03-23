"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Loader2, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  const supabase = createBrowserClient(supabaseUrl, supabaseKey);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Giriş başarısız. Bilgilerinizi kontrol edin.");
      setLoading(false);
    } else {
      router.push("/kuyumcu-paneli");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#060606] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 bg-[#0a0a0a] border border-[#222] p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold-primary/10 rounded-full blur-[80px]" />
        
        <div className="text-center space-y-2 relative z-10">
          <div className="flex justify-center mb-4">
            <div className="bg-gold-primary/10 p-4 rounded-2xl border border-gold-primary/20">
              <ShieldCheck size={32} className="text-gold-light" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Kuyumcu Girişi</h1>
          <p className="text-gray-500 text-sm">Panelinize erişmek için bilgilerinizi girin.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">E-Posta</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black border border-[#333] rounded-xl py-3 pl-12 pr-4 text-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all"
                placeholder="ornek@kuyumcu.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black border border-[#333] rounded-xl py-3 pl-12 pr-4 text-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-center font-medium">{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gold-primary hover:bg-gold-light text-black font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Giriş Yap"}
          </button>
        </form>

        <div className="text-center relative z-10">
          <Link href="/" className="text-gray-600 hover:text-gray-400 text-xs font-medium transition-colors">Ana Sayfa'ya Dön</Link>
        </div>
      </div>
    </div>
  );
}
