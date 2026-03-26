import React from 'react';
import { Metadata } from 'next';
import { getMarketData } from '@/lib/api';
import Link from 'next/link';
import { ChevronRight, Calendar, TrendingUp, Info } from 'lucide-react';
import PriceCard from '@/components/PriceCard';
import RichSEOContent from '@/components/RichSEOContent';

interface Props {
  params: { slug: string };
}

// Slug'dan anlamlı başlık ve veri çıkartan yardımcı fonksiyon
function parseSlug(slug: string) {
  const parts = slug.split('-');
  let title = "Altın Fiyatları";
  let description = "Güncel altın piyasası analizi ve canlı fiyatlar.";
  let type = "GENEL";

  if (slug.includes('gram-altin')) {
    title = "Gram Altın Fiyatı";
    type = "GRAM";
  } else if (slug.includes('ceyrek-altin')) {
    title = "Çeyrek Altın Fiyatı";
    type = "CEYREK";
  }

  if (slug.includes('dun')) {
    title += " Dün Ne Kadardı?";
    description = `${title} Geçmiş altın fiyatları ve piyasa değişimi incelemesi.`;
  } else if (slug.includes('2026')) {
    title += " 2026 Tahminleri ve Beklentiler";
    description = `2026 yılında ${title.toLowerCase()} ne olur? Uzman yorumları ve piyasa beklentileri.`;
  }

  return { title, description, type };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { title, description } = parseSlug(params.slug);
  return {
    title: `${title} | Altıncınız`,
    description: description,
  };
}

export default async function ProgrammaticSEOPage({ params }: Props) {
  const { items: data } = await getMarketData();
  const { title, description, type } = parseSlug(params.slug);

  // İlgili veriyi bul
  const selectedItem = data?.find(item => 
    type === "GRAM" ? item.slug === "gram-altin" : 
    type === "CEYREK" ? item.slug === "ceyrek-altin" : true
  ) || data?.[0];

  return (
    <main className="min-h-screen bg-[#060606] text-white pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-gold-primary transition-colors">Ana Sayfa</Link>
          <ChevronRight size={12} />
          <Link href="/" className="hover:text-gold-primary transition-colors">Altın Fiyatları</Link>
          <ChevronRight size={12} />
          <span className="text-gray-300">{title}</span>
        </nav>

        {/* Dynamic Header */}
        <div className="mb-12 border-b border-white/5 pb-8">
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-4 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
            {description} Altın piyasasındaki son dakika gelişmeleri ve canlı verilerle hazırlanan özel analiz sayfamız.
          </p>
        </div>

        {/* Action Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-1">
            {selectedItem && (
              <PriceCard item={selectedItem} featured={true} />
            )}
            <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-3xl">
              <div className="flex items-center gap-3 mb-4 text-gold-primary">
                <Calendar size={20} />
                <h3 className="font-bold">Hızlı Bilgi</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Bu sayfa, <strong>{params.slug}</strong> aramasına yönelik özel olarak dinamik verilerle oluşturulmuştur. 
                Buradaki veriler Kapalıçarşı serbest piyasa kurlarıyla anlık olarak güncellenmektedir.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-8">
            <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6 text-gold-primary">
                <TrendingUp size={24} />
                <h2 className="text-xl font-bold">Piyasa Analizi</h2>
              </div>
              <article className="prose prose-invert max-w-none text-gray-400 leading-relaxed space-y-4">
                <p>
                  Altın fiyatları son dönemde küresel enflasyon verileri ve merkez bankalarının faiz kararlarıyla şekillenmekte. 
                  <strong> {title}</strong> konusu, yatırımcıların en çok merak ettiği başlıklar arasında yer alıyor.
                </p>
                <p>
                  Genellikle "güvenli liman" olarak adlandırılan altın, belirsiz dönemlerde portföylerin vazgeçilmezi olmaya devam ediyor. 2026 projeksiyonları ve geçmiş veriler ışığında yaptığımız analizler, piyasa volatilitesinin bir süre daha devam edebileceğini gösteriyor.
                </p>
                <div className="bg-gold-primary/10 border-l-4 border-gold-primary p-4 rounded-r-xl">
                  <p className="text-gold-light text-sm italic">
                    "Altın yatırımı yaparken sadece anlık fiyatları değil, uzun vadeli trendleri ve küresel ekonomik takvimi de göz önünde bulundurmak önemlidir."
                  </p>
                </div>
              </article>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6 text-gold-primary">
                <Info size={24} />
                <h2 className="text-xl font-bold">Sıkça Sorulan Sorular</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-bold mb-2">{title} hakkında en doğru veriye nereden ulaşırım?</h4>
                  <p className="text-sm text-gray-400">Altıncınız.com olarak Harem Altın, Altınkaynak ve Kapalıçarşı verilerini harmanlayarak en şeffaf kurları sunmaktayız.</p>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">Piyasa makas aralıkları neden değişir?</h4>
                  <p className="text-sm text-gray-400">Arz ve talep dengesi, işlem hacmi ve piyasa saatleri dışındaki volatilite makas aralıklarının açılmasına neden olabilir.</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <RichSEOContent />
      </div>
    </main>
  );
}
