import { createClient } from "@/lib/supabase-server";
import { 
  Users, 
  Star, 
  Home,
  Store,
  ShieldAlert,
  Phone,
  Video,
  MapPin,
  Instagram,
  Globe,
  Plus,
  ArrowRight,
  ChevronDown,
  Save,
  Trash
} from "lucide-react";
import Link from "next/link";
import { approveJeweler, toggleVIP, ensureAdminProfile, updateJewelerAdmin, createJewelerAdmin, submitProfile } from "@/lib/actions";
import AdminLoginForm from "@/components/AdminLoginForm";
import AdminCreateStoreForm from "@/components/AdminCreateStoreForm";

/**
 * ADMIN PANEL - PROFESYONEL YÖNETİM SİSTEMİ
 */
export default async function AdminPanel() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <AdminLoginForm />;

  let { data: profile } = await supabase
    .from("jeweler_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const masterEmail = "ibrahmyldrim@gmail.com";
  const isMasterAdmin = user.email?.toLowerCase() === masterEmail.toLowerCase();
  let hasAccess = profile?.is_admin || isMasterAdmin;

  if (isMasterAdmin && !profile?.is_admin) {
      profile = await ensureAdminProfile(user.id, user.email!);
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-[#0a0a0a] border border-white/5 p-12 rounded-[48px] shadow-2xl space-y-8">
             <div className="bg-red-500/10 p-6 rounded-full inline-block border border-red-500/20">
                <ShieldAlert size={48} className="text-red-500" />
             </div>
             <div className="space-y-4">
                <h1 className="text-4xl font-black italic uppercase tracking-tighter">ERİŞİM ENGELLENDİ</h1>
                <p className="text-gray-500 text-sm leading-relaxed">Admin yetkiniz bulunmamaktadır. Lütfen doğru hesapla giriş yapın.</p>
             </div>
             <div className="pt-6">
                <form action="/auth/logout" method="post">
                   <button type="submit" className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl text-xs font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-red-500">
                      OTURUMU KAPAT
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
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#060606] text-white selection:bg-gold-primary selection:text-black">
      {/* NAVBAR */}
      <nav className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
           <div className="flex items-center gap-6">
              <Link href="/" className="text-xl font-black tracking-tighter uppercase italic text-gold-primary flex items-center gap-2">
                 <ShieldAlert size={24} className="text-gold-primary" />
                 ALTINCINIZ ADMIN
              </Link>
           </div>
           <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">YÜKSEK YETKİLİ MOD</p>
                <p className="text-xs font-bold text-gray-500">{user.email}</p>
              </div>
              <Link href="/" className="bg-white/5 border border-white/10 p-3 rounded-2xl hover:bg-white/10 transition-all text-gray-400 hover:text-white group">
                <Home size={20} className="group-hover:scale-110 transition-transform" />
              </Link>
           </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-12 space-y-16 pb-64">
        {/* HEADER */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-white/5 pb-12">
           <div className="space-y-6">
              <div className="inline-flex items-center gap-3 bg-gold-primary/10 px-4 py-2 rounded-full border border-gold-primary/20">
                 <span className="w-2 h-2 bg-gold-primary rounded-full animate-pulse" />
                 <span className="text-[10px] font-black text-gold-primary uppercase tracking-widest">Kontrol Paneli</span>
              </div>
              <h2 className="text-6xl font-black tracking-tighter italic uppercase leading-[0.9]">MAĞAZA<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-gold-light">YÖNETİMİ</span></h2>
              <p className="text-gray-500 text-sm max-w-lg italic font-medium leading-relaxed">
                 Tüm kuyumcuların verilerini düzenleyebilir, iletişim bilgilerini güncelleyebilir ve VIP sıralamasını manuel olarak belirleyebilirsiniz.
              </p>
           </div>
           
           <div className="flex flex-wrap gap-4">
              <div className="bg-[#0a0a0a] border border-white/5 px-10 py-6 rounded-[32px] shadow-2xl min-w-[160px]">
                 <p className="text-[10px] font-black text-gray-600 uppercase mb-2">Toplam Kayıt</p>
                 <p className="text-4xl font-black tracking-tighter text-gold-primary">{allJewelers?.length || 0}</p>
              </div>
              <div className="bg-[#0a0a0a] border border-white/5 px-10 py-6 rounded-[32px] shadow-2xl min-w-[160px]">
                 <p className="text-[10px] font-black text-gray-600 uppercase mb-2">Bekleyen Onay</p>
                 <p className="text-4xl font-black tracking-tighter text-amber-500">{allJewelers?.filter(j => !j.is_approved).length || 0}</p>
              </div>
           </div>
        </header>

        {/* JEWELER LIST & EDITING */}
        <section className="space-y-6">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-600 flex items-center gap-3">
                 <Users size={16}/> Mevcut Mağazalar
              </h3>
              <div className="h-px flex-1 bg-white/5 mx-6" />
           </div>

           <div className="grid grid-cols-1 gap-6">
              {allJewelers?.map(jeweler => (
                <div key={jeweler.id} className="bg-[#0a0a0a] border border-white/5 rounded-[40px] overflow-hidden group hover:border-gold-primary/20 transition-all shadow-xl">
                  {/* Top Bar (Summary) */}
                  <div className="p-8 flex flex-col lg:flex-row items-center justify-between gap-8 border-b border-white/5">
                    <div className="flex items-center gap-6 flex-1">
                      <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 relative overflow-hidden group-hover:bg-gold-primary/5 transition-colors">
                        {jeweler.logo_url ? <img src={jeweler.logo_url} className="w-full h-full object-cover" /> : <Store size={32} className="text-gold-primary opacity-30" />}
                        {jeweler.is_admin && <div className="absolute top-0 right-0 bg-emerald-500 w-3 h-3 rounded-full border-2 border-black" />}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h4 className="text-2xl font-black italic uppercase tracking-tighter">{jeweler.name}</h4>
                          {jeweler.is_verified && <Star size={16} fill="#D4AF37" className="text-gold-primary" />}
                        </div>
                        <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase italic">@{jeweler.slug}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-12 w-full lg:w-auto">
                        <div className="text-center">
                           <p className="text-[9px] font-black text-gray-600 uppercase mb-1">Onay</p>
                           <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${jeweler.is_approved ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                              {jeweler.is_approved ? 'AKTİF' : 'BEKLEMEDE'}
                           </span>
                        </div>
                        <div className="text-center">
                           <p className="text-[9px] font-black text-gray-600 uppercase mb-1">Sıra</p>
                           <p className="text-xl font-black text-gold-primary italic">#{jeweler.sort_order || 0}</p>
                        </div>
                        <div className="flex gap-2">
                           <button className="h-14 px-8 rounded-2xl bg-white/5 border border-white/10 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                              Detayları Düzenle <ChevronDown size={14} className="opacity-40" />
                           </button>
                        </div>
                    </div>
                  </div>

                  {/* Expanded Edit Form */}
                  <div className="bg-[#050505] p-10 lg:p-14 border-t border-white/5">
                     <form action={updateJewelerAdmin} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-12">
                        <input type="hidden" name="id" value={jeweler.id} />
                        
                        <div className="space-y-8 col-span-1 md:col-span-2 lg:col-span-3 pb-6 border-b border-white/5">
                           <h5 className="text-xs font-black uppercase tracking-[0.4em] text-emerald-500">Profil Verilerini Güncelle</h5>
                        </div>

                        {/* General Info */}
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Mağaza Adı</label>
                           <input name="name" defaultValue={jeweler.name} className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 outline-none focus:border-gold-primary transition-all font-bold text-sm" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Adres</label>
                           <input name="address" defaultValue={jeweler.address} className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 outline-none focus:border-gold-primary transition-all font-bold text-sm" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Sıralama (VIP İçin)</label>
                           <input name="sort_order" type="number" defaultValue={jeweler.sort_order || 0} className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 outline-none focus:border-gold-primary transition-all font-bold text-sm" />
                        </div>

                        {/* Contact & Social */}
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Phone size={12}/> Telefon</label>
                           <input name="phone" defaultValue={jeweler.phone} placeholder="+90 ..." className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 outline-none focus:border-gold-primary transition-all font-bold text-sm" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Instagram size={12}/> Instagram @</label>
                           <input name="instagram" defaultValue={jeweler.instagram} placeholder="kuyumcu_hesabi" className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 outline-none focus:border-gold-primary transition-all font-bold text-sm" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Globe size={12}/> Web Sitesi</label>
                           <input name="website" defaultValue={jeweler.website} placeholder="www.kuyumcu.com" className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 outline-none focus:border-gold-primary transition-all font-bold text-sm" />
                        </div>

                        {/* Location & Desc */}
                        <div className="space-y-2 col-span-1 md:col-span-2">
                           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2"><MapPin size={12}/> Harita URL (Google Maps)</label>
                           <input name="map_url" defaultValue={jeweler.map_url} className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 outline-none focus:border-gold-primary transition-all font-bold text-sm" />
                        </div>
                        <div className="space-y-2 col-span-1 md:col-span-2">
                           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Açıklama</label>
                           <textarea name="description" defaultValue={jeweler.description} className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-6 outline-none focus:border-gold-primary transition-all font-medium text-sm resize-none" />
                        </div>

                        {/* Toggles */}
                        <div className="flex items-center gap-8 py-4">
                           <label className="flex items-center gap-3 cursor-pointer group">
                              <input type="checkbox" name="is_approved" defaultChecked={jeweler.is_approved} className="w-6 h-6 rounded-lg bg-white/5 border-white/10 checked:bg-emerald-500 transition-all cursor-pointer" />
                              <span className="text-xs font-black uppercase text-gray-400 group-hover:text-white transition-colors">Mağaza Onaylı</span>
                           </label>
                           <label className="flex items-center gap-3 cursor-pointer group">
                              <input type="checkbox" name="is_verified" defaultChecked={jeweler.is_verified} className="w-6 h-6 rounded-lg bg-white/5 border-white/10 checked:bg-gold-primary transition-all cursor-pointer" />
                              <span className="text-xs font-black uppercase text-gray-400 group-hover:text-white transition-colors">VIP / Yıldız</span>
                           </label>
                        </div>

                        <div className="col-span-1 md:col-span-2 lg:col-span-3 pt-6">
                           <button type="submit" className="w-full lg:w-auto h-16 px-12 bg-white text-black rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-gold-primary transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-gold-primary/20 group">
                              <Save size={18} className="group-hover:scale-110 transition-transform"/> KAYDET VE GÜNCELLE
                           </button>
                        </div>
                     </form>
                  </div>
                </div>
              ))}
           </div>
        </section>

        {/* ADMIN CREATE SECTION */}
        <section className="bg-[#0a0a0a] border border-white/5 rounded-[48px] p-12 lg:p-20 relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
              <Plus size={300} className="text-gold-primary" />
           </div>
           
           <div className="relative z-10 space-y-12">
              <div className="space-y-4">
                 <h3 className="text-4xl font-black italic uppercase tracking-tighter">YENİ MAĞAZA EKLE</h3>
                 <p className="text-gray-500 text-sm max-w-sm italic">Sisteme manuel olarak yeni bir kuyumcu kaydı girişi yapın.</p>
              </div>

               <AdminCreateStoreForm />
           </div>
        </section>
      </main>
    </div>
  );
}
