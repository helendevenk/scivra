import { MetadataRoute } from 'next';

import { getSiteUrl } from '@/shared/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const appUrl = getSiteUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/*?*q=',
        '/settings/*',
        '/activity/*',
        '/admin/*',
        '/api/*',
        '/dashboard/*',
        '/chat/*',
        '/notebooks/*',
        '/embed/*',
      ],
    },
    sitemap: `${appUrl}/sitemap.xml`,
    host: appUrl,
  };
}
