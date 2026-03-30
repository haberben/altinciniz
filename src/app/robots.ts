import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://altinciniz.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',      // Keep admin paths hidden from search engines
        '/admin/*',
        '/api/*',      // Internal API endpoints
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
