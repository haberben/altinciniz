import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMarketData } from '@/lib/api';
import { SEO_GUIDES } from '@/lib/guides';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import PriceCard from '@/components/PriceCard';
import Converter from '@/components/Converter';
import AutoRefresh from '@/components/AutoRefresh';
import Link from 'next/link';

export const revalidate = 30;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = SEO_GUIDES[params.slug];
  if (!guide) {
    return { title: 'Rehber Bulunamadı' };
  }

  return {
    title: guide.metaTitle,
    description: guide.description,
    alternates: {
      canonical: `/altin/${guide.slug}`,
    },
    openGraph: {
      type: 'article',
      title: guide.title,
      description: guide.description,
      url: `https://altinciniz.com/altin/${guide.slug}`,
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const guide = SEO_GUIDES[params.slug];
  if (!guide) {
    notFound();
  }

  const { items, updateDate, updatedIso } = await getMarketData();
  const selectedItem = items.find((i) => i.slug === guide.assetSlug) || items[0];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://altinciniz.com';

  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Altın Rehberleri', item: `${siteUrl}/altin/gram-altin-fiyati-2026` },
          { '@type': 'ListItem', position: 3, name: guide.title, item: `${siteUrl}/altin/${guide.slug}` },
        ],
      },
      {
        '@type': 'Article',
        headline: guide.title,
        description: guide.description,
        dateModified: updatedIso,
        author: { '@type': 'Organization', name: 'Altıncınız' },
        publisher: { '@type': 'Organization', name: 'Altıncınız', url: siteUrl },
      },
      {
        '@type': 'FAQPage',
        mainEntity: guide.faqs.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
    ],
  };

  return (
    <>
      <AutoRefresh intervalMs={30000} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />

      <SiteHeader items={items} updateDate={updateDate} activePath="/" />

      <main className="page-wrapper">
        <div className="page-content animate-in">
          {/* Breadcrumb */}
          <nav className="breadcrumb" aria-label="Sayfa konumu">
            <Link href="/">Ana Sayfa</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/${selectedItem.slug}`}>{selectedItem.name}</Link>
            <span aria-hidden="true">/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{guide.title}</span>
          </nav>

          {/* Başlık */}
          <div className="card" style={{ padding: '24px 24px' }}>
            <span className="badge-gold" style={{ marginBottom: 10 }}>{guide.badge}</span>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 10px', lineHeight: 1.25 }}>
              {guide.title}
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0, maxWidth: 820 }}>
              {guide.intro}
            </p>
          </div>

          {/* İki Kolonlu İçerik */}
          <div className="responsive-two-col">
            <div style={{ display: 'grid', gap: 16 }}>
              {selectedItem && <PriceCard item={selectedItem} />}
              <Converter items={items} defaultSlug={guide.assetSlug} />

              <div className="seo-section">
                <h3>Diğer Rehberler</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0', display: 'grid', gap: 8, fontSize: 13 }}>
                  {Object.values(SEO_GUIDES)
                    .filter((g) => g.slug !== guide.slug)
                    .map((g) => (
                      <li key={g.slug}>
                        <Link href={`/altin/${g.slug}`} style={{ color: 'var(--gold-dark)', fontWeight: 600, textDecoration: 'none' }}>
                          → {g.title}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 16 }}>
              {guide.sections.map((sec) => (
                <article key={sec.heading} className="seo-section">
                  <h2>{sec.heading}</h2>
                  {sec.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </article>
              ))}

              <section className="seo-section">
                <h2>Sıkça Sorulan Sorular</h2>
                <div style={{ display: 'grid', gap: 12 }}>
                  {guide.faqs.map(({ q, a }) => (
                    <details key={q} open style={{ borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                      <summary style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer' }}>{q}</summary>
                      <p style={{ marginTop: 6 }}>{a}</p>
                    </details>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
