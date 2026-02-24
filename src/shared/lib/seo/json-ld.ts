import type { Experiment } from '@/shared/types/experiment';

/**
 * Build JSON-LD structured data for an experiment page.
 * Returns a plain object ready to be serialized into a <script type="application/ld+json"> tag.
 */
export function buildExperimentJsonLd(input: {
  experiment: Experiment;
  siteUrl: string;
}): Record<string, unknown> {
  const { experiment, siteUrl } = input;
  const url = `${siteUrl.replace(/\/+$/, '')}/experiments/${experiment.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: experiment.seoTitle || experiment.title,
    description: experiment.description,
    url,
    educationalLevel: mapDifficultyToLevel(experiment.difficulty),
    learningResourceType: 'Interactive simulation',
    interactivityType: 'active',
    isAccessibleForFree: experiment.tier === 'free',
    provider: {
      '@type': 'Organization',
      name: 'NeonPhysics',
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
