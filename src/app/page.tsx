import { getMarketData } from "@/lib/api";
import PriceCard from "@/components/PriceCard";
import AdBanner from "@/components/AdBanner";
import Ticker from "@/components/Ticker";
import Converter from "@/components/Converter";
import DataTable from "@/components/DataTable";
import { TrendingUp, Clock, ShieldAlert, BarChart3, Coins } from "lucide-react";
import VIPJewelers from "@/components/VIPJewelers";

export const revalidate = 15; // 15 saniyede bir yeniden oluştur (Hızlı ISR)

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

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Canlı gram altın ne kadar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Gram altın fiyatı, anlık olarak Kapalıçarşı piyasası ve küresel ons altın değerlerine göre saniyeler içinde güncellenmektedir. Ana sayfamızdaki canlı piyasa tablosundan güncel rakamı takip edebilirsiniz."
        }
      },
      {
        "@type": "Question",
        "name": "Çeyrek altın kaç TL?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Çeyrek altın, vatandaşın en çok tercih ettiği yatırım aracıdır. Anlık çeyrek altın alış ve satış fiyatları canlı tablolarımızda şeffaf şekilde listelenir."
        }
      },
      {
        "@type": "Question",
        "name": "Altıncınız verileri Harem Altın ile uyumlu mu?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Altıncınız, toptan piyasa olan Kapalıçarşı veri akışlarını kullanır. Bu nedenle Harem altın fiyatları başta olmak üzere tüm fiziki toptan piyasalarla birebir uyumlu canlı kurlar sunar."
        }
      }
    ]
  };

  return (
    <div className="bg-[#060606] min-h-screen text-white font-sans selection:bg-gold-primary selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
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
                <span className="text-white">cınız</span>
              </h1>
              <h2 className="text-gray-400 mt-3 font-medium text-lg tracking-wide max-w-xl">
                Canlı Kapalıçarşı Altın Fiyatları, Döviz Kurları ve Anlık Finansal Hesaplama
              </h2>
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

          {/* Dinamik Yıldızlı Kuyumcular Vitrini */}
          <div className="relative z-20 mb-12">
            <VIPJewelers />
          </div>

          {/* 3. Featured Market Cards (Top 4 Assets) */}
          <section className="relative z-20">
            <div className="flex items-center space-x-3 mb-6 px-2">
              <TrendingUp className="text-gold-primary" size={24} />
              <h2 className="text-2xl font-black text-white tracking-tight">Öne Çıkan Canlı Piyasalar</h2>
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
                <h3 className="text-2xl font-black text-white tracking-tight">Kapalıçarşı Altın Fiyatları</h3>
              </div>
              <DataTable items={tableGolds} title="Tüm Altın Türleri (Canlı)" />
            </section>

            {/* Döviz ve Gümüş Tablosu */}
            <div className="space-y-8">
              <section>
                <div className="flex items-center space-x-3 mb-6 px-2">
                  <BarChart3 className="text-blue-400" size={24} />
                  <h3 className="text-2xl font-black text-white tracking-tight">Canlı Döviz Kurları</h3>
                </div>
                <DataTable items={allCurrencies} title="Serbest Piyasa Döviz (Canlı)" />
              </section>

              <section>
                <DataTable items={allMetals} title="Değerli Madenler" />
              </section>
            </div>
          </div>
          
          <AdBanner />

          {/* Dinamik SEO ve FAQ İçeriği (Ana Sayfa İçin) */}
          <section className="bg-black/50 rounded-3xl p-8 border border-[#222] mt-12 backdrop-blur-md">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 text-white">Canlı Altın Piyasası Hakkında Sıkça Sorulan Sorular</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gold-primary tracking-tight">Gram altın ne kadar, kaç TL oldu?</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Gram altın fiyatı, 24 ayar saf altın üzerinden hesaplanır. Küresel ons altın ve anlık dolar/TL kuruna göre saniyeler içerisinde değişebilir. Türkiye'de en çok tercih edilen yatırım aracı olan gram altının en güncel, makassız ve canlı Kapalıçarşı taban alış/satış fiyatlarını sürekli yenilenen tablolarımızdan saniye saniye takip edebilirsiniz.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gold-primary tracking-tight">Altıncınız verileri Harem Altın fiyatları ile uyumlu mu?</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Evet. Altıncınız sistem algoritması, Türkiye'nin toptan altın ve döviz merkezi olan Kapalıçarşı ağlarından eşzamanlı likidite verisi alır. Harem altın fiyatları, Nadir Metal veya diğer büyük toptancı ekranlarıyla 0.01 saniye gecikme payı ile eşdeğer veya en yakın toptan piyasa kurlarını yansıtır.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gold-primary tracking-tight">Çeyrek altın fiyatı nasıl belirlenir?</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Bir çeyrek altın 1.75 gram gelir ve 22 ayardır. Yani içerdiği saf altın miktarı 1.6065 gramdır. Çeyrek fiyatları bu katsayı baz alınarak Kapalıçarşı anlık kurları üzerinden hesaplanır. Canlı ekranlarımızda çeyrek altın alış ve satış farkı (makas) yansıtılmaktadır. Darphane üretim maliyetleri piyasa hareketlerine göre fiyatları yukarı yönlü baskılayabilir.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gold-primary tracking-tight">Neden iki farklı fiyat (Alış ve Satış) var?</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Altın ve döviz işlemlerindeki fiyat farkı "makas" (spread) olarak adlandırılır. Alış fiyatı, kuyumcunun sizden ürünü aldığı düşük rakamı temsil eder. Satış ise kuyumcunun o ürünü size satarken talep ettiği yüksek rakamdır. Sitemizde bu aralıklar şeffaf biçimde listelenerek, yatırımcılara doğru yönlendirme yapılır.
                </p>
              </div>
            </div>
          </section>

          {/* Elevated Legal Footer */}
          <footer className="border-t border-[#222] pt-12 mt-20 text-center flex flex-col items-center pb-12">
            <div className="bg-[#110505] p-8 rounded-3xl border border-red-900/30 w-full max-w-5xl mx-auto flex gap-6 md:items-start flex-col md:flex-row text-left shadow-2xl">
              <ShieldAlert size={48} className="text-red-500 shrink-0 mx-auto md:mx-0" />
              <div className="space-y-3">
                <h3 className="font-black text-red-500 tracking-wide text-center md:text-left text-xl">YASAL UYARI VE SORUMLULUK REDDİ</h3>
                <p className="text-gray-400 text-sm leading-relaxed text-center md:text-left">
                  Burada yer alan yatırım bilgi, yorum ve tavsiyeleri <strong>yatırım danışmanlığı kapsamında değildir.</strong> Sitede yer alan fiyatlar tamamen bilgilendirme amacı taşıyan serbest piyasa (Kapalıçarşı) anlık verilerinden derlenmektedir. Herhangi bir yetkili müessesede (kuyumcu, döviz bürosu) işlem yapacağınız tutarlar buradaki tutarlardan bölgesel arz/talep ve işçilik farklılıkları nedeniyle sapma gösterebilir. Altıncınız.com, fiyat farklılıklarından oluşabilecek hata, ticari zarar veya yaşanacak mağduriyetlerden yasal olarak kesinlikle <strong>sorumlu tutulamaz.</strong>
                </p>
              </div>
            </div>
            
            <div className="mt-16 flex flex-col items-center space-y-4">
              <span className="text-2xl font-black tracking-tighter opacity-50">
                <span className="text-gold-primary">Altın</span>
                <span className="text-white">cınız</span>
              </span>
              <p className="text-gray-600 font-medium text-sm tracking-widest">© {new Date().getFullYear()} TÜM HAKLARI SAKLIDIR.</p>
            </div>
          </footer>

        </div>
      </main>
    </div>
  );
}
