import { getMarketData } from "@/lib/api";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ArrowDownRight, TrendingUp, AlertTriangle } from "lucide-react";
import AdBanner from "@/components/AdBanner";

export const revalidate = 60; // 60 saniye cache

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { items } = await getMarketData();
  const item = items.find((i: any) => i.slug === params.slug);
  
  if (!item) {
    return {
      title: 'Bulunamadı | Altinciniz',
    };
  }

  const formattedPrice = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.price);

  return {
    title: `Canlı ${item.name} Fiyatı: ${formattedPrice} | Altinciniz`,
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

  const formattedPrice = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.price);

  // SEO için Schema/JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": item.name,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "TRY",
      "price": item.price,
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "priceType": "https://schema.org/InvoicePrice"
      }
    }
  };

  return (
    <main className="min-h-screen py-8 px-4 md:px-8 max-w-5xl mx-auto space-y-8 animate-fade-in relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Link href="/" className="inline-flex items-center text-gray-400 hover:text-gold-primary transition-colors text-sm font-medium">
        <ArrowLeft size={16} className="mr-2" />
        Ana Sayfa'ya Dön
      </Link>

      <AdBanner />

      <div className="bg-surface border border-[#222] rounded-3xl p-8 md:p-16 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 text-gold-primary">
                <TrendingUp size={24} />
                <span className="font-semibold uppercase tracking-wider text-sm">{item.type}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
                {item.name} Ne Kadar?
              </h1>
              <p className="text-gray-400 max-w-xl">
                Canlı ve anlık verilere göre {item.name.toLowerCase()} işlemleri için güncel fiyatlama aşağıda yer almaktadır. Piyasaya göre anlık değişiklikler gösterebilir.
              </p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-[#333] min-w-[300px]">
              <div className="text-sm text-gray-400 mb-2 font-medium flex justify-between">
                <span>Anlık Piyasa Fiyatı</span>
                <span className="text-[10px] text-gray-500">{updateDate}</span>
              </div>
              <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400 mb-4">
                {formattedPrice}
              </div>
              <div className={`inline-flex items-center space-x-1 px-4 py-2 rounded-lg text-lg font-medium w-full justify-center ${item.isUp ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                {item.isUp ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                <span>%{Math.abs(item.changePercent).toFixed(2)} (Son 24s)</span>
              </div>
            </div>
        </div>
      </div>

      <section className="bg-surface/50 rounded-2xl p-8 border border-[#222]">
        <h2 className="text-2xl font-bold mb-4 text-white">{item.name} Sıkça Sorulan Sorular</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gold-light mb-2">Piyasa verileri ne sıklıkla yenileniyor?</h3>
            <p className="text-gray-400">Verilerimiz fiziki kuyumcu piyasasından saniyeler içinde çekilmekte olup sitenize anında yansımaktadır. Son güncelleme: {updateDate}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gold-light mb-2 font-flex items-center">
              <AlertTriangle className="inline mr-2 text-red-400" size={18} />
              Sorumluluk Reddi (Yasal Uyarı)
            </h3>
            <p className="text-gray-400 text-sm">Burada yer alan yatırım bilgi, yorum ve tavsiyeleri yatırım danışmanlığı kapsamında değildir. Herhangi bir kuyumcuda işlem yapacağınız tutarlar buradaki tutarlardan işçilik veya makas farkı sebebiyle sapma gösterebilir. Altınciniz.com oluşabilecek mali kayıplardan sorumlu değildir.</p>
          </div>
        </div>
      </section>
      
      <AdBanner />

    </main>
  );
}
