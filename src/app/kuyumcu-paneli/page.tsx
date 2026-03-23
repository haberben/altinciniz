import { createClient } from "@/lib/supabase-server";
import { getMarketData } from "@/lib/api";
import { redirect } from "next/navigation";
import { 
  User, 
  Settings, 
  TrendingUp, 
  MapPin, 
  Instagram, 
  Globe, 
  LogOut, 
  Store,
  Plus,
  Rocket
} from "lucide-react";
import Link from "next/link";
import { submitProfile, updateOffset } from "@/lib/actions";
import JewelerRegisterForm from "@/components/JewelerRegisterForm";

export default async function KuyumcuPaneli() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/giris");
  }

  // Get Jeweler Profile
  const { data: profile } = await supabase
    .from("jeweler_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Get Current Offsets
  const { data: offsets } = profile ? await supabase
    .from("price_offsets")
    .select("*")
    .eq("jeweler_id", profile.id) : { data: [] };

  // Get All Market Assets for selecting
  const { items: allAssets } = await getMarketData();

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#060606] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#0a0a0a] border border-[#222] p-8 rounded-3xl space-y-8 shadow-2xl border-gold-primary/20">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-gold-primary/10 rounded-2xl border border-gold-primary/20 flex items-center justify-center mx-auto">
              <Rocket className="text-gold-light" size={32} />
            </div>
            <h1 className="text-2xl font-black">Hoş Geldiniz!</h1>
            <p className="text-gray-500 text-sm">Satış yapmaya başlamak için önce mağaza profilinizi oluşturun.</p>
          </div>

          <JewelerRegisterForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060606] text-white font-sans">
      <nav className="border-b border-[#222] bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-black tracking-tighter">
              <span className="text-gold-primary">Altın</span>ciniz
            </Link>
            <div className="h-6 w-px bg-[#333]" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Yönetim Paneli</span>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            {profile?.is_admin && (
              <Link href="/admin" className="bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2">
                <Settings size={14}/> Yönetici Paneli
              </Link>
            )}
            <span className="text-xs font-bold text-gold-light hidden md:inline">{user.email}</span>
            <form action="/auth/logout" method="post">
              <button type="submit" className="bg-red-500/10 text-red-500 p-2 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/10">
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Profile Card */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-[#0a0a0a] border border-[#222] p-8 rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-primary/5 rounded-full blur-3xl" />
            <div className="space-y-2">
              <h2 className="text-xl font-black flex items-center gap-2">
                <Store className="text-gold-primary" size={20} />
                {profile.name}
              </h2>
              <div className="flex flex-wrap gap-2">
                 {profile.is_verified && (
                   <span className="text-[10px] font-black bg-gold-primary/20 text-gold-light px-2 py-0.5 rounded border border-gold-primary/20 uppercase tracking-tighter">Yildizli Kuyumcu</span>
                 )}
                 {profile.is_approved ? (
                   <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-tighter">Onayli Mağaza</span>
                 ) : (
                   <span className="text-[10px] font-black bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-tighter italic">Onay Bekliyor</span>
                 )}
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-[#222] text-sm text-gray-400">
               <div className="flex items-center gap-3"><MapPin size={14}/> <span>{profile.address}</span></div>
               <div className="flex items-center gap-3"><Instagram size={14}/> <span>{profile.instagram}</span></div>
               <div className="flex items-center gap-3"><Globe size={14}/> <span>{profile.website}</span></div>
            </div>
            <button className="w-full bg-white/5 border border-white/10 py-3 rounded-xl text-xs font-bold hover:bg-white/10 transition-all">
              Mağaza Profilini Düzenle
            </button>
          </div>
        </aside>

        {/* Offsets Section */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-gradient-to-r from-gold-primary/10 to-transparent border border-gold-primary/20 rounded-3xl p-8">
            <h3 className="text-lg font-black text-gold-light mb-2">Fiyat Farklarını (Offset) Ayarla</h3>
            <p className="text-gray-400 text-xs mb-6 max-w-lg">Canlı fiyata dilediğiniz tutarı (+) veya (-) olarak ekleyebilirsiniz. Örneğin, gr altını 150 TL kârla satmak için Satış Farkı kısmına 150 yazın.</p>
            
            <form action={updateOffset} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
              <div className="md:col-span-1">
                <select name="asset_slug" required className="w-full bg-[#111] border border-[#222] rounded-xl p-3 text-xs outline-none focus:border-gold-primary">
                  {allAssets.map(asset => (
                    <option key={asset.slug} value={asset.slug}>{asset.name}</option>
                  ))}
                </select>
              </div>
              <input type="number" step="0.01" name="buy_offset" placeholder="Alış Farkı (TL)" className="bg-[#111] border border-[#222] rounded-xl p-3 text-xs outline-none focus:border-emerald-500" />
              <input type="number" step="0.01" name="sell_offset" placeholder="Satış Farkı (TL)" className="bg-[#111] border border-[#222] rounded-xl p-3 text-xs outline-none focus:border-blue-500" />
              <button type="submit" className="bg-gold-primary text-black font-black py-3 rounded-xl text-xs">Farkı Uygula</button>
            </form>
          </div>

          <section className="space-y-4">
            <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest px-2">Aktif Ayarlarınız</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offsets && offsets.length > 0 ? offsets.map((off: any) => {
                const asset = allAssets.find(a => a.slug === off.asset_slug);
                return (
                  <div key={off.id} className="bg-[#0a0a0a] border border-[#222] p-5 rounded-2xl flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gold-primary/5 rounded-xl flex items-center justify-center border border-gold-primary/10">
                        <TrendingUp size={18} className="text-gold-light" />
                      </div>
                      <div>
                        <h5 className="font-bold text-sm">{asset?.name || off.asset_slug}</h5>
                        <p className="text-[10px] text-gray-600 font-bold uppercase">Düzenle</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-xs font-black text-emerald-500">Alış: {off.buy_offset > 0 ? '+' : ''}{off.buy_offset} ₺</div>
                      <div className="text-xs font-black text-blue-500">Satış: {off.sell_offset > 0 ? '+' : ''}{off.sell_offset} ₺</div>
                    </div>
                  </div>
                );
              }) : (
                <div className="md:col-span-2 text-center py-10 bg-[#0a0a0a] border border-dashed border-[#222] rounded-3xl text-gray-600 text-sm italic">
                  Henüz özel fiyat ayarı eklemediniz.
                </div>
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
