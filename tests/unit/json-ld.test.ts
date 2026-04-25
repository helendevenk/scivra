import { describe, expect, it, vi } from 'vitest';

// buildExperimentJsonLd derives the canonical URL via getAbsoluteUrl(),
// which itself reads envConfigs.app_url — captured at module load time.
// vi.stubEnv comes too late to influence it. Mock the seo module's URL
// helpers directly so the URL assertions are stable and don't depend on
// .env contents or the module-load timing of envConfigs.
vi.mock('@/shared/lib/seo', async () => {
  const actual = await vi.importActual<typeof import('@/shared/lib/seo')>(
    '@/shared/lib/seo'
  );
  return {
    ...actual,
    getAbsoluteUrl: (path: string) => `https://www.scivra.com${path}`,
    getLocalizedPath: (path: string) => path,
  };
});

import {
  buildExperimentJsonLd,
  buildWebsiteJsonLd,
} from '@/shared/lib/seo/json-ld';
import type { Experiment } from '@/shared/types/experiment';

const mockExperiment: Experiment = {
  id: 'newtons-laws',
  slug: 'newtons-laws',
  subject: 'physics',
  primaryStandard: 'ngss-hs',
  title: "Newton's Laws of Motion",
  seoTitle: "Newton's Laws Interactive Simulation",
  seoKeywords: ['physics', 'newton'],
  description: "Explore Newton's three laws of motion.",
  category: 'mechanics',
  difficulty: 'beginner',
  tier: 'free',
  wave: 1,
  estimatedTime: 15,
  relatedExperiments: [],
  parameters: [],
  challenges: [],
  jsonLd: {},
} as unknown as Experiment;

describe('buildExperimentJsonLd', () => {
  it('returns valid LearningResource schema', () => {
    const result = buildExperimentJsonLd({
      experiment: mockExperiment,
      siteUrl: 'https://www.scivra.com',
    });

    expect(result['@context']).toBe('https://schema.org');
    expect(result['@type']).toBe('LearningResource');
    expect(result.name).toBe("Newton's Laws Interactive Simulation");
    // URL shape today is /labs/{subject}/{primaryStandard}/{slug}.
    expect(result.url).toBe(
      'https://www.scivra.com/labs/physics/ngss-hs/newtons-laws'
    );
    expect(result.isAccessibleForFree).toBe(true);
    expect(result.educationalLevel).toBe('Beginner');
  });

  it('falls back to title when seoTitle is empty', () => {
    const exp = { ...mockExperiment, seoTitle: '' };
    const result = buildExperimentJsonLd({
      experiment: exp as unknown as Experiment,
      siteUrl: 'https://www.scivra.com',
    });
    expect(result.name).toBe("Newton's Laws of Motion");
  });

  it('marks pro experiments as not free', () => {
    const exp = { ...mockExperiment, tier: 'pro' as const };
    const result = buildExperimentJsonLd({
      experiment: exp as unknown as Experiment,
      siteUrl: 'https://www.scivra.com',
    });
    expect(result.isAccessibleForFree).toBe(false);
  });

  it('maps difficulty levels correctly', () => {
    const intermediate = { ...mockExperiment, difficulty: 'intermediate' };
    const advanced = { ...mockExperiment, difficulty: 'advanced' };

    expect(
      buildExperimentJsonLd({
        experiment: intermediate as unknown as Experiment,
        siteUrl: 'https://x.com',
      }).educationalLevel
    ).toBe('Intermediate');

    expect(
      buildExperimentJsonLd({
        experiment: advanced as unknown as Experiment,
        siteUrl: 'https://x.com',
      }).educationalLevel
    ).toBe('Advanced');
  });

  it('produces a stable URL using {subject}/{primaryStandard}/{slug} path', () => {
    const result = buildExperimentJsonLd({
      experiment: mockExperiment,
      siteUrl: 'https://www.scivra.com/',
    });
    expect(result.url).toBe(
      'https://www.scivra.com/labs/physics/ngss-hs/newtons-laws'
    );
  });
});

describe('buildWebsiteJsonLd', () => {
  it('returns valid WebSite schema', () => {
    const result = buildWebsiteJsonLd({
      siteUrl: 'https://www.scivra.com',
      siteName: 'Scivra',
    });

    expect(result['@context']).toBe('https://schema.org');
    expect(result['@type']).toBe('WebSite');
    expect(result.name).toBe('Scivra');
    expect(result.url).toBe('https://www.scivra.com');
  });
});
