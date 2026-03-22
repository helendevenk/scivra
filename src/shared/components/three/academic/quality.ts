export type QualityTier = 'high' | 'medium' | 'low' | 'static';

export interface QualityPreset {
  pixelRatio: number;
  antialias: boolean;
  shadows: boolean;
  depthOfField: boolean;
  particleCount: number;
  animationEnabled: boolean;
}

export const QUALITY_PRESETS: Record<QualityTier, QualityPreset> = {
  high: {
    pixelRatio: 2,
    antialias: true,
    shadows: true,
    depthOfField: true,
    particleCount: 200,
    animationEnabled: true,
  },
  medium: {
    pixelRatio: 1.5,
    antialias: true,
    shadows: false,
    depthOfField: false,
    particleCount: 100,
    animationEnabled: true,
  },
  low: {
    pixelRatio: 1,
    antialias: false,
    shadows: false,
    depthOfField: false,
    particleCount: 50,
    animationEnabled: true,
  },
  static: {
    pixelRatio: 1,
    antialias: false,
    shadows: false,
    depthOfField: false,
    particleCount: 0,
    animationEnabled: false,
  },
};
