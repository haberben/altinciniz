import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://altinciniz.com'),
  title: {
    default: "Gram Altın Fiyatı (Canlı) – Bugün Gram Altın Ne Kadar? | Altıncınız",
    template: "%s | Altıncınız – Canlı Altın & Döviz"
  },
  description: "Altıncınız: Anlık gram altın fiyatı, çeyrek altın ne kadar, yarım altın, tam altın ve tüm döviz kurları. Harem altın, Kapalıçarşı, canlı altın fiyatları. 7/24 güncel altın piyasası ve fiyat takibi.",
  keywords: [
    // Temel altın aramaları
    "gram altın ne kadar", "gram altın fiyatı", "gram altın",
    "çeyrek altın ne kadar", "çeyrek altın fiyatı", "çeyrek altın kaç tl",
    "yarım altın ne kadar", "yarım altın fiyatı",
    "tam altın ne kadar", "tam altın fiyatı",
    "altın fiyatları", "altın fiyatları bugün",
    // Canlı & anlık
    "anlık altın fiyat", "canlı altın fiyatları", "altın canlı fiyat", "altın canlı",
    "altın fiyatları canlı", "altın anlık", "canlı altın",
    // Harem & Kapalıçarşı
    "harem altın", "harem altın fiyatları", "altın fiyatları harem altın",
    "kapalı çarşı altın fiyatları", "kapalı çarşı altın", "kapalıçarşı altın fiyatları",
    // Ons
    "ons altın", "ons altın fiyatı", "altın ons", "altın ons fiyatı",
    // Gramaj bazlı
    "1 gram altın ne kadar", "10 gram altın ne kadar", "100 gram altın ne kadar",
    "5 gram altın ne kadar", "bir gram altın ne kadar",
    // Tarihsel & grafik
    "altın fiyatları grafik", "gram altın grafik", "altın gram grafik",
    "altın 1 yıllık grafik", "altın son dakika",
    // Şehir bazlı
    "istanbul altın fiyatları", "istanbul kapalı çarşı altın fiyatları",
    "izmir altın fiyatları", "ankara altın fiyatları", "bursa altın fiyatları",
    "konya altın fiyatları", "antalya altın fiyatları",
    // Yatırım & hesaplama
    "altın hesaplama", "altın yorum", "altın yorumları",
    "altın yükselecek mi", "altın artacak mı",
    // Banka altın
    "vakıfbank altın fiyatları", "ziraat altın", "ziraat bankası altın fiyatları",
    // Özel türler
    "cumhuriyet altın fiyatı", "reşat altın ne kadar",
    "külçe altın", "has altın", "saf altın",
    "22 ayar altın gram fiyatı", "24 ayar gram altın fiyatı",
    // Döviz bağlantılı
    "dolar altın", "altın dolar", "döviz altın",
    "altın ve döviz",
    // Harem altın
    "harem altın", "harem gram altın", "harem altın fiyatları",
    "canlı harem altın fiyatları", "harem altın canlı", "harem altın ne kadar",
    "harem altın gram", "harem döviz", "harem altın çeyrek", "harem altın gümüş",
    "kuyumcu altın fiyatları canlı harem", "gram altın harem", "altın gram harem",
    // Kuyumcu altın fiyatları
    "kuyumcu altın fiyatları", "kuyumcu altın fiyatları canlı",
    "kuyumcu gram altın fiyatı", "kuyumcu gram altın fiyatları canlı",
    "kuyumcu çeyrek altın fiyatı", "kuyumcu 24 ayar gram altın fiyatı",
    "kuyumcu 22 ayar gram altın", "kuyumcu altın",
    "kuyumcu gram altın", "canlı kuyumcu ekranı",
    // Genel
    "altın piyasası", "altın borsa", "altın satış", "altın alış",
    "Altıncınız", "altinciniz",
  ],
  authors: [{ name: "Altıncınız" }],
  creator: "Altıncınız",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://altinciniz.com",
    title: "Canlı Gram Altın, Çeyrek Altın ve Döviz Fiyatları",
    description: "En güncel ve anlık altın fiyatları, çeyrek altın kaç TL, gram altın ne kadar? Harem altın verileri ve Kapalıçarşı fiyatları.",
    siteName: "Altıncınız",
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
    <html lang="tr" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Anti-flash: read localStorage and apply theme before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('altinciniz-theme');var theme=(t==='light')?'light':'dark';document.documentElement.setAttribute('data-theme',theme);document.documentElement.classList.add(theme);}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased selection:bg-gold-primary selection:text-black`}>
        {/* JSON-LD Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
             __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FinancialService",
                "name": "Altıncınız",
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
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
