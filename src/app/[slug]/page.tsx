import { getMarketData } from '@/lib/api';
import { getAssetSpec, formatAssetPrice, SLUG_REDIRECTS, ASSET_SPECS } from '@/lib/assets';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Converter from '@/components/Converter';
import PriceCard from '@/components/PriceCard';
import AutoRefresh from '@/components/AutoRefresh';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 15;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const redirectTarget = SLUG_REDIRECTS[params.slug];
  if (redirectTarget) {
    return { title: 'Yönlendiriliyor...' };
  }

  const spec = getAssetSpec(params.slug);
  if (!spec) {
    return { title: 'Sayfa Bulunamadı' };
  }

  const { items, updateDateLong } = await getMarketData();
  const item = items.find((i) => i.slug === spec.slug);
  const priceText = item ? formatAssetPrice(item.priceSelling, item) : '';

  const title = priceText
    ? `${spec.name} Fiyatı: ${priceText} (${updateDateLong}) – Canlı Ne Kadar?`
    : `${spec.name} Fiyatı (Canlı) – ${spec.seoTitleSuffix}`;

  const description = item
    ? `${updateDateLong} canlı ${spec.name} alış ${formatAssetPrice(item.priceBuying, item)}, satış ${priceText}. ${spec.seoLead}`
    : spec.seoLead;

  return {
    title,
    description,
    alternates: {
      canonical: `/${spec.slug}`,
    },
    openGraph: {
      title: `${spec.name} Canlı Fiyatı ${priceText} | Altıncınız`,
      description,
      url: `https://altinciniz.com/${spec.slug}`,
    },
  };
}

export default async function AssetDetailPage({ params }: { params: { slug: string } }) {
  const redirectTarget = SLUG_REDIRECTS[params.slug];
  if (redirectTarget) {
    permanentRedirect(`/${redirectTarget}`);
  }

  const spec = getAssetSpec(params.slug);
  if (!spec) {
    notFound();
  }

  const { items, serbestItems, updateDate, updateDateLong, updatedIso } = await getMarketData();
  const item = items.find((i) => i.slug === spec.slug);

  if (!item) {
    notFound();
  }

  const serbestMatch = serbestItems.find((s) => s.slug === item.slug);
  const spread = Math.max(0, item.priceSelling - item.priceBuying);
  const spreadPct = item.priceSelling > 0 ? (spread / item.priceSelling) * 100 : 0;
  const isUp = (item.changePercent ?? 0) >= 0;

  const categoryLabel =
    item.type === 'gold' ? 'Altın Fiyatları' : item.type === 'currency' ? 'Döviz Kurları' : 'Değerli Madenler';

  const buyStr = formatAssetPrice(item.priceBuying, item);
  const sellStr = formatAssetPrice(item.priceSelling, item);

  const faqs = [
    {
      q: `Bugün ${spec.name} alış ve satış fiyatı ne kadar?`,
      a: `${updateDateLong} canlı verilerine göre ${spec.name} alış (bozdurma) fiyatı ${buyStr}, satış fiyatı ise ${sellStr} seviyesindedir.`,
    },
    {
      q: `${spec.name} alış-satış makası ne kadar?`,
      a: `Anlık piyasa ekranına göre ${spec.name} için alış ile satış arasındaki makas ${formatAssetPrice(spread, item)} (yaklaşık %${spreadPct.toFixed(2)}) düzeyindedir.`,
    },
    ...spec.extraFaq,
  ];

  const relatedItems = items
    .filter((i) => i.slug !== item.slug && (i.type === item.type || ['gram-altin', 'ceyrek-altin', 'dolar'].includes(i.slug)))
    .slice(0, 4);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://altinciniz.com';

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: categoryLabel, item: siteUrl },
          { '@type': 'ListItem', position: 3, name: spec.name, item: `${siteUrl}/${spec.slug}` },
        ],
      },
      {
        '@type': 'FinancialProduct',
        name: spec.name,
        description: spec.seoLead,
        url: `${siteUrl}/${spec.slug}`,
        offers: item.unit !== 'RATIO'
          ? {
              '@type': 'Offer',
              priceCurrency: item.unit === 'USD' ? 'USD' : 'TRY',
              price: item.priceSelling,
              availability: 'https://schema.org/InStock',
            }
          : undefined,
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

  return (
    <>
      <AutoRefresh intervalMs={20000} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <SiteHeader items={items} updateDate={updateDate} activePath={`/${spec.slug}`} />

      <main className="page-wrapper">
        <div className="page-content animate-in">
          {/* Breadcrumb */}
          <nav className="breadcrumb" aria-label="Sayfa konumu">
            <Link href="/">Ana Sayfa</Link>
            <span aria-hidden="true">/</span>
            <Link href="/">{categoryLabel}</Link>
            <span aria-hidden="true">/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{spec.name}</span>
          </nav>

          {/* Ana Fiyat Hero Kartı */}
          <section className="card" style={{ padding: '24px 24px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
              <div style={{ flex: '1 1 320px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                  <span className="live-badge">Canlı</span>
                  {spec.purity && <span className="badge-gold">{spec.purity}</span>}
                  {spec.weight && <span className="badge-gold">{spec.weight}</span>}
                </div>

                <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 10px', lineHeight: 1.2 }}>
                  {spec.name} Fiyatı Ne Kadar?
                </h1>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, margin: '0 0 14px', maxWidth: 640 }}>
                  {spec.seoLead}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
                  {updateDateLong} · Son Güncelleme:{' '}
                  <time dateTime={updatedIso} style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.updateTime || updateDate}
                  </time>
                </p>
              </div>

              {/* Sağ Alış / Satış Kutuları */}
              <div style={{ flex: '1 1 300px', maxWidth: 440, display: 'grid', gap: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ background: 'var(--bg-table-h)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                      Alış (Bozdurma)
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>{buyStr}</div>
                  </div>

                  <div style={{ background: 'var(--gold-bg)', border: '1px solid var(--gold-border)', borderRadius: 10, padding: '14px 16px' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--gold-dark)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                      Satış Fiyatı
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)' }}>{sellStr}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--bg-table-h)', borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }}>
                  <span>
                    Makas: <strong style={{ color: 'var(--text-primary)' }}>{formatAssetPrice(spread, item)}</strong> (%{spreadPct.toFixed(2)})
                  </span>
                  {item.changePercent !== undefined && (
                    <span className={isUp ? 'badge-up' : 'badge-down'}>
                      {isUp ? '▲' : '▼'} {Math.abs(item.changePercent).toFixed(2)}%
                    </span>
                  )}
                  {serbestMatch && serbestMatch.priceSelling !== item.priceSelling && (
                    <span style={{ color: 'var(--text-secondary)' }}>
                      Serbest: <strong>{formatAssetPrice(serbestMatch.priceSelling, item)}</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Hızlı Çoklu Miktar Tablosu (1, 5, 10, 50, 100 vb.) */}
          {spec.quickAmounts.length > 1 && item.unit === 'TRY' && (
            <section className="card" style={{ overflow: 'hidden' }}>
              <div className="card-header">
                <h2 className="card-header-title">Hızlı {spec.shortName} Hesaplama Tablosu</h2>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.75)' }}>
                  CANLI ÇARPAN
                </span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="price-table" aria-label={`${spec.name} miktar tablosu`}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', paddingLeft: 20 }}>Miktar</th>
                      <th style={{ textAlign: 'right' }}>Bozdurma (Alış Toplamı)</th>
                      <th style={{ textAlign: 'right', paddingRight: 20 }}>Satın Alma (Satış Toplamı)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spec.quickAmounts.map((qty) => (
                      <tr key={qty}>
                        <td style={{ paddingLeft: 20 }}>
                          <span className="price-name">
                            {new Intl.NumberFormat('tr-TR').format(qty)} {spec.unitLabel} {spec.shortName}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span className="price-buy">{formatAssetPrice(qty * item.priceBuying, item)}</span>
                        </td>
                        <td style={{ textAlign: 'right', paddingRight: 20 }}>
                          <span className="price-sell">{formatAssetPrice(qty * item.priceSelling, item)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Sayfa İçi Çevirici */}
          {item.unit === 'TRY' && (
            <section aria-label="Özel miktar hesaplama">
              <Converter items={items} defaultSlug={item.slug} />
            </section>
          )}

          {/* Ürün Hakkında Detaylı Rehber + SSS */}
          <div className="responsive-two-col">
            <section className="seo-section">
              <h2>{spec.name} Nedir ve Fiyatı Nasıl Belirlenir?</h2>
              <p>{spec.aboutText}</p>
              <p>
                Kapalıçarşı ve serbest piyasa arasındaki makas farklarını görmek için{' '}
                <Link href="/" style={{ color: 'var(--gold-dark)', fontWeight: 700 }}>
                  ana sayfadaki piyasa karşılaştırma tablosunu
                </Link>{' '}
                inceleyebilir veya özel tutarlar için{' '}
                <Link href="/hesaplama" style={{ color: 'var(--gold-dark)', fontWeight: 700 }}>
                  altın hesaplama aracını
                </Link>{' '}
                kullanabilirsiniz.
              </p>
            </section>

            <section className="seo-section">
              <h2>{spec.shortName} Sık Sorulan Sorular</h2>
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

          {/* İlgili Altın ve Döviz Sayfaları */}
          {relatedItems.length > 0 && (
            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px' }}>
                İlgili Canlı Piyasa Fiyatları
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }}>
                {relatedItems.map((rel) => (
                  <PriceCard key={rel.slug} item={rel} />
                ))}
              </div>
            </section>
          )}

          {/* Tüm Varlıklara Hızlı Erişim */}
          <section className="seo-section">
            <h2>Diğer Altın ve Döviz Fiyatları</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Object.values(ASSET_SPECS)
                .filter((s) => s.slug !== spec.slug)
                .map((s) => (
                  <Link
                    key={s.slug}
                    href={`/${s.slug}`}
                    prefetch={false}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 999,
                      border: '1px solid var(--border)',
                      background: 'var(--bg-table-h)',
                      color: 'var(--text-secondary)',
                      fontSize: 12,
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    {s.shortName}
                  </Link>
                ))}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
