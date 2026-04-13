import type { MetadataRoute } from 'next';

import { envConfigs } from '@/config';
import { locales } from '@/config/locale';
import { docsSource, pagesSource, postsSource } from '@/core/docs/source';
import {
  getAllExperiments,
  getAllSubjectsWithCounts,
  getStandardsForSubject,
} from '@/shared/lib/experiments/registry';
import { getPublishedPaths } from '@/shared/models/learning_path';
import { getPosts, PostStatus, PostType } from '@/shared/models/post';

function getLocalizedUrl(baseUrl: string, locale: string, path: string) {
  const normalizedPath = path === '/' ? '' : path;
  const prefix = locale === 'en' ? '' : `/${locale}`;
  return `${baseUrl}${prefix}${normalizedPath}`;
}

function appendLocalizedEntries(
  entries: MetadataRoute.Sitemap,
  seenUrls: Set<string>,
  input: {
    path: string;
    lastModified?: Date;
    changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority?: number;
  }
) {
  for (const locale of locales) {
    const url = getLocalizedUrl(baseUrl, locale, input.path);
    if (seenUrls.has(url)) {
      continue;
    }

    seenUrls.add(url);
    entries.push({
      url,
      lastModified: input.lastModified,
      changeFrequency: input.changeFrequency,
      priority: input.priority,
    });
  }
}

const baseUrl = envConfigs.app_url || 'https://scivra.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    '/',
    '/labs',
    '/learn',
    '/pricing',
    '/gallery',
    '/blog',
    '/ap-prep',
    '/showcases',
    '/updates',
    '/privacy',
    '/terms',
    '/children-privacy',
    '/cookie-policy',
  ];

  const subjects = getAllSubjectsWithCounts();
  const experiments = getAllExperiments();
  const entries: MetadataRoute.Sitemap = [];
  const seenUrls = new Set<string>();

  for (const page of staticPages) {
    appendLocalizedEntries(entries, seenUrls, {
      path: page,
      lastModified: new Date(),
      changeFrequency:
        page === '/' ? 'daily' : page === '/labs' || page === '/learn' ? 'weekly' : 'monthly',
      priority: page === '/' ? 1.0 : page === '/labs' ? 0.95 : page === '/learn' ? 0.9 : 0.8,
    });
  }

  for (const { subject } of subjects) {
    appendLocalizedEntries(entries, seenUrls, {
      path: `/labs/${subject}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    });

    const standards = getStandardsForSubject(subject);
    for (const standard of standards) {
      appendLocalizedEntries(entries, seenUrls, {
        path: `/labs/${subject}/${standard}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
      });
    }
  }

  for (const exp of experiments) {
    appendLocalizedEntries(entries, seenUrls, {
      path: `/labs/${exp.subject}/${exp.primaryStandard}/${exp.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  const localPostParams = postsSource.generateParams('slug', 'locale') as Array<{
    slug?: string[];
    locale?: string;
  }>;
  const localPageParams = pagesSource.generateParams('slug', 'locale') as Array<{
    slug?: string[];
    locale?: string;
  }>;
  const docsParams = docsSource.generateParams('slug', 'locale') as Array<{
    slug?: string[];
    locale?: string;
  }>;

  for (const params of localPostParams) {
    const slug = params.slug?.join('/');
    const locale = params.locale || 'en';
    if (!slug) continue;
    const url = getLocalizedUrl(baseUrl, locale, `/blog/${slug}`);
    if (seenUrls.has(url)) continue;

    seenUrls.add(url);
    entries.push({
      url,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    });
  }

  for (const params of localPageParams) {
    const slug = params.slug?.join('/');
    const locale = params.locale || 'en';
    if (!slug || slug === 'privacy-policy' || slug === 'terms-of-service') {
      continue;
    }
    const url = getLocalizedUrl(baseUrl, locale, `/${slug}`);
    if (seenUrls.has(url)) continue;

    seenUrls.add(url);
    entries.push({
      url,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.45,
    });
  }

  for (const params of docsParams) {
    const slug = params.slug?.join('/') || '';
    const locale = params.locale || 'en';
    const url = getLocalizedUrl(baseUrl, locale, slug ? `/docs/${slug}` : '/docs');
    if (seenUrls.has(url)) continue;

    seenUrls.add(url);
    entries.push({
      url,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: slug ? 0.65 : 0.7,
    });
  }

  try {
    const [publishedPaths, publishedPosts] = await Promise.all([
      getPublishedPaths(),
      getPosts({
        type: PostType.ARTICLE,
        status: PostStatus.PUBLISHED,
        limit: 500,
      }),
    ]);

    for (const path of publishedPaths) {
      appendLocalizedEntries(entries, seenUrls, {
        path: `/learn/${path.slug}`,
        lastModified: path.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }

    for (const post of publishedPosts) {
      if (!post.slug) continue;

      appendLocalizedEntries(entries, seenUrls, {
        path: `/blog/${post.slug}`,
        lastModified: post.updatedAt || post.createdAt,
        changeFrequency: 'monthly',
        priority: 0.75,
      });
    }
  } catch {
    // Sitemap generation should degrade gracefully when DB-backed content is unavailable.
  }

  return entries;
}
