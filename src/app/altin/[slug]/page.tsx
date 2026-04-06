import React from 'react';
import { Metadata } from 'next';
import { getMarketData } from '@/lib/api';
import Link from 'next/link';
import PriceCard from '@/components/PriceCard';
import AutoRefresh from '@/components/AutoRefresh';

interface Props {
  params: { slug: string };
}

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
    alternates: {
      canonical: `/altin/${params.slug}`,
    },
  };
}

export default async function ProgrammaticSEOPage({ params }: Props) {
  const { items: data } = await getMarketData();
  const { title, description, type } = parseSlug(params.slug);

  const selectedItem = data?.find(item => 
    type === "GRAM" ? item.slug === "gram-altin" : 
    type === "CEYREK" ? item.slug === "ceyrek-altin" : true
  ) || data?.[0];

  return (
    <main style={{ minHeight: "100vh", padding: "40px 0" }}>
      <AutoRefresh intervalMs={30000} />
      <div className="page-wrapper">
        
        {/* Breadcrumb */}
        <nav style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>
          <Link href="/" style={{ textDecoration: "none", color: "var(--text-secondary)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/" style={{ textDecoration: "none", color: "var(--text-secondary)" }}>Altın Fiyatları</Link>
          <span>/</span>
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{title}</span>
        </nav>

        {/* Dynamic Header */}
        <div style={{ paddingBottom: 24, borderBottom: "1px solid var(--border)", marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: "var(--text-primary)", marginBottom: 12 }}>
            {title}
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 800 }}>
            {description} Altın piyasasındaki son dakika gelişmeleri ve canlı verilerle hazırlanan özel analiz sayfamız.
          </p>
        </div>

        {/* Action Section */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32, '@media (minWidth: 992px)': { gridTemplateColumns: "1fr 2fr" } } as any}>
          <div>
            {selectedItem && (
              <PriceCard item={selectedItem} />
            )}
            <div className="card" style={{ marginTop: 24, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--gold-dark)", marginBottom: 12 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800 }}>Hızlı Bilgi</h3>
              </div>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                Bu sayfa, <strong>{params.slug}</strong> aramasına yönelik özel olarak dinamik verilerle oluşturulmuştur. 
                Buradaki veriler Kapalıçarşı serbest piyasa kurlarıyla anlık olarak güncellenmektedir.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <section className="seo-section">
              <h2>Piyasa Analizi</h2>
              <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, display: "flex", flexDirection: "column", gap: 16 }}>
                <p>
                  Altın fiyatları son dönemde küresel enflasyon verileri ve merkez bankalarının faiz kararlarıyla şekillenmekte. 
                  <strong> {title}</strong> konusu, yatırımcıların en çok merak ettiği başlıklar arasında yer alıyor.
                </p>
                <p>
                  Genellikle "güvenli liman" olarak adlandırılan altın, belirsiz dönemlerde portföylerin vazgeçilmezi olmaya devam ediyor. 2026 projeksiyonları ve geçmiş veriler ışığında yaptığımız analizler, piyasa volatilitesinin bir süre daha devam edebileceğini gösteriyor.
                </p>
                <div style={{ background: "var(--gold-bg)", borderLeft: "4px solid var(--gold)", padding: 16, borderRadius: "0 8px 8px 0" }}>
                  <p style={{ fontSize: 14, color: "var(--gold-dark)", fontStyle: "italic", margin: 0 }}>
                    "Altın yatırımı yaparken sadece anlık fiyatları değil, uzun vadeli trendleri ve küresel ekonomik takvimi de göz önünde bulundurmak önemlidir."
                  </p>
                </div>
              </div>
            </section>

            <section className="seo-section">
              <h2>Sıkça Sorulan Sorular</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 16 }}>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>{title} hakkında en doğru veriye nereden ulaşırım?</h4>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>Altıncınız olarak Kapalıçarşı verilerini harmanlayarak en şeffaf kurları sunmaktayız.</p>
                </div>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>Piyasa makas aralıkları neden değişir?</h4>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>Arz ve talep dengesi, işlem hacmi ve piyasa saatleri dışındaki volatilite makas aralıklarının açılmasına neden olabilir.</p>
                </div>
              </div>
            </section>
          </div>
        </div>

      </div>
    </main>
  );
}
