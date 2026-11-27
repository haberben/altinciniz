import { getMarketData } from '@/lib/api';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Hakkımızda ve Veri Metodolojisi',
  description: 'Altıncınız canlı altın, döviz ve banka makas verilerini nasıl derler? Şeffaf veri metodolojimiz ve platform ilkelerimiz hakkında bilgi alın.',
  alternates: { canonical: '/hakkimizda' },
};

export default async function AboutPage() {
  const { items, updateDate } = await getMarketData();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://altinciniz.com';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Hakkımızda', item: `${siteUrl}/hakkimizda` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteHeader items={items} updateDate={updateDate} activePath="/hakkimizda" />

      <main className="page-wrapper">
        <div className="page-content animate-in">
          <nav className="breadcrumb" aria-label="Sayfa konumu">
            <Link href="/">Ana Sayfa</Link>
            <span aria-hidden="true">/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Hakkımızda</span>
          </nav>

          <article className="seo-section" style={{ display: 'grid', gap: 16 }}>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              Altıncınız Hakkında ve Veri Metodolojisi
            </h1>
            <p>
              <strong>Altıncınız</strong>, Türkiye’deki bireysel yatırımcılar ve tasarruf sahipleri için Kapalıçarşı, Kuyumcular Odası ve serbest piyasa altın fiyatlarını, majör döviz kurlarını ve banka dijital altın makaslarını tek bir hızlı ekranda sunan bağımsız bir finansal veri platformudur.
            </p>

            <h2>Verilerimiz Nasıl Güncellenir?</h2>
            <p>
              Sistemimiz çoklu piyasa veri sağlayıcılarından 15–30 saniyelik aralıklarla canlı veri senkronizasyonu gerçekleştirir. Hem perakende kuyumcu ekranı (Kapalıçarşı / Kuyumcular Odası) hem de toptan serbest piyasa referans değerleri ayrı ayrı işlenerek kullanıcılara şeffaf bir karşılaştırma olanağı sunulur.
            </p>

            <h2>Platform İlkelerimiz</h2>
            <p>
              • <strong>Şeffaf Makas Gösterimi:</strong> Alış ve satış fiyatları arasındaki farkı hem TL hem yüzde bazında gizlemeden gösteririz.<br />
              • <strong>Gerçek Banka Kıyaslaması:</strong> Dijital bankacılıkta gram altın makaslarını en dar makastan başlayarak sıralarız.<br />
              • <strong>Bilgilendirme Odaklılık:</strong> Sunulan tüm rakamlar piyasa takibi ve eğitim amaçlıdır; yatırım danışmanlığı kapsamında değildir.
            </p>
          </article>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
