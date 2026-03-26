import type { MetadataRoute } from 'next';

import { envConfigs } from '@/config';
import {
  getAllExperiments,
  getAllSubjectsWithCounts,
  getStandardsForSubject,
} from '@/shared/lib/experiments/registry';

const locales = ['en', 'zh'];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = envConfigs.app_url || 'https://scivra.com';

  const staticPages = [
    '',
    '/labs',
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

  const subjects = getAllSubjectsWithCounts();
  const experiments = getAllExperiments();

  const blogSlugs = [
    'newtons-laws-with-vectors',
    'projectile-motion-common-mistakes',
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  for (const page of staticPages) {
    for (const locale of locales) {
      const prefix = locale === 'en' ? '' : `/${locale}`;
      entries.push({
        url: `${baseUrl}${prefix}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : page === '/labs' ? 'monthly' : 'weekly',
        priority: page === '' ? 1.0 : page === '/labs' ? 0.9 : 0.8,
      });
    }
  }

  // /labs/{subject} pages
  for (const { subject } of subjects) {
    for (const locale of locales) {
      const prefix = locale === 'en' ? '' : `/${locale}`;
      entries.push({
        url: `${baseUrl}${prefix}/labs/${subject}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.85,
      });
    }

    // /labs/{subject}/{standard} pages
    const standards = getStandardsForSubject(subject);
    for (const standard of standards) {
      for (const locale of locales) {
        const prefix = locale === 'en' ? '' : `/${locale}`;
        entries.push({
          url: `${baseUrl}${prefix}/labs/${subject}/${standard}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.85,
        });
      }
    }
  }

  // /labs/{subject}/{standard}/{slug} experiment pages
  for (const exp of experiments) {
    for (const locale of locales) {
      const prefix = locale === 'en' ? '' : `/${locale}`;
      entries.push({
        url: `${baseUrl}${prefix}/labs/${exp.subject}/${exp.primaryStandard}/${exp.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
      });
    }
  }

  // Blog pages
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
