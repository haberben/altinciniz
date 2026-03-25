import { getMarketData } from "@/lib/api";
import Converter from "@/components/Converter";
import Ticker from "@/components/Ticker";
import Link from "next/link";
import { Calculator, ArrowLeft, Info, HelpCircle } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60; // 1 dakika (Hesaplama sayfası için yeterli)

export const metadata: Metadata = {
  title: "Gram Altın Hesaplama Aracı (Canlı) – Altıncınız",
  description: "Canlı gram altın hesaplama aracı ile birikimlerinizin değerini anlık Kapalıçarşı fiyatlarıyla hesaplayın. Çeyrek, yarım, tam altın ve döviz çevirici.",
  keywords: ["gram altın hesaplama", "altın hesaplama", "döviz hesaplama", "altın çevirici", "canlı altın kuru hesapla"],
};

export default async function CalculationPage() {
  const { items: data } = await getMarketData();

  if (!data) return null;

  return (
    <div className="bg-[#060606] min-h-screen text-white font-sans selection:bg-gold-primary selection:text-black">
      <Ticker items={data} />

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gold-primary transition-colors text-sm font-bold uppercase tracking-widest">
          <ArrowLeft size={16} />
          Ana Sayfaya Dön
        </Link>

        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="bg-gold-primary/20 p-3 rounded-2xl border border-gold-primary/20">
              <Calculator size={32} className="text-gold-primary" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter">
              Gram Altın <span className="text-gold-primary">Hesaplama</span>
            </h1>
          </div>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl font-medium">
            Sahip olduğunuz altın ve döviz miktarını girerek, güncel piyasa değerini anında Türk Lirası cinsinden öğrenin. 
            Verilerimiz <strong>Kapalıçarşı</strong> ve <strong>Harem Altın</strong> akışlarıyla %100 uyumludur.
          </p>
        </header>

        {/* The Tool */}
        <section className="relative z-10 shadow-3xl shadow-gold-primary/5">
          <Converter items={data} />
        </section>

        {/* SEO Article for this page */}
        <article className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-8 md:p-12 space-y-10">
          <div className="space-y-6 text-gray-400 leading-relaxed font-normal">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <Info className="text-gold-primary" size={24} />
              Altın Hesaplama Nasıl Yapılır?
            </h2>
            <p>
              Altın hesaplama işlemi, elinizdeki altının türüne (gram, çeyrek, yarım vb.) ve o anki <strong>canlı satış fiyatına</strong> dayanır. 
              Örneğin, 10 gram altınınız varsa ve gram altın fiyatı 3000 TL ise toplam değeriniz 30.000 TL olacaktır. 
              Ancak çeyrek ve yarım altın gibi ürünlerde işçilik farkları oluşabildiğinden, sitemizdeki araç en güncel toptan piyasa verilerini kullanarak size en yakın sonucu verir.
            </p>

            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <HelpCircle className="text-blue-500" size={24} />
              Hangi Altın Türlerini Hesaplayabilirim?
            </h2>
            <p>
              Altıncınız hesaplama modülü ile aşağıdaki seçeneklerin tamamını tek tıkla çevirebilirsiniz:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-bold text-gray-300">
              <li className="flex items-center gap-2 bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                <span className="w-2 h-2 bg-gold-primary rounded-full" /> 24 Ayar (Has) Gram Altın
              </li>
              <li className="flex items-center gap-2 bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                <span className="w-2 h-2 bg-gold-primary rounded-full" /> Yeni ve Eski Çeyrek Altın
              </li>
              <li className="flex items-center gap-2 bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                <span className="w-2 h-2 bg-gold-primary rounded-full" /> 22 Ayar Bilezik Fiyatı
              </li>
              <li className="flex items-center gap-2 bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                <span className="w-2 h-2 bg-gold-primary rounded-full" /> Yarım, Tam ve Ata Altın
              </li>
              <li className="flex items-center gap-2 bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" /> Dolar ve Euro (Döviz)
              </li>
            </ul>
          </div>
          
          <div className="pt-8 border-t border-white/5 text-center">
            <p className="text-xs text-gray-500 italic">
              * Bu veriler bilgilendirme amaçlıdır. Ticari işlemleriniz için kuyumcunuzdan teyit alınız.
            </p>
          </div>
        </article>

      </main>
    </div>
  );
}
