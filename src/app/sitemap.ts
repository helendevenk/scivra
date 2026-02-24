import type { MetadataRoute } from 'next';

import { envConfigs } from '@/config';
import { getAllExperiments } from '@/shared/lib/experiments/registry';

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = envConfigs.app_url.replace(/\/+$/, '');
  const now = new Date();
  const experiments = getAllExperiments();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${appUrl}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${appUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${appUrl}/experiments`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${appUrl}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${appUrl}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${appUrl}/terms-of-service`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const experimentRoutes: MetadataRoute.Sitemap = experiments.map((exp) => ({
    url: `${appUrl}/experiments/${exp.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...experimentRoutes];
}
