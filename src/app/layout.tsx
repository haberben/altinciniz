import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://altinciniz.com'),
  title: {
    default: "Altinciniz | Canlı Gram Altın, Çeyrek Altın ve Döviz Kurları (Harem Altın Kalitesinde)",
    template: "%s | Altinciniz"
  },
  description: "Anlık gram altın, çeyrek altın, yarım altın, tam altın ve canlı döviz kurları. Harem altın fiyatları, Kapalıçarşı piyasası ve en şeffaf altın grafikleri Altinciniz'de.",
  keywords: ["gram altın", "çeyrek altın", "yarım altın", "tam altın", "harem altın", "harem altın fiyatları", "canlı altın", "kapalıçarşı altın fiyatları", "döviz kurları", "dolar kuru", "euro kuru"],
  authors: [{ name: "Altinciniz" }],
  creator: "Altinciniz",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://altinciniz.com",
    title: "Canlı Gram Altın, Çeyrek Altın ve Döviz Fiyatları",
    description: "En güncel ve anlık altın fiyatları, çeyrek altın kaç TL, gram altın ne kadar? Harem altın verileri ve Kapalıçarşı fiyatları.",
    siteName: "Altinciniz",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-background text-white antialiased selection:bg-gold-primary selection:text-black`}>
        {/* JSON-LD Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
             __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FinancialService",
                "name": "Altinciniz",
                "url": "https://altinciniz.com",
                "logo": "https://altinciniz.com/logo.png",
                "description": "Gerçek zamanlı kapalıçarşı altın ve döviz fiyatları. Gram altın, çeyrek altın ve harem altın verilerini anlık takip edin.",
                "areaServed": "TR",
                "sameAs": [
                   "https://instagram.com/altinciniz"
                ]
             })
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
