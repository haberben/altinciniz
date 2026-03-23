import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Star, 
  Clock, 
  ArrowLeft,
  Settings,
  Store 
} from "lucide-react";
import Link from "next/link";
import { approveJeweler, toggleVIP } from "@/lib/actions";

export default async function AdminPanel() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/giris");

  // Admin Check
  const { data: profile } = await supabase
    .from("jeweler_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
             <h1 className="text-4xl font-black">YETKİSİZ ERİŞİM</h1>
             <p className="text-gray-500">Bu sayfaya sadece adminler girebilir.</p>
             <Link href="/" className="text-gold-primary font-bold">Ana Sayfaya Dön</Link>
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
              <Link href="/" className="text-xl font-black tracking-tighter uppercase italic">
                 <span className="text-gold-primary">PLATFORM</span> ADMIN
              </Link>
              <div className="h-6 w-px bg-white/10" />
              <div className="flex items-center gap-2 text-gold-light text-xs font-bold tracking-widest uppercase">
                 <Users size={16}/> Kuyumcu Yönetimi
              </div>
           </div>
           <Link href="/kuyumcu-paneli" className="text-xs font-bold text-gray-500 hover:text-white flex items-center gap-2">
              <ArrowLeft size={14}/> Kendi Panelime Dön
           </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-10 space-y-12">
        <header className="space-y-4">
           <h2 className="text-4xl font-black tracking-tighter italic uppercase">Kuyumcu Onayları & Moderasyon</h2>
           <p className="text-gray-500 max-w-2xl bg-white/5 p-4 rounded-2xl border border-white/5 italic">
              Buradan kayıt olan kuyumcuları inceleyebilir, onları sistemde onaylayabilir veya Yıldız (VIP) verebilirsiniz.
           </p>
        </header>

        <section className="bg-[#0a0a0a] border border-white/5 rounded-[40px] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black uppercase text-gray-600 tracking-widest">
                <th className="p-8">Kuyumcu Bilgisi</th>
                <th className="p-8 text-center">Durum</th>
                <th className="p-8 text-center">Admin Onayı</th>
                <th className="p-8 text-center">Vip / Yıldız</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {allJewelers?.map(jeweler => (
                <tr key={jeweler.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                          {jeweler.is_admin ? <Settings className="text-emerald-500" /> : <Store className="text-gold-primary" />}
                       </div>
                       <div>
                          <p className="font-bold text-lg leading-none">{jeweler.name}</p>
                          <p className="text-xs text-gray-600 mt-1 uppercase font-bold tracking-tighter">@{jeweler.slug}</p>
                       </div>
                    </div>
                  </td>
                  <td className="p-8 text-center">
                    {jeweler.is_approved ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/10 uppercase italic">Onayli</span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-500 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/10 uppercase italic">Onay Bekliyor</span>
                    )}
                  </td>
                  <td className="p-8">
                    <div className="flex justify-center">
                      <form action={async () => { "use server"; await approveJeweler(jeweler.id, !jeweler.is_approved); }}>
                        <button className={`p-4 rounded-2xl transition-all ${jeweler.is_approved ? 'bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}>
                           {jeweler.is_approved ? <XCircle size={20}/> : <CheckCircle2 size={20}/>}
                        </button>
                      </form>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex justify-center">
                      <form action={async () => { "use server"; await toggleVIP(jeweler.id, !jeweler.is_verified); }}>
                        <button className={`p-4 rounded-2xl transition-all ${jeweler.is_verified ? 'bg-gold-primary text-black' : 'bg-white/5 text-gray-600 hover:text-gold-primary border border-transparent hover:border-gold-primary/20'}`}>
                           <Star size={20} fill={jeweler.is_verified ? "currentColor" : "none"} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
