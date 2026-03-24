import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://altinciniz.com';

// Direct supabase client just for fetching slugs (no auth needed for public profiles)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

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
      url: `${baseUrl}/kuyumcu-paneli`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/giris`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
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

  // 3. Dynamic Jeweler Profiles
  let jewelerRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: profiles } = await supabase
      .from('jeweler_profiles')
      .select('slug, updated_at')
      .filter('is_approved', 'eq', true);

    if (profiles) {
      jewelerRoutes = profiles.map((profile) => ({
        url: `${baseUrl}/kuyumcular/${profile.slug}`,
        lastModified: profile.updated_at ? new Date(profile.updated_at) : new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error("Sitemap: Failed to fetch jeweler profiles", error);
  }

  return [...staticRoutes, ...assetRoutes, ...jewelerRoutes];
}
