import { getMarketData } from '@/lib/api';
import { formatAssetPrice } from '@/lib/assets';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import PriceCard from '@/components/PriceCard';
import GoldTabTable from '@/components/GoldTabTable';
import DataTable from '@/components/DataTable';
import BankTable from '@/components/BankTable';
import Converter from '@/components/Converter';
import AutoRefresh from '@/components/AutoRefresh';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 15;

export const metadata: Metadata = {
  title: 'Gram Altın Fiyatı (Canlı) – Bugün Gram Altın ve Çeyrek Altın Ne Kadar? | Altıncınız',
  description:
    'Anlık Kapalıçarşı gram altın, çeyrek altın, yarım altın, tam altın, cumhuriyet altını ve 22 ayar bilezik fiyatları. Serbest piyasa karşılaştırması, 12 banka makas tablosu ve canlı altın hesaplama.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Canlı Kapalıçarşı Altın Fiyatları & Döviz Kurları | Altıncınız',
    description:
      'Gram altın, çeyrek altın, 22 ayar bilezik, banka makasları ve döviz kurları saniyeler içinde güncel.',
  },
};

export default async function Home() {
  const { items, serbestItems, banks, updateDate, updateDateLong, updatedIso, activeSource } = await getMarketData();

  if (!items?.length) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        Piyasa verileri şu anda yüklenemiyor. Lütfen birkaç saniye sonra sayfayı yenileyin.
      </main>
    );
  }

  const goldOrder = [
    'gram-altin', 'has-altin', '22-ayar-bilezik', '18-ayar-altin', '14-ayar-altin',
    'ceyrek-altin', 'ceyrek-eski', 'yarim-altin', 'yarim-eski',
    'tam-altin', 'tam-eski', 'cumhuriyet-altini', 'ata-altin', 'besli-ata', 'gremse-altin',
  ];
  const tableGolds = [
    ...goldOrder.map((s) => items.find((i) => i.slug === s)).filter(Boolean),
    ...items.filter((i) => i.type === 'gold' && !goldOrder.includes(i.slug)),
  ] as typeof items;

  const currencies = items.filter((i) => i.type === 'currency');
  const metals = items.filter((i) => i.type === 'metal');

  const gramAltin = items.find((i) => i.slug === 'gram-altin');
  const ceyrek = items.find((i) => i.slug === 'ceyrek-altin');
  const bilezik22 = items.find((i) => i.slug === '22-ayar-bilezik');
  const dolar = items.find((i) => i.slug === 'dolar');
  const euro = items.find((i) => i.slug === 'euro');

  const faqs = [
    {
      q: 'Bugün gram altın ne kadar?',
      a: `Anlık Kapalıçarşı verilerine göre gram altın alış fiyatı ${gramAltin ? formatAssetPrice(gramAltin.priceBuying, gramAltin) : 'canlı tablodan'}, satış fiyatı ise ${gramAltin ? formatAssetPrice(gramAltin.priceSelling, gramAltin) : 'güncel olarak'} seviyesindedir.`,
    },
    {
      q: 'Çeyrek altın kaç TL oldu?',
      a: `Bugün yeni tarihli çeyrek altın alış ${ceyrek ? formatAssetPrice(ceyrek.priceBuying, ceyrek) : 'güncel'}, satış ${ceyrek ? formatAssetPrice(ceyrek.priceSelling, ceyrek) : 'canlı'} fiyattan işlem görmektedir. Çeyrek altın 22 ayar olup 1,75 gram ağırlığındadır.`,
    },
    {
      q: '22 ayar bilezik gram fiyatı ne kadar?',
      a: `22 ayar bilezik (%91,6 saflık) anlık gram satış fiyatı ${bilezik22 ? formatAssetPrice(bilezik22.priceSelling, bilezik22) : 'tabloda yer aldığı şekildedir'}. Model işçiliğine göre vitrin fiyatı değişebilir.`,
    },
    {
      q: 'Has altın ile gram altın arasındaki fark nedir?',
      a: 'Has altın %99,5-%99,9 saflıkta ham 24 ayar altındır ve tüm kuyumcu fiyatlamalarının bazını oluşturur. Paketli gram altınlarda rafineri ve ambalaj maliyeti nedeniyle küçük fark bulunabilir.',
    },
    {
      q: 'Kapalıçarşı ve banka altın fiyatları neden farklıdır?',
      a: 'Kapalıçarşı fiziki arz-talep ve dar makasla çalışırken, bankalar dijital altın alım-satımında özellikle mesai saatleri dışında daha geniş makas aralığı uygulayabilir. Banka makas tablomuzdan en uygun kurumu kıyaslayabilirsiniz.',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  };

  const quickLinks = [
    { label: 'Gram Altın Fiyatı', href: '/gram-altin' },
    { label: 'Çeyrek Altın Ne Kadar?', href: '/ceyrek-altin' },
    { label: '22 Ayar Bilezik Gram', href: '/22-ayar-bilezik' },
    { label: 'Cumhuriyet Altını', href: '/cumhuriyet-altini' },
    { label: 'Tam Altın Fiyatı', href: '/tam-altin' },
    { label: 'Yarım Altın Fiyatı', href: '/yarim-altin' },
    { label: 'Ata Altın Fiyatı', href: '/ata-altin' },
    { label: 'Canlı Dolar Kuru', href: '/dolar' },
    { label: 'Canlı Euro Kuru', href: '/euro' },
    { label: 'Gümüş Gram Fiyatı', href: '/gumus' },
    { label: 'Altın Hesaplama Aracı', href: '/hesaplama' },
    { label: 'Gram Altın 2026 Analizi', href: '/altin/gram-altin-fiyati-2026' },
  ];

  return (
    <>
      <AutoRefresh intervalMs={20000} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <SiteHeader items={items} updateDate={updateDate} activePath="/" />

      <main className="page-wrapper">
        <div className="page-content animate-in">
          {/* Sayfa Başlığı + Canlı Tarih */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 6px', lineHeight: 1.25 }}>
                Kapalıçarşı ve Serbest Piyasa Canlı Altın Fiyatları{' '}
                <span className="live-badge" style={{ verticalAlign: 'middle', marginLeft: 4 }}>
                  ANLIK
                </span>
              </h1>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                {updateDateLong} · Aktif Akış: <strong style={{ color: 'var(--text-primary)' }}>{activeSource}</strong> · Son Güncelleme:{' '}
                <time dateTime={updatedIso} style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                  {updateDate}
                </time>
              </p>
            </div>
          </div>

          {/* Hızlı Özet Kartları */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {[gramAltin, ceyrek, dolar, euro]
              .filter((x): x is NonNullable<typeof x> => Boolean(x))
              .map((item) => (
                <PriceCard key={item.slug} item={item} />
              ))}
          </div>

          {/* Sekmeli Altın Tablosu (Kapalıçarşı / Serbest Piyasa / Karşılaştırma) */}
          <GoldTabTable items={tableGolds} serbestItems={serbestItems} />

          {/* Döviz ve Değerli Madenler */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            <DataTable items={currencies} title="Canlı Döviz Kurları" />
            {metals.length > 0 && <DataTable items={metals} title="Değerli Madenler & Ons" />}
          </div>

          {/* Banka Karşılaştırma Tablosu */}
          <BankTable banks={banks} />

          {/* Hesaplama Aracı */}
          <section aria-label="Canlı altın hesaplama aracı">
            <Converter items={items} />
          </section>

          {/* Popüler Aramalar Dahili Link Ağı */}
          <section className="seo-section">
            <h2>Hızlı Altın, Döviz ve Hesaplama Sayfaları</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {quickLinks.map((q) => (
                <Link
                  key={q.href}
                  href={q.href}
                  prefetch={false}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 999,
                    border: '1px solid var(--border-strong)',
                    background: 'var(--bg-table-h)',
                    color: 'var(--text-primary)',
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  {q.label}
                </Link>
              ))}
            </div>
          </section>

          {/* SEO Piyasa Rehberi */}
          <section className="seo-section">
            <h2>Kapalıçarşı ve Serbest Piyasada Altın Fiyatları Nasıl Oluşur?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
              <div>
                <h3>Gram ve Has Altın Fiyatı</h3>
                <p>
                  Türkiye’de gram altın değeri, küresel ons altın (XAU/USD) fiyatının 31,1035’e bölünüp canlı Dolar/TL kuru ile çarpılmasıyla belirlenir.
                  Bugün gram altın satış fiyatı {gramAltin ? formatAssetPrice(gramAltin.priceSelling, gramAltin) : 'canlı tabloda'} seviyesindedir.
                </p>
              </div>
              <div>
                <h3>Çeyrek, Yarım ve Cumhuriyet Altını</h3>
                <p>
                  Darphane basımı sarrafiye ürünleri 22 ayar (%91,6 saflık) altından üretilir. Çeyrek altın 1,75 gr, yarım altın 3,50 gr, ziynet tam altın 7,00 gr ve Cumhuriyet (Ata) altını 7,216 gr ağırlığındadır.
                </p>
              </div>
              <div>
                <h3>Kapalıçarşı vs Banka Makas Farkı</h3>
                <p>
                  Alış (bozdurma) ile satış fiyatı arasındaki fark &ldquo;makas&rdquo; olarak adlandırılır. Piyasa saatlerinde Kapalıçarşı ve dijital banka makaslarını tablomuzdan karşılaştırarak maliyeti düşürebilirsiniz.
                </p>
              </div>
              <div>
                <h3>Serbest Piyasa (Toptan / Harem) Karşılaştırması</h3>
                <p>
                  Sekmeli altın tablomuzdaki &ldquo;Piyasa Karşılaştırma&rdquo; görünümü sayesinde Kapalıçarşı perakende ekranı ile serbest piyasa toptan referans fiyatları arasındaki TL farkını anında görebilirsiniz.
                </p>
              </div>
            </div>
          </section>

          {/* Sık Sorulan Sorular (Schema ile Birebir Uyumlu) */}
          <section className="seo-section">
            <h2>Sık Sorulan Sorular</h2>
            <div style={{ display: 'grid', gap: 14 }}>
              {faqs.map(({ q, a }) => (
                <details key={q} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
                  <summary style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer' }}>{q}</summary>
                  <p style={{ marginTop: 8 }}>{a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
