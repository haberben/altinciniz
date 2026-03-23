import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { 
  User, 
  Settings, 
  TrendingUp, 
  MapPin, 
  Instagram, 
  Globe, 
  LogOut, 
  ChevronRight, 
  Store 
} from "lucide-react";
import Link from "next/link";

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

  return (
    <div className="min-h-screen bg-[#060606] text-white font-sans">
      {/* Sidebar / Header Navigation */}
      <nav className="border-b border-[#222] bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-black tracking-tighter">
              <span className="text-gold-primary">Altın</span>ciniz
            </Link>
            <div className="h-6 w-px bg-[#333]" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              Yönetim Paneli
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 text-sm font-medium text-gray-300">
              <div className="w-8 h-8 rounded-full bg-gold-primary/20 border border-gold-primary/30 flex items-center justify-center">
                <User size={16} className="text-gold-light" />
              </div>
              <span className="hidden md:inline">{user.email}</span>
            </div>
            <form action="/auth/logout" method="post">
              <button 
                type="submit"
                className="text-gray-500 hover:text-red-400 transition-colors p-2 rounded-xl hover:bg-red-500/5 border border-transparent hover:border-red-500/10"
              >
                <LogOut size={20} />
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Menu & Stats Summary */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-[#111] to-black border border-[#222] p-8 rounded-3xl shadow-xl space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <Store className="text-gold-primary" size={24} />
                {profile?.name || "Kuyumcu Bilgileri"}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">Profiliniz şu an aktif. Müşterileriniz aşağıdaki bilgileri görüyor.</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#222]">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <MapPin size={16} />
                <span>{profile?.address || "Adres Tanımlanmadı"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Instagram size={16} />
                <span>{profile?.instagram || "@instagram"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Globe size={16} />
                <span>{profile?.website || "www.siteniz.com"}</span>
              </div>
            </div>

            <button className="w-full bg-[#111] hover:bg-gold-primary hover:text-black border border-[#333] hover:border-gold-primary py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
              <Settings size={16} />
              Mağaza Bilgilerini Düzenle
            </button>
          </div>
        </aside>

        {/* Right Col: Price Management Widgets */}
        <div className="lg:col-span-8 space-y-8 text-white">
          
          {/* Action Hero Card */}
          <div className="bg-gold-primary/5 border border-gold-primary/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-primary/10 rounded-full blur-[80px]" />
            <div className="space-y-2 relative z-10">
              <h3 className="text-xl font-black text-gold-light">Fiyat Farklarını Ayarla (Offsets)</h3>
              <p className="text-gray-400 text-sm max-w-md">Canlı HaremAltın fiyatlarının üzerine ne kadar kâr eklemek istediğinizi buradan yönetin. Tüm sitemizde sizin profilinizde bu fiyatlar gözükür.</p>
            </div>
            <button className="bg-gold-primary text-black px-8 py-4 rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-transform shrink-0 relative z-10">
              Yeni Offset Ekle
            </button>
          </div>

          {/* Quick List of Current Offsets */}
          <section className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-500 pl-2">Aktif Fiyat Ayarlarınız</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0a0a0a] border border-[#222] p-6 rounded-2xl flex justify-between items-center group hover:border-[#333] transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                    <TrendingUp size={20} className="text-emerald-500" />
                  </div>
                  <div>
                    <h5 className="font-bold">Gram Altın</h5>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">Satiş Farksiz</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-emerald-500">+125.00 ₺</div>
                  <ChevronRight size={16} className="text-gray-700 ml-auto group-hover:text-gold-primary transition-colors mt-1" />
                </div>
              </div>

              <div className="bg-[#0a0a0a] border border-[#222] p-6 rounded-2xl flex justify-between items-center group hover:border-[#333] transition-all opacity-50 grayscale cursor-not-allowed">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                    <TrendingUp size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <h5 className="font-bold">Dolar (USD)</h5>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">İşlem Yok</p>
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-700">Eklenmedi</div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
