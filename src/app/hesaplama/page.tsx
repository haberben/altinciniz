import { getMarketData } from '@/lib/api';
import { formatAssetPrice } from '@/lib/assets';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Converter from '@/components/Converter';
import AutoRefresh from '@/components/AutoRefresh';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 20;

export const metadata: Metadata = {
  title: 'Canlı Altın ve Döviz Hesaplama Aracı (Gram, Çeyrek, Bilezik)',
  description:
    'Canlı Kapalıçarşı fiyatlarıyla gram altın, çeyrek altın, 22 ayar bilezik, yarım, tam, Cumhuriyet altını ve döviz hesaplama aracı. Anlık alış-satış tutarı hesaplayın.',
  alternates: {
    canonical: '/hesaplama',
  },
  openGraph: {
    title: 'Canlı Altın Hesaplama Aracı | Altıncınız',
    description: 'Elinizdeki altın ve dövizin anlık alış-satış değerini saniyeler içinde hesaplayın.',
    url: 'https://altinciniz.com/hesaplama',
  },
};

export default async function CalculationPage() {
  const { items, updateDate, updateDateLong } = await getMarketData();

  const gramAltin = items.find((i) => i.slug === 'gram-altin');
  const ceyrek = items.find((i) => i.slug === 'ceyrek-altin');
  const bilezik22 = items.find((i) => i.slug === '22-ayar-bilezik');
  const tamAltin = items.find((i) => i.slug === 'tam-altin');
  const cumhuriyet = items.find((i) => i.slug === 'cumhuriyet-altini');
  const dolar = items.find((i) => i.slug === 'dolar');

  const sample10Gram = gramAltin ? formatAssetPrice(gramAltin.priceSelling * 10, gramAltin) : '—';
  const sample5Ceyrek = ceyrek ? formatAssetPrice(ceyrek.priceSelling * 5, ceyrek) : '—';
  const sample20Bilezik = bilezik22 ? formatAssetPrice(bilezik22.priceSelling * 20, bilezik22) : '—';

  const faqs = [
    {
      q: '10 gram altın bugün kaç TL eder?',
      a: `Canlı satış fiyatına göre 10 gram 24 ayar altın yaklaşık ${sample10Gram} değerindedir. Bozdurma (alış) karşılığını yukarıdaki hesaplama aracından görebilirsiniz.`,
    },
    {
      q: '20 gram 22 ayar bilezik ne kadar tutar?',
      a: `22 ayar gram baz satış fiyatına göre 20 gram bileziğin ham karşılığı ${sample20Bilezik} tutarındadır. Mağazada modele göre işçilik farkı eklenebilir.`,
    },
    {
      q: '5 adet çeyrek altın kaç TL yapar?',
      a: `Güncel Kapalıçarşı satış fiyatıyla 5 adet çeyrek altın toplam ${sample5Ceyrek} tutmaktadır.`,
    },
  ];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://altinciniz.com';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Altın Hesaplama', item: `${siteUrl}/hesaplama` },
        ],
      },
      {
        '@type': 'WebApplication',
        name: 'Altıncınız Canlı Altın ve Döviz Hesaplama',
        url: `${siteUrl}/hesaplama`,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'All',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
    ],
  };

  const quickPresets = [
    { label: '5 Gram Altın', item: gramAltin, qty: 5 },
    { label: '10 Gram Altın', item: gramAltin, qty: 10 },
    { label: '50 Gram Altın', item: gramAltin, qty: 50 },
    { label: '100 Gram Altın', item: gramAltin, qty: 100 },
    { label: '5 Adet Çeyrek Altın', item: ceyrek, qty: 5 },
    { label: '20 Gram 22 Ayar Bilezik', item: bilezik22, qty: 20 },
    { label: '3 Adet Tam Altın', item: tamAltin, qty: 3 },
    { label: '2 Adet Cumhuriyet Altını', item: cumhuriyet, qty: 2 },
    { label: '1.000 Amerikan Doları', item: dolar, qty: 1000 },
  ].filter((p): p is { label: string; item: NonNullable<typeof p.item>; qty: number } => Boolean(p.item));

  return (
    <>
      <AutoRefresh intervalMs={20000} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SiteHeader items={items} updateDate={updateDate} activePath="/hesaplama" />

      <main className="page-wrapper">
        <div className="page-content animate-in">
          <nav className="breadcrumb" aria-label="Sayfa konumu">
            <Link href="/">Ana Sayfa</Link>
            <span aria-hidden="true">/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Altın &amp; Döviz Hesaplama</span>
          </nav>

          <div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 6px' }}>
              Canlı Altın ve Döviz Hesaplama Aracı
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
              {updateDateLong} itibarıyla güncel Kapalıçarşı kurları üzerinden hem bozdurma (alış) hem satın alma (satış) tutarını hesaplayın.
            </p>
          </div>

          {/* İnteraktif Hesaplayıcı */}
          <Converter items={items} defaultSlug="gram-altin" />

          {/* Hazır Özet Tablosu */}
          <section className="card" style={{ overflow: 'hidden' }}>
            <div className="card-header">
              <h2 className="card-header-title">Sık Hesaplanan Altın ve Döviz Tutarları</h2>
              <span className="live-badge">Canlı</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="price-table" aria-label="Popüler hesaplama örnekleri">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', paddingLeft: 20 }}>Hesaplama Kalemi</th>
                    <th style={{ textAlign: 'right' }}>Bozdurma (Alış)</th>
                    <th style={{ textAlign: 'right', paddingRight: 20 }}>Satış Tutarı</th>
                  </tr>
                </thead>
                <tbody>
                  {quickPresets.map(({ label, item, qty }) => (
                    <tr key={label}>
                      <td style={{ paddingLeft: 20 }}>
                        <Link href={`/${item.slug}`} className="price-name" style={{ textDecoration: 'none' }}>
                          {label}
                        </Link>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="price-buy">{formatAssetPrice(item.priceBuying * qty, item)}</span>
                      </td>
                      <td style={{ textAlign: 'right', paddingRight: 20 }}>
                        <span className="price-sell">{formatAssetPrice(item.priceSelling * qty, item)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Bilgilendirme + SSS */}
          <div className="responsive-two-col">
            <section className="seo-section">
              <h2>Altın Hesaplama Nasıl Yapılır?</h2>
              <p>
                Altın ve döviz hesaplamasında dikkat edilmesi gereken en önemli nokta, elinizdeki varlığı bozduracaksanız <strong>Alış</strong> sütununu, satın alacaksanız <strong>Satış</strong> sütununu referans almaktır.
              </p>
              <p>
                Örneğin elinizde 10 gram altın varsa, güncel satış değeri yaklaşık <strong>{sample10Gram}</strong> seviyesindedir. Aracımız tüm altın türlerini (gram, çeyrek, yarım, tam, Cumhuriyet, 22 ayar bilezik) ve majör dövizleri otomatik güncel kurla çarpar.
              </p>
            </section>

            <section className="seo-section">
              <h2>Hesaplama Hakkında Sık Sorulanlar</h2>
              <div style={{ display: 'grid', gap: 12 }}>
                {faqs.map(({ q, a }) => (
                  <details key={q} open style={{ borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                    <summary style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer' }}>{q}</summary>
                    <p style={{ marginTop: 6 }}>{a}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
