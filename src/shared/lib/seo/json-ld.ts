import type { Experiment } from '@/shared/types/experiment';

import { getAbsoluteUrl, getLocalizedPath, normalizeSeoText } from '@/shared/lib/seo';

const SITE_NAME = 'Scivra';

/**
 * HTML-safe JSON serializer for embedding JSON-LD payloads inside <script>
 * tags via dangerouslySetInnerHTML. JSON.stringify alone is NOT safe for
 * inline script bodies — a payload that contains '</script>' (or unescaped
 * '<', '&', U+2028, U+2029) lets attacker-controlled content (DB rows, MDX
 * frontmatter, user-edited admin posts) break out of the script and execute
 * arbitrary code. Always use this instead of bare JSON.stringify when the
 * payload is going into innerHTML.
 *
 * See https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
 */
export function serializeJsonLd(payload: unknown): string {
  return JSON.stringify(payload)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

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
 * Build a BreadcrumbList JSON-LD blob.
 * Pass an ordered list of {name, url} starting from the site root.
 */
export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Build a generic WebPage JSON-LD for content pages that don't fit a more
 * specific type (Article/Product/Course/etc).
 */
export function buildWebPageJsonLd(input: {
  name: string;
  description: string;
  url: string;
  siteUrl: string;
  siteName: string;
  locale: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: input.name,
    description: input.description,
    url: input.url,
    inLanguage: input.locale,
    isPartOf: {
      '@type': 'WebSite',
      name: input.siteName,
      url: input.siteUrl,
    },
  };
}

/**
 * Build a SoftwareApplication JSON-LD for product/tool pages (UPG etc).
 */
export function buildSoftwareApplicationJsonLd(input: {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
  priceRange?: string;
  operatingSystem?: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: input.name,
    description: input.description,
    url: input.url,
    applicationCategory: input.applicationCategory ?? 'EducationalApplication',
    operatingSystem: input.operatingSystem ?? 'Web',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: '0',
      availability: 'https://schema.org/InStock',
    },
    ...(input.priceRange && {
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'USD',
        priceRange: input.priceRange,
      },
    }),
  };
}

/**
 * Build a BlogPosting JSON-LD for individual blog post pages.
 */
export function buildBlogPostingJsonLd(input: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  author?: string;
  image?: string;
  siteUrl: string;
  siteName: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.headline,
    description: input.description,
    url: input.url,
    datePublished: input.datePublished,
    author: {
      '@type': input.author ? 'Person' : 'Organization',
      name: input.author ?? input.siteName,
    },
    publisher: {
      '@type': 'Organization',
      name: input.siteName,
      url: input.siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${input.siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': input.url,
    },
    ...(input.image && { image: input.image }),
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
 *
 * Note: emits Course + CourseInstance. Only safe for paths whose body content
 * actually meets Google's Course schema bar (clear learning outcomes, multiple
 * lessons, time required). For thin paths use buildLearningPathBasicJsonLd
 * to avoid schema-content mismatch warnings.
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

/**
 * Build a lightweight WebPage + BreadcrumbList pair for learning paths whose
 * body content is too thin to justify the full Course schema.
 *
 * Returns a tuple so callers can render two <script> tags. Use this until
 * the path's on-page content (learning outcomes, lessons, time) catches up
 * with Google's Course schema expectations.
 */
export function buildLearningPathBasicJsonLd(input: {
  title: string;
  description: string;
  slug: string;
  siteUrl: string;
  locale: string;
}): [Record<string, unknown>, Record<string, unknown>] {
  const { title, description, slug, siteUrl, locale } = input;
  const url = getAbsoluteUrl(getLocalizedPath(`/learn/${slug}`, locale));
  const learnHubUrl = getAbsoluteUrl(getLocalizedPath('/learn', locale));

  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    inLanguage: locale,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: siteUrl,
    },
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Learn', item: learnHubUrl },
      { '@type': 'ListItem', position: 3, name: title, item: url },
    ],
  };

  return [webPage, breadcrumb];
}
