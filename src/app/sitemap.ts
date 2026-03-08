import type { MetadataRoute } from 'next';

import { envConfigs } from '@/config';
import { getAllExperiments } from '@/shared/lib/experiments/registry';

const locales = ['en', 'zh'];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = envConfigs.app_url || 'https://seephysics.com';

  const staticPages = [
    '',
    '/experiments',
    '/upg',
    '/upg/my',
    '/pricing',
    '/gallery',
    '/blog',
    '/privacy-policy',
    '/terms-of-service',
    '/children-privacy',
    '/cookie-policy',
  ];

  const experimentSlugs = getAllExperiments().map((e) => e.slug);

  const blogSlugs = [
    'newtons-laws-with-vectors',
    'projectile-motion-common-mistakes',
    'what-is-xxx',
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    for (const locale of locales) {
      const prefix = locale === 'en' ? '' : `/${locale}`;
      entries.push({
        url: `${baseUrl}${prefix}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
      });
    }
  }

  for (const slug of experimentSlugs) {
    for (const locale of locales) {
      const prefix = locale === 'en' ? '' : `/${locale}`;
      entries.push({
        url: `${baseUrl}${prefix}/experiments/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
      });
    }
  }

  for (const slug of blogSlugs) {
    for (const locale of locales) {
      const prefix = locale === 'en' ? '' : `/${locale}`;
      entries.push({
        url: `${baseUrl}${prefix}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
