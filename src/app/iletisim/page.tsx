import { getMarketData } from '@/lib/api';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'İletişim ve Geri Bildirim',
  description: 'Altıncınız platformu hakkında öneri, veri bildirimi ve kurumsal iş birliği kanalları.',
  alternates: { canonical: '/iletisim' },
};

export default async function ContactPage() {
  const { items, updateDate } = await getMarketData();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://altinciniz.com';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'İletişim', item: `${siteUrl}/iletisim` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteHeader items={items} updateDate={updateDate} activePath="/iletisim" />

      <main className="page-wrapper">
        <div className="page-content animate-in">
          <nav className="breadcrumb" aria-label="Sayfa konumu">
            <Link href="/">Ana Sayfa</Link>
            <span aria-hidden="true">/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>İletişim</span>
          </nav>

          <article className="seo-section" style={{ display: 'grid', gap: 16 }}>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              İletişim ve Veri Geri Bildirimi
            </h1>
            <p>
              Altıncınız platformunda yer alan canlı piyasa tabloları, hesaplama araçları veya teknik altyapı ile ilgili görüş ve düzeltme talepleriniz için bizimle iletişime geçebilirsiniz.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              <div style={{ padding: 18, background: 'var(--bg-table-h)', border: '1px solid var(--border)', borderRadius: 10 }}>
                <h2 style={{ fontSize: 15, margin: '0 0 8px' }}>Veri Doğruluğu &amp; Düzeltme</h2>
                <p style={{ margin: 0 }}>
                  Herhangi bir altın, döviz veya banka satırında gecikme ya da olağandışı kur farkı fark ederseniz, ilgili sayfa bağlantısını ve ekran saati bilgisini paylaşmanız inceleme sürecini hızlandırır.
                </p>
              </div>
              <div style={{ padding: 18, background: 'var(--bg-table-h)', border: '1px solid var(--border)', borderRadius: 10 }}>
                <h2 style={{ fontSize: 15, margin: '0 0 8px' }}>Editoryal &amp; Sorumluluk</h2>
                <p style={{ margin: 0 }}>
                  Altıncınız bir bilgi ekranıdır; doğrudan altın alım-satımı, aracılık veya bireysel portföy danışmanlığı hizmeti vermemektedir.
                </p>
              </div>
            </div>
          </article>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
