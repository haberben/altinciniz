import { getMarketData } from "@/lib/api";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';
import Link from "next/link";
import { ArrowLeft, TrendingUp, AlertTriangle, Activity } from "lucide-react";
import AdBanner from "@/components/AdBanner";

export const revalidate = 15; // 15 saniye cache

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { items } = await getMarketData();
  const item = items.find((i: any) => i.slug === params.slug);
  
  if (!item) {
    return {
      title: 'Bulunamadı | Altıncınız',
    };
  }

  const formattedPrice = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.priceSelling);

  return {
    title: `Canlı ${item.name} Fiyatı: ${formattedPrice} | Altıncınız`,
    description: `Anlık ${item.name} fiyatı alış ve satış detayları. Güncel ${item.name} kuru ne kadar, kaç TL oldu? Canlı takip edin.`,
    keywords: `${item.name.toLowerCase()} fiyatı, canlı ${item.name}, ${item.name} ne kadar, ${item.name} kaç tl, harem ${item.name}`,
    alternates: {
      canonical: `https://altinciniz.com/${item.slug}`
    }
  };
}

export default async function DetaySayfasi({ params }: { params: { slug: string } }) {
  const { items, updateDate } = await getMarketData();
  const item = items.find((i: any) => i.slug === params.slug);

  if (!item) {
    notFound();
  }

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(p) + ' ₺';
  };

  // SEO için Schema/JSON-LD (FinancialProduct + FAQ)
  const jsonLdData = [
    {
      "@context": "https://schema.org",
      "@type": "FinancialProduct",
      "name": item.name,
      "offers": {
        "@type": "Offer",
        "priceCurrency": "TRY",
        "price": item.priceSelling,
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "priceType": "https://schema.org/InvoicePrice"
        }
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `Canlı ${item.name} fiyatı bugün ne kadar?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Güncel verilere göre canlı ${item.name} alış fiyatı ${formatPrice(item.priceBuying)} ve satış fiyatı ${formatPrice(item.priceSelling)} şeklindedir.`
          }
        },
        {
          "@type": "Question",
          "name": `Harem altın ${item.name} fiyatları ile piyasa aynı mı?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `${item.name} fiyatları kapalıçarşı piyasasına göre anlık değişir. Harem altın fiyatları gibi toptan piyasa verilerine çok yakın seviyelerde işlem görmektedir.`
          }
        }
      ]
    }
  ];

  return (
    <main className="min-h-screen py-8 px-4 md:px-8 max-w-5xl mx-auto space-y-12 animate-fade-in relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      
      <Link href="/" className="inline-flex items-center text-gray-400 hover:text-gold-primary transition-colors text-sm font-medium">
        <ArrowLeft size={16} className="mr-2" />
        Ana Sayfa'ya Dön
      </Link>

      <AdBanner />

      <div className="bg-gradient-to-br from-[#111] to-black border border-[#222] rounded-3xl p-8 md:p-12 relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3 text-gold-primary">
                <TrendingUp size={28} />
                <span className="font-black uppercase tracking-widest text-sm opacity-80">{item.type}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-4 leading-tight">
                {item.name} Fiyatı Ne Kadar?
              </h1>
              <p className="text-gray-400 max-w-lg leading-relaxed">
                Canlı ve anlık verilere göre <strong className="text-white">{item.name.toLowerCase()}</strong> işlemleri için güncel alış ve satış fiyatlaması aşağıda yer almaktadır. Piyasaya göre anlık değişiklikler gösterebilir. Kapalıçarşı ve serbest piyasa <strong className="text-white">harem altın</strong> eşdeğerlilik kurlarıyla desteklenmektedir.
              </p>
            </div>
            
            <div className="flex flex-col gap-4 min-w-[320px]">
              
              <div className="flex items-center justify-between text-xs font-bold text-gray-500 bg-[#0a0a0a] px-4 py-3 rounded-xl border border-[#222]">
                <span className="uppercase tracking-widest flex items-center">
                  <Activity size={14} className="text-emerald-500 mr-2 animate-pulse" />
                  Son Güncelleme
                </span>
                <span className="text-gray-600">{updateDate}</span>
              </div>

              {/* Alış & Satış Dual Box */}
              <div className="flex flex-col space-y-3">
                <div className="bg-[#111] border border-[#333] rounded-2xl p-5 flex justify-between items-center shadow-inner">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Kuyumcu Alış</span>
                  <span className="text-2xl font-black text-white">{formatPrice(item.priceBuying)}</span>
                </div>

                <div className="bg-gradient-to-r from-gold-primary/10 to-transparent border border-gold-primary/40 rounded-2xl p-5 flex justify-between items-center shadow-[0_0_30px_rgba(212,175,55,0.1)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gold-primary/5 w-1/2 blur-2xl rounded-full mix-blend-screen"></div>
                  <span className="text-sm font-bold text-gold-light uppercase tracking-widest relative z-10">Kuyumcu Satış</span>
                  <span className="text-3xl font-black text-gold-light drop-shadow-lg relative z-10">{formatPrice(item.priceSelling)}</span>
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* Dinamik SEO ve FAQ İçeriği */}
      <section className="bg-[#0a0a0a] rounded-3xl p-8 border border-[#222]">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 text-white">{item.name} İçin Sıkça Sorulan Sorular</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gold-primary tracking-tight">Canlı {item.name} fiyatı bugün ne kadar?</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Güncel Kapalıçarşı canlı piyasa verilerine göre {item.name.toLowerCase()} alış fiyatı <strong>{formatPrice(item.priceBuying)}</strong>, satış fiyatı ise <strong>{formatPrice(item.priceSelling)}</strong> olarak işlem görmektedir. Fiyatlar saniyeler içinde değişebilir.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gold-primary tracking-tight">Harem Altın {item.name} kurları ile fark var mı?</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
               Altıncınız, Kapalıçarşı dahil tüm Türkiye'deki toptan altın paritelerine paralel veriler çeker. <strong>Harem altın</strong> ve diğer toptancı verileriyle çok yakın bazda güncel kurları sitemiz üzerinden anlık takip edebilirsiniz.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gold-primary tracking-tight">Makas Aralığı (Alış-Satış Farkı) Nedir?</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Piyasada gösterilen Alış fiyatı kuyumcunun sizden altını aldığı ucuz fiyatı, Satış fiyatı ise kuyumcunun size altını sattığı yüksek fiyatı temsil eder. Sitemizde bu aralığı net ve şeffaf olarak ayrı ayrı görebilirsiniz. Fiziki kuyumcularda marjlar daha geniş olabilir.
            </p>
          </div>

          <div className="bg-red-500/5 p-5 rounded-2xl border border-red-500/10">
            <h3 className="text-sm font-bold text-red-400 mb-2 flex items-center uppercase tracking-widest">
              <AlertTriangle className="inline mr-2" size={16} />
              Yasal Uyarı
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Burada yer alan yatırım bilgi, yorum ve tavsiyeleri yatırım danışmanlığı kapsamında değildir. Herhangi bir kuyumcuda işlem yapacağınız tutarlar ekran fiyatlarından sapma gösterebilir.
            </p>
          </div>
          
        </div>
      </section>

      <AdBanner />
    </main>
  );
}
