"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { ShieldAlert, Loader2, Mail, Lock, ArrowRight } from "lucide-react";

export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError("Giriş başarısız. Lütfen yetkili bilgilerinizi kontrol edin.");
      setLoading(false);
    } else {
      router.refresh(); // Refresh to trigger server-side admin check in page.tsx
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] animate-pulse" />
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-primary/10 rounded-full blur-[120px] animate-pulse duration-5000" />
      </div>

      <div className="w-full max-w-lg bg-[#0a0a0a] border border-white/5 p-12 rounded-[48px] shadow-2xl relative z-10 backdrop-blur-3xl">
        <header className="text-center space-y-4 mb-10">
           <div className="bg-red-500/10 p-5 rounded-3xl border border-red-500/20 inline-block">
              <ShieldAlert size={40} className="text-red-500" />
           </div>
           <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
             PLATFORM <span className="text-red-500">ADMIN</span>
           </h1>
           <p className="text-gray-500 text-xs font-black uppercase tracking-[0.3em] opacity-50">Güvenli Erişim Paneli</p>
        </header>

        <form onSubmit={handleLogin} className="space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest pl-2">Yönetici E-Posta</label>
              <div className="relative">
                 <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700" size={20} />
                 <input 
                   type="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   required
                   placeholder="admin@altinciniz.com"
                   className="w-full bg-black/60 border border-white/5 py-5 pl-16 pr-6 rounded-2xl text-white outline-none focus:border-red-500/50 transition-all font-medium text-lg placeholder:text-gray-800"
                 />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest pl-2">Parametre Şifresi</label>
              <div className="relative">
                 <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700" size={20} />
                 <input 
                   type="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   required
                   placeholder="••••••••"
                   className="w-full bg-black/60 border border-white/5 py-5 pl-16 pr-6 rounded-2xl text-white outline-none focus:border-red-500/50 transition-all font-medium text-lg placeholder:text-gray-800"
                 />
              </div>
           </div>

           {error && (
             <div className="bg-red-500/5 border border-red-500/10 p-5 rounded-2xl text-red-500 text-xs font-bold text-center uppercase italic tracking-tighter">
               {error}
             </div>
           )}

           <button 
             disabled={loading}
             className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-6 rounded-2xl transition-all flex items-center justify-center gap-3 uppercase italic tracking-widest text-sm shadow-xl shadow-red-500/10 active:scale-95 disabled:opacity-50"
           >
             {loading ? <Loader2 className="animate-spin" size={24} /> : (
               <>
                 YÖNETİCİ GİRİŞİ YAP <ArrowRight size={20} />
               </>
             )}
           </button>
        </form>

        <div className="mt-8 text-center pt-8 border-t border-white/5">
           <a href="/" className="text-gray-600 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest italic">← KAMUYA AÇIK ALAN</a>
        </div>
      </div>
    </div>
  );
}
