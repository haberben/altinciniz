import { getMarketData } from "@/lib/api";
import PriceCard from "@/components/PriceCard";
import AdBanner from "@/components/AdBanner";
import { TrendingUp, Clock, Globe, ShieldAlert } from "lucide-react";

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

  const gramAltin = data.find(i => i.slug === "gram-altin");
  const otherGolds = data.filter(i => i.type === "gold" && i.slug !== "gram-altin");
  const currencies = data.filter(i => i.type === "currency");
  const metals = data.filter(i => i.type === "metal");

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#060606] text-white">
      {/* Premium Background Effects */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-gold-primary/10 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gold-primary/5 blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 py-12 px-4 md:px-8 max-w-[1400px] mx-auto space-y-16 animate-fade-in">
        
        {/* Header - Fixed Gap Issue */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
              <span className="text-gold-primary drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]">Altın</span>
              <span className="text-white">ciniz</span>
            </h1>
            <p className="text-gray-400 mt-3 font-medium text-lg tracking-wide">
              Canlı Serbest Piyasa ve Kapalıçarşı Fiyatları
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center text-sm font-medium text-gold-light bg-gold-primary/10 px-5 py-2.5 rounded-full border border-gold-primary/20 shadow-[0_0_20px_rgba(212,175,55,0.1)] backdrop-blur-md">
              <Clock size={18} className="mr-2 animate-pulse" />
              Sistem Aktif
            </div>
            <span className="text-xs text-gray-500 font-medium tracking-wider flex items-center justify-center">Son Güncelleme: {updateDate}</span>
          </div>
        </header>

        <AdBanner />

        {/* Featured: Gram Altın */}
        {gramAltin && (
          <section className="relative z-20">
            <div className="flex items-center space-x-3 mb-6 px-2">
              <TrendingUp className="text-gold-primary" size={28} />
              <h2 className="text-2xl font-bold text-white tracking-wide">Öne Çıkanlar</h2>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <PriceCard item={gramAltin} featured={true} />
            </div>
          </section>
        )}

        {/* Primary Golds */}
        <section>
          <h2 className="text-xl font-semibold text-gray-300 mb-6 px-2 tracking-wide flex items-center gap-2">
            <div className="w-1.5 h-6 bg-gold-primary rounded-full"></div>
            Altın Türleri ve Bilezik
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {otherGolds.map(item => <PriceCard key={item.slug} item={item} />)}
          </div>
        </section>

        {/* Currencies */}
        <section>
          <h2 className="text-xl font-semibold text-gray-300 mb-6 px-2 tracking-wide flex items-center gap-2">
            <Globe className="text-gold-primary" size={24} />
            Döviz Kurları
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {currencies.map(item => <PriceCard key={item.slug} item={item} />)}
          </div>
        </section>

        {/* Other Metals */}
        <section>
          <h2 className="text-xl font-semibold text-gray-300 mb-6 px-2 tracking-wide flex items-center gap-2">
            <div className="w-1.5 h-6 bg-gray-400 rounded-full"></div>
            Değerli Madenler (Gümüş, Platin)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {metals.map(item => <PriceCard key={item.slug} item={item} />)}
          </div>
        </section>

        <AdBanner />

        {/* Elevated Legal Footer */}
        <footer className="border-t border-white/10 pt-10 mt-20 text-center flex flex-col items-center pb-8">
          <div className="bg-red-500/5 p-6 rounded-3xl backdrop-blur-lg border border-red-500/10 w-full max-w-4xl mx-auto flex gap-4 md:items-center flex-col md:flex-row text-left">
            <ShieldAlert size={40} className="text-red-400/80 shrink-0 mx-auto md:mx-0" />
            <div className="space-y-2">
              <h3 className="font-bold text-red-400 tracking-wide text-center md:text-left">YASAL UYARI VE SORUMLULUK REDDİ</h3>
              <p className="text-gray-400 text-sm leading-relaxed text-center md:text-left">
                Burada yer alan yatırım bilgi, yorum ve tavsiyeleri <strong>yatırım danışmanlığı kapsamında değildir.</strong> Sitede yer alan altın, döviz ve değerli maden fiyatları tamamen bilgilendirme amacı taşıyan serbest piyasa (Kapalıçarşı) anlık verilerinden derlenmektedir. Herhangi bir kuyumcuda, bankada veya döviz bürosunda işlem yapacağınız tutarlar buradaki tutarlardan bölgesel farklılıklar nedeniyle sapma gösterebilir. Altınciniz.com, fiyat farklılıklarından oluşabilecek ticari zararlardan veya yaşanacak mağduriyetlerden yasal olarak kesinlikle <strong>sorumlu tutulamaz.</strong>
              </p>
            </div>
          </div>
          <p className="mt-10 text-gold-dark font-bold text-lg tracking-widest">© {new Date().getFullYear()} Altınciniz.com</p>
        </footer>

      </div>
    </main>
  );
}
