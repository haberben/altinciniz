import { getMarketData } from "@/lib/api";
import PriceCard from "@/components/PriceCard";
import AdBanner from "@/components/AdBanner";
import { TrendingUp, Clock } from "lucide-react";

export const revalidate = 60; // Ana sayfayı her 60 saniyede bir yeniden oluştur (ISR)

export default async function Home() {
  const data = await getMarketData();

  if (!data || data.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8 text-center text-gray-400">
        Veriler şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin veya internet bağlantınızı kontrol edin.
      </main>
    );
  }

  const gramAltin = data.find(i => i.slug === "gram-altin");
  const otherGolds = data.filter(i => i.type === "gold" && i.slug !== "gram-altin");
  const currencies = data.filter(i => i.type === "currency");
  const metals = data.filter(i => i.type === "metal");

  return (
    <main className="min-h-screen py-8 px-4 md:px-8 max-w-7xl mx-auto space-y-12 animate-fade-in">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white flex items-center justify-center md:justify-start gap-3">
            <span className="text-gold-primary">Altın</span>ciniz
          </h1>
          <p className="text-gray-400 mt-2">Canlı Altın, Döviz ve Değerli Maden Kurları</p>
        </div>
        <div className="flex items-center text-sm text-gray-500 bg-surface px-4 py-2 rounded-full border border-[#222]">
          <Clock size={16} className="mr-2" />
          Gerçek Zamanlı Veri
        </div>
      </header>
      
      {/* Top Banner Ad Space */}
      <AdBanner />

      {/* Featured: Gram Altın */}
      {gramAltin && (
        <section>
          <div className="flex items-center space-x-2 mb-4 px-1">
            <TrendingUp className="text-gold-primary" size={24} />
            <h2 className="text-xl font-medium text-white">Öne Çıkanlar</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <PriceCard item={gramAltin} featured={true} />
          </div>
        </section>
      )}

      {/* Primary Golds */}
      <section>
        <h2 className="text-lg font-medium text-gray-400 mb-4 px-1">Diğer Altın Türleri</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {otherGolds.map(item => <PriceCard key={item.slug} item={item} />)}
        </div>
      </section>

      {/* Currencies */}
      <section>
        <h2 className="text-lg font-medium text-gray-400 mb-4 px-1">Döviz Kurları</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {currencies.map(item => <PriceCard key={item.slug} item={item} />)}
        </div>
      </section>

      {/* Other Metals */}
      <section>
        <h2 className="text-lg font-medium text-gray-400 mb-4 px-1">Değerli Madenler (Ons)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metals.map(item => <PriceCard key={item.slug} item={item} />)}
        </div>
      </section>

      {/* Bottom Ad Space */}
      <AdBanner />

      {/* Footer */}
      <footer className="border-t border-[#222] pt-8 mt-16 text-center text-sm text-gray-500 flex flex-col items-center">
        <p>Tüm fiyatlar ve kurlar bilgilendirme amaçlıdır. Yatırım tavsiyesi değildir.</p>
        <p className="mt-2 text-gold-dark font-medium">© {new Date().getFullYear()} Altinciniz.com</p>
      </footer>
    </main>
  );
}
