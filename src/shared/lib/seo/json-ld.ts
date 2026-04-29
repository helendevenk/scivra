import type { Experiment } from '@/shared/types/experiment';

import { getAbsoluteUrl, getLocalizedPath, normalizeSeoText } from '@/shared/lib/seo';

const SITE_NAME = 'Scivra';

/**
 * Build JSON-LD structured data for an experiment page.
 * Returns a plain object ready to be serialized into a <script type="application/ld+json"> tag.
 */
export function buildExperimentJsonLd(input: {
  experiment: Experiment;
  siteUrl: string;
  locale?: string;
}): Record<string, unknown> {
  const { experiment, siteUrl, locale = 'en' } = input;
  const url = getAbsoluteUrl(
    getLocalizedPath(
      `/labs/${experiment.subject}/${experiment.primaryStandard}/${experiment.slug}`,
      locale
    )
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: normalizeSeoText(experiment.seoTitle) || experiment.title,
    description: experiment.description,
    url,
    educationalLevel: mapDifficultyToLevel(experiment.difficulty),
    learningResourceType: 'Interactive simulation',
    interactivityType: 'active',
    isAccessibleForFree: experiment.tier === 'free',
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: siteUrl,
    },
    about: {
      '@type': 'Thing',
      name: experiment.category,
    },
  };
}

function mapDifficultyToLevel(difficulty: string): string {
  switch (difficulty) {
    case 'beginner':
      return 'Beginner';
    case 'intermediate':
      return 'Intermediate';
    case 'advanced':
      return 'Advanced';
    default:
      return 'Beginner';
  }
}

/**
 * Build JSON-LD for the website (homepage).
 */
export function buildWebsiteJsonLd(input: {
  siteUrl: string;
  siteName: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: input.siteName,
    url: input.siteUrl,
  };
}

/**
 * Build JSON-LD for the website with a SearchAction potential action.
 * Used on the homepage so Google knows how to deep-link search queries.
 */
export function buildWebsiteSearchActionJsonLd(input: {
  siteUrl: string;
  siteName: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: input.siteName,
    url: input.siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${input.siteUrl}/labs?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Build JSON-LD for the publishing Organization (Scivra).
 */
export function buildOrganizationJsonLd(input: {
  siteUrl: string;
  siteName: string;
  logoPath?: string;
}): Record<string, unknown> {
  const logoPath = input.logoPath ?? '/logo.png';
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: input.siteName,
    url: input.siteUrl,
    logo: `${input.siteUrl}${logoPath}`,
    sameAs: [],
  };
}

/**
 * Build a FAQPage JSON-LD blob from a list of question/answer pairs.
 * Returns null when there are no items so callers can conditionally render.
 */
export function buildFaqPageJsonLd(
  items: Array<{ question: string; answer: string }> | undefined | null
): Record<string, unknown> | null {
  if (!items || items.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/**
 * Build JSON-LD structured data for a learning path detail page.
 */
export function buildLearningPathJsonLd(input: {
  title: string;
  description: string;
  slug: string;
  level: string;
  category: string;
  nodeCount: number;
  siteUrl: string;
  locale: string;
}): Record<string, unknown> {
  const { title, description, slug, level, category, nodeCount, siteUrl, locale } = input;
  const url = getAbsoluteUrl(getLocalizedPath(`/learn/${slug}`, locale));

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: title,
    description,
    url,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: siteUrl,
    },
    educationalLevel: mapDifficultyToLevel(level),
    about: {
      '@type': 'Thing',
      name: category,
    },
    numberOfCredits: nodeCount,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: `${nodeCount} lessons`,
    },
  };
}
