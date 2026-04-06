import { getMarketData } from "@/lib/api";
import PriceCard from "@/components/PriceCard";
import AdBanner from "@/components/AdBanner";
import Ticker from "@/components/Ticker";
import Converter from "@/components/Converter";
import DataTable from "@/components/DataTable";
import BankTable from "@/components/BankTable";
import GoldTabTable from "@/components/GoldTabTable";
import Link from "next/link";
import { TrendingUp, Clock, ShieldAlert, BarChart3, Coins, Calculator } from "lucide-react";
import VIPJewelers from "@/components/VIPJewelers";
import RichSEOContent from "@/components/RichSEOContent";
import TrendingSearches from "@/components/TrendingSearches";
import InvestmentPulse from "@/components/InvestmentPulse";
import HistoricalChart from "@/components/HistoricalChart";
import type { Metadata } from "next";

export const revalidate = 30; // 30 saniyede bir, kaynak rotasyonu ile

export const metadata: Metadata = {
  title: "Gram Altın Fiyatı (Canlı) – Bugün Gram Altın Ne Kadar? | Altıncınız",
  description: "Anlık gram altın fiyatı bugün ne kadar? Çeyrek altın, yarım altın, tam altın canlı fiyatları. 22 ayar, 24 ayar gram altın fiyatı, Harem Altın, Altınkaynak, Bigpara ve Kapalıçarşı canlı altın piyasası.",
  openGraph: {
    title: "Gram Altın Fiyatı (Canlı) – Bugün Gram Altın Ne Kadar? – Altıncınız",
    description: "Gram altın ne kadar 2026? Çeyrek altın, yarım altın, tam altın, ons altın canlı takip. Harem Altın ve Altınkaynak verileriyle Kapalıçarşı anlık fiyatları.",
  }
};

export default async function Home() {
  const { items: data, banks, updateDate } = await getMarketData();

  if (!data || data.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8 text-center text-gray-400 bg-[#050d1f]">
        Veriler şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin veya internet bağlantınızı kontrol edin.
      </main>
    );
  }

  // Kategorizasyon
  const featuredSlugs = ["gram-altin", "ceyrek-altin", "usd", "eur"];
  const featuredItems = featuredSlugs
    .map(slug => data.find(i => i.slug === slug))
    .filter(Boolean) as typeof data;

  // Altın tablosu — tüm altın türleri sıralı
  const goldOrder = [
    "gram-altin", "has-altin", "22-ayar-bilezik", "14-ayar-altin", "18-ayar-altin",
    "ceyrek-altin", "ceyrek-eski", "yarim-altin", "yarim-eski",
    "tam-altin", "tam-eski", "ata-altin", "besli-ata", "gremse-altin",
    "kilo-dolar", "kilo-euro", "altin-ons"
  ];
  const tableGolds = goldOrder
    .map(slug => data.find(i => i.slug === slug))
    .filter(Boolean) as typeof data;
  // Sıralanamayan altınlar
  const remainingGolds = data.filter(
    i => i.type === "gold" && !goldOrder.includes(i.slug)
  );
  const allTableGolds = [...tableGolds, ...remainingGolds];

  // Döviz tablosu
  const allCurrencies = data.filter(i => i.type === "currency");

  // Değerli madenler
  const allMetals = data.filter(i => i.type === "metal" || i.type === "index");

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Gram altın ne kadar, bugün gram altın fiyatı?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Gram altın fiyatı anlık olarak Kapalıçarşı piyasası ve küresel ons altın değerlerine göre saniyeler içinde güncellenmektedir. Sayfamızdaki canlı piyasa tablosundan 22 ayar ve 24 ayar gram altın alış-satış fiyatlarını gerçek zamanlı takip edebilirsiniz."
        }
      },
      {
        "@type": "Question",
        "name": "Çeyrek altın ne kadar, çeyrek altın fiyatı kaç TL?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Çeyrek altın 1.75 gram olup 22 ayardır. Çeyrek altın fiyatı Kapalıçarşı anlık kurları üzerinden hesaplanır. Bugünkü çeyrek altın fiyatı için canlı tablolarımızı takip edin."
        }
      },
      {
        "@type": "Question",
        "name": "Kapalıçarşı altın fiyatları nasıl öğrenilir?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Kapalıçarşı serbest piyasa altın fiyatları Altıncınız üzerinden anlık takip edilebilir. Kuyumcular odası ve Kapalıçarşı taban fiyatları canlı güncellenmektedir."
        }
      }
    ]
  };

  return (
    <div className="bg-[#050d1f] min-h-screen text-white font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* 1. Sticky Ticker */}
      <Ticker items={data} />

      {/* 2. Navigasyon Çubuğu */}
      <nav className="bg-[#071428] border-b border-[#1a3a6a]/50 sticky top-[90px] z-40">
        <div className="max-w-[1400px] mx-auto px-4 flex items-center gap-1 overflow-x-auto scrollbar-none py-0">
          {[
            { label: "CANLI ALTIN", href: "/" },
            { label: "GRAM ALTIN", href: "/gram-altin" },
            { label: "KAPALIÇARŞI", href: "/" },
            { label: "ÇEYREK ALTIN", href: "/ceyrek-altin" },
            { label: "HESAPLAMA", href: "/hesaplama" },
            { label: "GÜMÜŞ", href: "/gumus" },
            { label: "KUYUMCULAR", href: "/kuyumcular" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="flex-shrink-0 px-4 py-3 text-[11px] font-black tracking-widest text-[#8fa8cc] hover:text-[#D4AF37] hover:border-b-2 hover:border-[#D4AF37] transition-all border-b-2 border-transparent"
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-8 space-y-8">

        {/* 3. Başlık */}
        <header className="flex flex-col md:flex-row justify-between items-start gap-4 pb-6 border-b border-[#1a3a6a]/30">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              <span className="text-[#D4AF37]">Kapalıçarşı Altın Fiyatları</span>
              <span className="ml-2 text-xs font-bold bg-emerald-500 text-black px-2 py-1 rounded align-middle">ANLIK</span>
            </h1>
            <p className="text-[#8fa8cc] mt-2 text-sm font-medium">
              Kuyumcular Odası canlı altın fiyatları — anlık Kapalıçarşı verileri
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#4a6a9a] bg-[#071428] border border-[#1a3a6a]/40 px-4 py-2 rounded-xl">
            <Clock size={13} />
            Son güncelleme: <span className="font-black text-[#8fa8cc] ml-1">{updateDate}</span>
          </div>
        </header>

        <AdBanner />

        {/* 4. Anlık Fiyat Kartları */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-[#D4AF37]" size={18} />
            <h2 className="text-base font-black text-white tracking-wide uppercase">Öne Çıkan Canlı Piyasalar</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredItems.map(item => <PriceCard key={item.slug} item={item} />)}
          </div>
        </section>

        {/* 5. Ana İçerik: Sol altın tablosu + Sağ döviz sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Sol: Altın tablosu (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Coins className="text-[#D4AF37]" size={16} />
                <h2 className="text-sm font-black text-white uppercase tracking-wide">Kapalıçarşı Altın Fiyatları</h2>
              </div>
              <GoldTabTable
                kapalicarsiItems={allTableGolds}
                serbestItems={allTableGolds}
                haremItems={allTableGolds}
              />
            </section>

            {/* Banka tablosu */}
            {banks && banks.length > 0 && (
              <section>
                <BankTable banks={banks} />
              </section>
            )}
          </div>

          {/* Sağ: Döviz + Gümüş sidebar (1/3) */}
          <div className="space-y-6">
            <section>
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="text-blue-400" size={16} />
                <h2 className="text-sm font-black text-white uppercase tracking-wide">Canlı Döviz Kurları</h2>
              </div>
              <DataTable items={allCurrencies} title="Serbest Piyasa Döviz" />
            </section>

            {allMetals.length > 0 && (
              <section>
                <DataTable items={allMetals} title="Değerli Madenler" />
              </section>
            )}

            {/* Converter */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="text-[#D4AF37]" size={16} />
                <h2 className="text-sm font-black text-white uppercase tracking-wide">Hesaplama Aracı</h2>
              </div>
              <Converter items={data} />
            </section>
          </div>
        </div>

        <AdBanner />

        {/* 6. VIP Kuyumcular */}
        <section>
          <VIPJewelers />
        </section>

        {/* 7. Grafik + Çevirici */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <HistoricalChart
            currentPrice={data.find(i => i.slug === "gram-altin")?.price || 0}
            label="Gram Altın"
          />
          <InvestmentPulse data={data} />
        </section>

        {/* 8. SEO İçerik */}
        <section className="bg-[#071428] rounded-2xl p-8 border border-[#1a3a6a]/30">
          <h2 className="text-xl font-black uppercase tracking-tight mb-6 text-white">
            Kapalıçarşı'da Altın Ve Döviz Neden Farklı?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[#8fa8cc] leading-relaxed">
            <div>
              <span className="inline-block bg-[#D4AF37]/20 text-[#D4AF37] font-bold px-2 py-0.5 rounded text-xs mb-2">Arz / Talep</span>
              <p>Bankalar ve döviz büroları döviz arzını kısıtlayabilirken, Kapalıçarşı gibi alanlarda arz ve talep daha özgürce belirlenir. Bu, döviz kurları arasındaki farklılaşmaya yol açar.</p>
            </div>
            <div>
              <span className="inline-block bg-[#D4AF37]/20 text-[#D4AF37] font-bold px-2 py-0.5 rounded text-xs mb-2">Yönetmelikler</span>
              <p>Bankalar ve döviz büroları resmi yönetmeliklere bağlıdır, ancak Kapalıçarşı gibi serbest piyasalar bu yönetmeliklerden daha az etkilenir.</p>
            </div>
            <div>
              <span className="inline-block bg-[#D4AF37]/20 text-[#D4AF37] font-bold px-2 py-0.5 rounded text-xs mb-2">Likidite</span>
              <p>Kapalıçarşı gibi fiziksel alım satımın gerçekleştiği yerlerde likidite seviyesi daha düşük olma eğilimindedir. Bu, daha yüksek döviz kurlarını beraberinde getirir.</p>
            </div>
            <div>
              <span className="inline-block bg-[#D4AF37]/20 text-[#D4AF37] font-bold px-2 py-0.5 rounded text-xs mb-2">Komisyon</span>
              <p>Kapalıçarşı'daki işlem ücretleri ve komisyonlar, bankalar ve döviz bürolarına göre farklılık gösterebilir. Bu durum, fiyatlar arasındaki farkı etkiler.</p>
            </div>
          </div>
          <TrendingSearches />
        </section>

        {/* 9. RichSEOContent */}
        <RichSEOContent />

        {/* 10. Footer */}
        <footer className="border-t border-[#1a3a6a]/30 pt-10 mt-8 text-center flex flex-col items-center pb-10">
          <div className="bg-[#071428] border border-red-900/30 p-6 rounded-2xl w-full max-w-4xl mb-8 flex gap-4 items-start text-left">
            <ShieldAlert size={36} className="text-red-500 shrink-0" />
            <div>
              <h3 className="font-black text-red-500 text-sm mb-1 uppercase tracking-wide">Yasal Uyarı ve Sorumluluk Reddi</h3>
              <p className="text-[#4a6a9a] text-xs leading-relaxed">
                Burada yer alan yatırım bilgi, yorum ve tavsiyeleri <strong>yatırım danışmanlığı kapsamında değildir.</strong> Sitede yer alan fiyatlar tamamen bilgilendirme amacı taşıyan serbest piyasa (Kapalıçarşı) anlık verilerinden derlenmektedir. Altıncınız.com, fiyat farklılıklarından oluşabilecek hata, ticari zarar veya yaşanacak mağduriyetlerden yasal olarak kesinlikle <strong>sorumlu tutulamaz.</strong>
              </p>
            </div>
          </div>
          <span className="text-2xl font-black tracking-tighter opacity-40">
            <span className="text-[#D4AF37]">Altın</span>
            <span className="text-white">cınız</span>
          </span>
          <p className="text-[#2a4a6a] font-medium text-xs tracking-widest mt-1">© {new Date().getFullYear()} TÜM HAKLARI SAKLIDIR.</p>
        </footer>

      </main>
    </div>
  );
}
