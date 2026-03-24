import { createClient } from "@/lib/supabase-server";
import { getMarketData } from "@/lib/api";
import { notFound } from "next/navigation";
import { 
  MapPin, 
  Instagram, 
  Globe, 
  Phone, 
  TrendingUp, 
  TrendingDown,
  Info,
  Store 
} from "lucide-react";
import Link from "next/link";

export default async function KuyumcuProfili({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  
  // 1. Fetch Jeweler
  const { data: profile } = await supabase
    .from("jeweler_profiles")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!profile) notFound();

  // 2. Fetch Offsets
  const { data: offsets } = await supabase
    .from("price_offsets")
    .select("*")
    .eq("jeweler_id", profile.id);

  // 3. Fetch Live Market Data
  const { items: rawMarketData } = await getMarketData();

  // 4. Apply Offsets to Market Data
  const customMarketData = rawMarketData.map(item => {
    const offset = offsets?.find(o => o.asset_slug === item.slug);
    if (offset) {
      // Fixed price mode: overrides market entirely
      const fixedSell = offset.fixed_sell_price != null ? parseFloat(offset.fixed_sell_price as any) : null;
      const fixedBuy  = offset.fixed_buy_price  != null ? parseFloat(offset.fixed_buy_price  as any) : null;

      if (fixedSell != null || fixedBuy != null) {
        return {
          ...item,
          priceBuying:  fixedBuy  ?? item.priceBuying,
          priceSelling: fixedSell ?? item.priceSelling,
          isCustom: true,
          isFixed: true,
        };
      }

      // Offset mode: enforce minimum sell offset floor
      const minSellOffset = parseFloat(offset.min_sell_offset as any) || 0;
      let sellOffset = parseFloat(offset.sell_offset as any) || 0;
      if (sellOffset < minSellOffset) sellOffset = minSellOffset;

      const buyOffset = parseFloat(offset.buy_offset as any) || 0;

      return {
        ...item,
        priceBuying:  item.priceBuying  + buyOffset,
        priceSelling: item.priceSelling + sellOffset,
        isCustom: true,
        isFixed: false,
      };
    }
    return { ...item, isCustom: false, isFixed: false };
  });


  // Only show the page if approved OR if the current user is the owner/admin
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  const isOwner = currentUser?.id === profile.user_id;
  
  if (!profile.is_approved && !isOwner) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
             <h1 className="text-2xl font-black italic uppercase">Profil Henüz Onaylanmadı</h1>
             <p className="text-gray-500 text-sm">Bu kuyumcu profili yönetici onayı beklemektedir.</p>
             <Link href="/" className="text-gold-primary font-bold text-xs">Ana Sayfaya Dön</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      {/* Premium Header / Hero */}
      <div className="bg-[#0a0a0a] border-b border-[#222] py-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-primary/10 rounded-full blur-[120px]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-6 text-center md:text-left max-w-2xl">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-gold-primary/10 text-gold-light px-3 py-1 rounded-full border border-gold-primary/20 text-xs font-black uppercase tracking-widest">
                Onaylanmiş Kuyumcu
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none italic uppercase">
                {profile.name}
              </h1>
            </div>
            
            <p className="text-gray-400 text-lg leading-relaxed">{profile.description || `${profile.name} mağazasının canlı altın ve döviz fiyatları. Kapalıçarşı verilerine dayalı özel fiyatlandırma.`}</p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-gray-400">
               <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5"><MapPin size={16} className="text-gold-primary"/> {profile.address}</div>
               {profile.instagram && (
                 <a href={`https://instagram.com/${profile.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:border-gold-primary/30 transition-all">
                   <Instagram size={16} className="text-gold-primary"/> @{profile.instagram.replace('@', '')}
                 </a>
               )}
               {profile.phone && (
                 <a href={`tel:${profile.phone}`} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:border-gold-primary/30 transition-all">
                   <Phone size={16} className="text-gold-primary"/> {profile.phone}
                 </a>
               )}
               {profile.website && (
                 <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:border-gold-primary/30 transition-all">
                   <Globe size={16} className="text-gold-primary"/> Web Sitesi
                 </a>
               )}
            </div>
          </div>

          <div className="shrink-0 w-64 h-64 bg-gradient-to-br from-gold-primary/20 to-black border border-gold-primary/30 rounded-[40px] flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.15)] relative group cursor-pointer">
             {profile.logo_url ? <img src={profile.logo_url} alt={profile.name} className="w-full h-full object-cover rounded-[40px]" /> : <Store size={80} className="text-gold-primary opacity-50 group-hover:scale-110 transition-transform"/>}
             <div className="absolute -bottom-4 bg-gold-primary text-black px-6 py-2 rounded-xl font-bold text-xs shadow-xl tracking-tighter uppercase">Kuyumcu</div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-16 px-6 space-y-12">
        
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">GÜNCEL FİYAT LİSTESİ</h2>
            <div className="hidden md:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5 text-[10px] font-bold text-gray-500 uppercase">
                <Info size={14}/> Fiyatlar Canlıdır (HaremAPI + {profile.name} Farkı)
            </div>
        </div>

        {/* Custom Price Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customMarketData.filter(i => i.isCustom).map(item => (
            <div key={item.slug} className="bg-[#0a0a0a] border border-gold-primary/30 p-8 rounded-[32px] hover:border-gold-primary transition-all group relative">
               <div className="flex items-center justify-between mb-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-gold-primary uppercase tracking-[0.2em]">Özel Fiyat</span>
                    <h3 className="text-xl font-black tracking-tighter">{item.name}</h3>
                  </div>
                  <div className="bg-gold-primary/10 p-3 rounded-2xl group-hover:bg-gold-primary/20 transition-colors">
                    <TrendingUp size={24} className="text-gold-light" />
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-600 uppercase">Aliş</p>
                    <p className="text-2xl font-black tracking-tight">{item.priceBuying.toLocaleString("tr-TR")} ₺</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-bold text-gray-600 uppercase">Satiş</p>
                    <p className="text-2xl font-black tracking-tight text-gold-light">{item.priceSelling.toLocaleString("tr-TR")} ₺</p>
                  </div>
               </div>

               <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500 italic">Son Güncelleme: Anlık</span>
                  <Link href={`/${item.slug}`} className="text-[10px] font-black text-gray-400 hover:text-white uppercase tracking-tighter">İstatistik Gör</Link>
               </div>
            </div>
          ))}

          {/* Regular Prices that don't have offsets for this jeweler */}
          {customMarketData.filter(i => !i.isCustom).slice(0, 3).map(item => (
            <div key={item.slug} className="bg-[#0a0a0a] border border-[#222] p-8 rounded-[32px] opacity-60 hover:opacity-100 transition-opacity">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-md font-bold text-gray-400">{item.name}</h3>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-600 uppercase">Satiş</p>
                    <p className="text-xl font-black">{item.priceSelling.toLocaleString("tr-TR")} ₺</p>
                  </div>
               </div>
            </div>
          ))}
        </div>

        {/* Footer Contact */}
        <div className="bg-gold-primary/5 border border-gold-primary/20 rounded-[40px] p-12 text-center space-y-8 relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
               <Store size={200} className="text-gold-primary" />
            </div>
            <h3 className="text-3xl font-black tracking-tighter uppercase italic relative z-10">BU FİYATLARLA İŞLEM YAPMAK İSTER MİSİNİZ?</h3>
            <p className="text-gray-400 max-w-xl mx-auto text-sm relative z-10 font-medium">Fiyatlar mağazamızın anlık piyasa koşullarına göre belirlenmiştir. Doğrudan iletişim kurarak randevu alabilir veya konum bilgisi isteyebilirsiniz.</p>
            <div className="flex flex-wrap justify-center gap-4 relative z-10">
               {profile.phone && (
                 <a href={`tel:${profile.phone}`} className="bg-gold-primary text-black px-12 py-5 rounded-2xl font-black text-xs hover:scale-105 transition-transform uppercase italic shadow-xl shadow-gold-primary/20 flex items-center gap-3">
                   <Phone size={18}/> HEMEN ARA
                 </a>
               )}
               {profile.map_url && (
                 <a href={profile.map_url} target="_blank" rel="noopener noreferrer" className="bg-white text-black px-12 py-5 rounded-2xl font-black text-xs hover:scale-105 transition-transform uppercase italic shadow-xl flex items-center gap-3">
                   <MapPin size={18}/> KONUMA GİT
                 </a>
               )}
               {profile.instagram && (
                 <a href={`https://instagram.com/${profile.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="bg-white/5 border border-white/10 px-12 py-5 rounded-2xl font-black text-xs hover:bg-white/10 transition-all uppercase italic flex items-center gap-3">
                   <Instagram size={18}/> INSTAGRAM
                 </a>
               )}
            </div>
        </div>

      </main>

      {/* Breadcrumb / Back button */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
          <Link href="/" className="text-xs font-bold text-gray-600 hover:text-white transition-colors flex items-center gap-2">
             ← Ana Sayfaya Dön
          </Link>
      </div>
    </div>
  );
}
