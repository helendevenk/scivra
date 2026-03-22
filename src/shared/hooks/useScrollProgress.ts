'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface ScrollProgress {
  isVisible: boolean;
  progress: number;
}

export function useScrollProgress(
  ref: React.RefObject<HTMLElement>
): ScrollProgress {
  const [state, setState] = useState<ScrollProgress>({
    isVisible: false,
    progress: 0,
  });
  const observerRef = useRef<IntersectionObserver | null>(null);

  const updateProgress = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementHeight = rect.height;

    const distanceFromBottom = windowHeight - rect.top;
    const totalDistance = windowHeight + elementHeight;
    const raw = distanceFromBottom / totalDistance;
    const clamped = Math.min(1, Math.max(0, raw));

    setState((prev) => ({ ...prev, progress: clamped }));
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setState((prev) => ({
          ...prev,
          isVisible: entry.isIntersecting,
        }));
      },
      { threshold: 0 }
    );
    observerRef.current.observe(el);

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener('scroll', updateProgress);
    };
  }, [ref, updateProgress]);

  return state;
}
