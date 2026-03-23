import { createClient } from "@/lib/supabase-server";
import { 
  Users, 
  Star, 
  Settings,
  Store,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { approveJeweler, toggleVIP, ensureAdminProfile } from "@/lib/actions";
import AdminLoginForm from "@/components/AdminLoginForm";

export default async function AdminPanel() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <AdminLoginForm />;

  // Admin Check: maybeSingle()
  let { data: profile } = await supabase
    .from("jeweler_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  // Master Admin Auto-Provisioning
  const masterEmail = "ibrahmyldrim@gmail.com";
  if (!profile && user.email?.toLowerCase() === masterEmail.toLowerCase()) {
      profile = await ensureAdminProfile(user.id, user.email);
  }

  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-[#0a0a0a] border border-white/5 p-12 rounded-[48px] shadow-2xl space-y-8">
             <div className="bg-red-500/10 p-6 rounded-full inline-block border border-red-500/20">
                <ShieldAlert size={48} className="text-red-500" />
             </div>
             <div className="space-y-4">
                <h1 className="text-4xl font-black italic uppercase tracking-tighter">ERIŞIM REDDEDILDI</h1>
                <p className="text-gray-500 text-sm leading-relaxed">Bu alan sadece sistem yöneticileri içindir. Giriş yaptığınız hesap yetkili değildir.</p>
             </div>
             <div className="pt-6 space-y-4">
                <Link href="/" className="block w-full bg-white/5 border border-white/10 px-8 py-4 rounded-2xl text-xs font-bold hover:bg-white/10 transition-all uppercase tracking-widest">
                  Ana Sayfaya Dön
                </Link>
                <form action="/auth/logout" method="post">
                   <button type="submit" className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em] hover:text-red-400 transition-colors">
                      FARKLI HESAPLA GIRIŞ YAP
                   </button>
                </form>
             </div>
        </div>
      </div>
    );
  }

  // Fetch all jewelers
  const { data: allJewelers } = await supabase
    .from("jeweler_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <nav className="border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
           <div className="flex items-center gap-6">
              <Link href="/" className="text-xl font-black tracking-tighter uppercase italic text-gold-primary">
                 ALTINCINIZ ADMIN
              </Link>
              <div className="h-6 w-px bg-white/10" />
              <div className="flex items-center gap-2 text-gold-light text-[10px] font-black tracking-[0.2em] uppercase">
                 <Users size={16}/> Kuyumcu Denetimi
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Yönetici Modu</p>
                <p className="text-xs font-bold text-gray-500">{user.email}</p>
              </div>
              <Link href="/kuyumcu-paneli" className="bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10 transition-all">
                <Settings size={18} className="text-gray-400" />
              </Link>
           </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-10 space-y-12 pb-32">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
           <div className="space-y-4">
              <h2 className="text-5xl font-black tracking-tighter italic uppercase leading-none">MAĞAZALAR</h2>
              <p className="text-gray-500 text-sm max-w-lg italic">
                 Sisteme kayıtlı tüm kuyumcuları buradan yönetebilir, borsa fiyatlarına ekledikleri farkları denetleyebilirsiniz.
              </p>
           </div>
           <div className="flex gap-4">
              <div className="bg-[#0a0a0a] border border-white/5 px-8 py-4 rounded-3xl text-center">
                 <p className="text-[10px] font-black text-gray-600 uppercase">Toplam Mağaza</p>
                 <p className="text-2xl font-black tracking-tighter text-gold-primary">{allJewelers?.length || 0}</p>
              </div>
              <div className="bg-[#0a0a0a] border border-white/5 px-8 py-4 rounded-3xl text-center">
                 <p className="text-[10px] font-black text-gray-600 uppercase">Onay Bekleyen</p>
                 <p className="text-2xl font-black tracking-tighter text-amber-500">{allJewelers?.filter(j => !j.is_approved).length || 0}</p>
              </div>
           </div>
        </header>

        <section className="grid grid-cols-1 gap-4">
            {allJewelers?.map(jeweler => (
              <div key={jeweler.id} className="bg-[#0a0a0a] border border-white/5 rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-gold-primary/20 transition-all group">
                <div className="flex items-center gap-6 flex-1">
                   <div className="w-20 s-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 group-hover:border-gold-primary/30 transition-all relative overflow-hidden">
                      {jeweler.logo_url ? <img src={jeweler.logo_url} className="w-full h-full object-cover" /> : <Store size={32} className="text-gold-primary opacity-40" />}
                      {jeweler.is_admin && <div className="absolute top-0 right-0 bg-emerald-500 w-3 h-3 rounded-full border-2 border-black" title="Admin Account" />}
                   </div>
                   <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-black tracking-tight uppercase">{jeweler.name}</h3>
                        {jeweler.is_verified && <Star size={16} fill="#D4AF37" className="text-gold-primary" />}
                      </div>
                      <p className="text-xs font-bold text-gray-500 tracking-widest uppercase italic">@{jeweler.slug}</p>
                      <p className="text-[10px] text-gray-600 line-clamp-1 mt-2">{jeweler.address}</p>
                   </div>
                </div>

                <div className="flex items-center gap-10">
                   <div className="text-center space-y-1">
                      <p className="text-[10px] font-black text-gray-600 uppercase">Durum</p>
                      {jeweler.is_approved ? (
                        <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase italic bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/10"> Onaylı</div>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase italic bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/10"> Bekliyor</div>
                      )}
                   </div>

                   <div className="flex items-center gap-3">
                      <form action={async () => { "use server"; await approveJeweler(jeweler.id, !jeweler.is_approved); }}>
                         <button className={`h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${jeweler.is_approved ? 'bg-red-500/5 text-red-500 border border-red-500/10 hover:bg-red-500 hover:text-white' : 'bg-emerald-500 text-black hover:scale-105 shadow-lg shadow-emerald-500/20'}`}>
                            {jeweler.is_approved ? "ONAYI KALDIR" : "ONAYLA"}
                         </button>
                      </form>
                      
                      <form action={async () => { "use server"; await toggleVIP(jeweler.id, !jeweler.is_verified); }}>
                         <button className={`h-14 w-14 flex items-center justify-center rounded-2xl border transition-all ${jeweler.is_verified ? 'bg-gold-primary/10 border-gold-primary text-gold-primary' : 'bg-white/5 border-white/5 text-gray-600 hover:border-gold-primary/30'}`}>
                            <Star size={20} fill={jeweler.is_verified ? "currentColor" : "none"} />
                         </button>
                      </form>
                   </div>
                </div>
              </div>
            ))}
        </section>
      </main>
    </div>
  );
}
