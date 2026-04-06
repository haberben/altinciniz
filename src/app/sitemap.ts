import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://altinciniz.com';

// Direct supabase client just for fetching slugs (no auth needed for public profiles)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/hesaplama`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/altin/gram-altin-fiyati-2026`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/altin/gram-altin-dun-ne-kadardi`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/altin/22-ayar-bilezik-fiyatlari-2026`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // 2. Dynamic Gold/Currency Routes
  // Harcoded the main ones we want to rank highly for
  const assetSlugs = [
    'gram-altin',
    'ceyrek-altin',
    'yarim-altin',
    'tam-altin',
    'cumhuriyet-altini',
    'ata-altin',
    'has-altin',
    'gremse-altin',
    '22-ayar-bilezik',
    '18-ayar-altin',
    '14-ayar-altin',
    'gumus',
    'dolar',
    'euro',
    'sterlin'
  ];

  const assetRoutes: MetadataRoute.Sitemap = assetSlugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'always', // Prices update constantly
    priority: 0.9,
  }));

  return [...staticRoutes, ...assetRoutes];
}
