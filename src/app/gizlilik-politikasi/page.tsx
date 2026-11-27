import { getMarketData } from '@/lib/api';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Gizlilik Politikası ve Yasal Uyarı',
  description: 'Altıncınız.com gizlilik politikası, çerez kullanımı, anonim trafik ölçümü ve finansal veri sorumluluk reddi metni.',
  alternates: { canonical: '/gizlilik-politikasi' },
};

export default async function PrivacyPage() {
  const { items, updateDate } = await getMarketData();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://altinciniz.com';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Gizlilik Politikası', item: `${siteUrl}/gizlilik-politikasi` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteHeader items={items} updateDate={updateDate} activePath="/gizlilik-politikasi" />

      <main className="page-wrapper">
        <div className="page-content animate-in">
          <nav className="breadcrumb" aria-label="Sayfa konumu">
            <Link href="/">Ana Sayfa</Link>
            <span aria-hidden="true">/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Gizlilik Politikası</span>
          </nav>

          <article className="seo-section" style={{ display: 'grid', gap: 14 }}>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              Gizlilik Politikası, Çerezler ve Yasal Uyarı
            </h1>
            <p>
              Altıncınız.com olarak ziyaretçilerimizin gizliliğine önem veriyoruz. Platformumuz üyelik veya kişisel kimlik bilgisi talep etmeden herkese açık piyasa verilerini sunar.
            </p>

            <h2>Toplanan Veriler ve Analitik</h2>
            <p>
              Sitemizin performansını ve sayfa açılış hızlarını izleyebilmek amacıyla gizlilik odaklı, çerezsiz/anonimleştirilmiş istatistikler (Vercel Analytics) kullanılabilir. Tarafınızdan ad, telefon veya finansal hesap bilgisi talep edilmez.
            </p>

            <h2>Finansal Sorumluluk Reddi</h2>
            <p>
              Sayfalarımızda paylaşılan Kapalıçarşı, serbest piyasa, banka makasları ve hesaplama sonuçları yalnızca bilgilendirme amaçlıdır. Yatırım kararlarınızda SPK lisanslı kurum ve danışmanlardan destek almanız önerilir.
            </p>
          </article>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
