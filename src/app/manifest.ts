import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Altıncınız – Canlı Altın & Döviz Fiyatları',
    short_name: 'Altıncınız',
    description: 'Kapalıçarşı ve serbest piyasa anlık gram altın, çeyrek altın, döviz kurları ve banka makas karşılaştırması.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f0f2f5',
    theme_color: '#1b2f52',
    lang: 'tr',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
