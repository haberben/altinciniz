import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'], display: 'swap' });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://altinciniz.com';

export const viewport: Viewport = {
  themeColor: '#1b2f52',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Gram Altın Fiyatı (Canlı) – Bugün Gram ve Çeyrek Altın Ne Kadar? | Altıncınız',
    template: '%s | Altıncınız',
  },
  description:
    'Anlık Kapalıçarşı ve serbest piyasa gram altın, çeyrek altın, yarım altın, tam altın, 22 ayar bilezik, banka altın makasları ve canlı döviz kurları.',
  applicationName: 'Altıncınız',
  authors: [{ name: 'Altıncınız', url: siteUrl }],
  creator: 'Altıncınız',
  publisher: 'Altıncınız',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: siteUrl,
    title: 'Canlı Gram Altın, Çeyrek Altın ve Döviz Fiyatları | Altıncınız',
    description:
      'Kapalıçarşı ve serbest piyasa canlı altın fiyatları, 12 banka gram altın makas karşılaştırması ve anlık altın hesaplama aracı.',
    siteName: 'Altıncınız',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Canlı Altın Fiyatları & Döviz Kurları | Altıncınız',
    description: 'Gram altın, çeyrek altın, 22 ayar bilezik, döviz ve banka makaslarını anlık takip edin.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Altıncınız',
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/apple-icon.png`,
          width: 180,
          height: 180,
        },
        description:
          'Kapalıçarşı ve serbest piyasa canlı altın fiyatları, döviz kurları, banka makas karşılaştırmaları ve altın hesaplama araçları sunan finans veri platformu.',
        areaServed: 'TR',
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Altıncınız',
        inLanguage: 'tr-TR',
        publisher: { '@id': `${siteUrl}/#organization` },
      },
    ],
  };

  return (
    <html lang="tr">
      <body className={`${inter.className} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
