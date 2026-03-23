import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Altinciniz - Gerçek Zamanlı Altın ve Döviz Fiyatları",
  description: "Altinciniz ile canlı gram altın, çeyrek altın, yarım, dolar ve euro kurlarını anlık olarak takip edin.",
  keywords: "gram altın, altın, çeyrek kaç tl, yarım kaç tl, dolar kuru, euro kuru, harem altın",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-background text-white antialiased selection:bg-gold-primary selection:text-black`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
