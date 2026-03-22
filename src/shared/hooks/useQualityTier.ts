'use client';
/* eslint-disable react-hooks/refs, react-hooks/set-state-in-effect, react-hooks/purity, react-hooks/immutability, react-hooks/static-components */

import { useState, useEffect } from 'react';
import { useIsMobile } from './use-mobile';
import type { QualityTier } from '@/shared/components/three/academic/quality';

function detectWebGL2(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!canvas.getContext('webgl2');
  } catch {
    return false;
  }
}

export function useQualityTier(): QualityTier {
  const isMobile = useIsMobile();
  const [tier, setTier] = useState<QualityTier>('low');

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) {
      setTier('static');
      return;
    }

    const hasWebGL2 = detectWebGL2();
    const lowCPU =
      typeof navigator.hardwareConcurrency === 'number' &&
      navigator.hardwareConcurrency <= 4;

    if (!hasWebGL2 || lowCPU) {
      setTier('low');
      return;
    }

    if (isMobile) {
      setTier('medium');
      return;
    }

    setTier('high');
  }, [isMobile]);

  return tier;
}
