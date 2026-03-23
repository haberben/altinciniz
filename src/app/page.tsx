import { getMarketData } from "@/lib/api";
import PriceCard from "@/components/PriceCard";
import AdBanner from "@/components/AdBanner";
import Ticker from "@/components/Ticker";
import Converter from "@/components/Converter";
import DataTable from "@/components/DataTable";
import { TrendingUp, Clock, ShieldAlert, BarChart3, Coins } from "lucide-react";

export const revalidate = 60; // Ana sayfayı her 60 saniyede bir yeniden oluştur (ISR)

export default async function Home() {
  const { items: data, updateDate } = await getMarketData();

  if (!data || data.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8 text-center text-gray-400 bg-[#060606]">
        Veriler şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin veya internet bağlantınızı kontrol edin.
      </main>
    );
  }

  // Öne çıkan ana varlıklar (Tepe Kartları için)
  const featuredSlugs = ["gram-altin", "ceyrek-altin", "usd", "eur"];
  const featuredItems = data.filter(i => featuredSlugs.includes(i.slug));
  
  // Tablolar için kategorizasyon
  const allGolds = data.filter(i => i.type === "gold" && i.slug !== "gram-altin" && i.slug !== "ceyrek-altin");
  // Altın tablosuna Gram ve Çeyrek'i de en başa ekleyelim ki tabloda eksik kalmasınlar
  const tableGolds = [...data.filter(i => i.slug === "gram-altin"), ...data.filter(i => i.slug === "ceyrek-altin"), ...allGolds];
  
  const allCurrencies = data.filter(i => i.type === "currency");
  const allMetals = data.filter(i => i.type === "metal");

  return (
    <div className="bg-[#060606] min-h-screen text-white font-sans selection:bg-gold-primary selection:text-black">
      {/* 1. Global Ticker Tape (Kayan Borsa Şeridi) */}
      <Ticker items={data} />

      <main className="relative overflow-hidden">
        {/* Premium Background Effects */}
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-gold-primary/10 via-black/50 to-transparent pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full bg-gold-primary/5 blur-[150px] pointer-events-none" />
        
        <div className="relative z-10 py-10 px-4 md:px-8 max-w-[1400px] mx-auto space-y-12 animate-fade-in">
          
          {/* Header Section */}
          <header className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left border-b border-white/5 pb-8">
            <div className="flex flex-col items-center md:items-start">
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
                <span className="text-gold-primary drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]">Altın</span>
                <span className="text-white">ciniz</span>
              </h1>
              <p className="text-gray-400 mt-3 font-medium text-lg tracking-wide max-w-xl">
                Canlı Kapalıçarşı Fiyatları, Döviz Kurları ve Anlık Finansal Hesaplama Araçları
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2">
              <div className="flex items-center text-sm font-medium text-gold-light bg-gold-primary/10 px-6 py-3 rounded-full border border-gold-primary/20 shadow-[0_0_20px_rgba(212,175,55,0.1)] backdrop-blur-md">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping mr-3"></div>
                Piyasa Açık
              </div>
              <span className="text-xs text-gray-500 font-medium tracking-wider flex items-center justify-center">
                <Clock size={12} className="mr-1" />
                Son Güncelleme: {updateDate}
              </span>
            </div>
          </header>

          <AdBanner />

          {/* 2. Interactive FinTech Converter Tool */}
          <section className="relative z-20">
            <Converter items={data} />
          </section>

          {/* 3. Featured Market Cards (Top 4 Assets) */}
          <section className="relative z-20">
            <div className="flex items-center space-x-3 mb-6 px-2">
              <TrendingUp className="text-gold-primary" size={24} />
              <h2 className="text-2xl font-black text-white tracking-tight">Öne Çıkan Piyasalar</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredItems.map(item => <PriceCard key={item.slug} item={item} />)}
            </div>
          </section>

          <AdBanner />

          {/* 4. Professional Data Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Altın Tablosu */}
            <section>
              <div className="flex items-center space-x-3 mb-6 px-2">
                <Coins className="text-gold-light" size={24} />
                <h2 className="text-2xl font-black text-white tracking-tight">Kapalıçarşı Altın Fiyatları</h2>
              </div>
              <DataTable items={tableGolds} title="Tüm Altın Türleri (Canlı)" />
            </section>

            {/* Döviz ve Gümüş Tablosu */}
            <div className="space-y-8">
              <section>
                <div className="flex items-center space-x-3 mb-6 px-2">
                  <BarChart3 className="text-blue-400" size={24} />
                  <h2 className="text-2xl font-black text-white tracking-tight">Döviz Kurları</h2>
                </div>
                <DataTable items={allCurrencies} title="Serbest Piyasa Döviz (Canlı)" />
              </section>

              <section>
                <DataTable items={allMetals} title="Değerli Madenler" />
              </section>
            </div>
          </div>

          <AdBanner />

          {/* Elevated Legal Footer */}
          <footer className="border-t border-[#222] pt-12 mt-20 text-center flex flex-col items-center pb-12">
            <div className="bg-[#110505] p-8 rounded-3xl border border-red-900/30 w-full max-w-5xl mx-auto flex gap-6 md:items-start flex-col md:flex-row text-left shadow-2xl">
              <ShieldAlert size={48} className="text-red-500 shrink-0 mx-auto md:mx-0" />
              <div className="space-y-3">
                <h3 className="font-black text-red-500 tracking-wide text-center md:text-left text-xl">YASAL UYARI VE SORUMLULUK REDDİ</h3>
                <p className="text-gray-400 text-sm leading-relaxed text-center md:text-left">
                  Burada yer alan yatırım bilgi, yorum ve tavsiyeleri <strong>yatırım danışmanlığı kapsamında değildir.</strong> Sitede yer alan fiyatlar tamamen bilgilendirme amacı taşıyan serbest piyasa (Kapalıçarşı) anlık verilerinden derlenmektedir. Herhangi bir yetkili müessesede (kuyumcu, döviz bürosu) işlem yapacağınız tutarlar buradaki tutarlardan bölgesel arz/talep ve işçilik farklılıkları nedeniyle sapma gösterebilir. Altınciniz.com, fiyat farklılıklarından oluşabilecek hata, ticari zarar veya yaşanacak mağduriyetlerden yasal olarak kesinlikle <strong>sorumlu tutulamaz.</strong>
                </p>
              </div>
            </div>
            
            <div className="mt-16 flex flex-col items-center space-y-4">
              <h1 className="text-2xl font-black tracking-tighter opacity-50">
                <span className="text-gold-primary">Altın</span>
                <span className="text-white">ciniz</span>
              </h1>
              <p className="text-gray-600 font-medium text-sm tracking-widest">© {new Date().getFullYear()} TÜM HAKLARI SAKLIDIR.</p>
            </div>
          </footer>

        </div>
      </main>
    </div>
  );
}
