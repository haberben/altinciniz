import { MetadataRoute } from 'next';
import { ASSET_SPECS } from '@/lib/assets';
import { ALL_GUIDE_SLUGS } from '@/lib/guides';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://altinciniz.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/hesaplama`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hakkimizda`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/iletisim`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/gizlilik-politikasi`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  const assetRoutes: MetadataRoute.Sitemap = Object.keys(ASSET_SPECS).map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: now,
    changeFrequency: 'always',
    priority: ['gram-altin', 'ceyrek-altin', '22-ayar-bilezik', 'cumhuriyet-altini', 'dolar', 'euro'].includes(slug)
      ? 0.95
      : 0.85,
  }));

  const guideRoutes: MetadataRoute.Sitemap = ALL_GUIDE_SLUGS.map((slug) => ({
    url: `${baseUrl}/altin/${slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [...staticRoutes, ...assetRoutes, ...guideRoutes];
}
