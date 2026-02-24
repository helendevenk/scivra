import { describe, it, expect } from 'vitest';
import {
  buildExperimentJsonLd,
  buildWebsiteJsonLd,
} from '@/shared/lib/seo/json-ld';
import type { Experiment } from '@/shared/types/experiment';

const mockExperiment: Experiment = {
  id: 'newtons-laws',
  slug: 'newtons-laws',
  title: "Newton's Laws of Motion",
  seoTitle: "Newton's Laws Interactive Simulation",
  seoKeywords: ['physics', 'newton'],
  description: 'Explore Newton\'s three laws of motion.',
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
      siteUrl: 'https://www.neonphysics.com',
    });

    expect(result['@context']).toBe('https://schema.org');
    expect(result['@type']).toBe('LearningResource');
    expect(result.name).toBe("Newton's Laws Interactive Simulation");
    expect(result.url).toBe('https://www.neonphysics.com/experiments/newtons-laws');
    expect(result.isAccessibleForFree).toBe(true);
    expect(result.educationalLevel).toBe('Beginner');
  });

  it('falls back to title when seoTitle is empty', () => {
    const exp = { ...mockExperiment, seoTitle: '' };
    const result = buildExperimentJsonLd({
      experiment: exp as unknown as Experiment,
      siteUrl: 'https://www.neonphysics.com',
    });
    expect(result.name).toBe("Newton's Laws of Motion");
  });

  it('marks pro experiments as not free', () => {
    const exp = { ...mockExperiment, tier: 'pro' as const };
    const result = buildExperimentJsonLd({
      experiment: exp as unknown as Experiment,
      siteUrl: 'https://www.neonphysics.com',
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

  it('strips trailing slash from siteUrl', () => {
    const result = buildExperimentJsonLd({
      experiment: mockExperiment,
      siteUrl: 'https://www.neonphysics.com/',
    });
    expect(result.url).toBe('https://www.neonphysics.com/experiments/newtons-laws');
  });
});

describe('buildWebsiteJsonLd', () => {
  it('returns valid WebSite schema', () => {
    const result = buildWebsiteJsonLd({
      siteUrl: 'https://www.neonphysics.com',
      siteName: 'NeonPhysics',
    });

    expect(result['@context']).toBe('https://schema.org');
    expect(result['@type']).toBe('WebSite');
    expect(result.name).toBe('NeonPhysics');
    expect(result.url).toBe('https://www.neonphysics.com');
  });
});
