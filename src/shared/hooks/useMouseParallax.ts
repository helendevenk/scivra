'use client';

import { useState, useEffect, useRef } from 'react';
import { useIsMobile } from './use-mobile';

interface ParallaxOffset {
  x: number;
  y: number;
}

export function useMouseParallax(dampingFactor = 0.05): ParallaxOffset {
  const isMobile = useIsMobile();
  const [offset, setOffset] = useState<ParallaxOffset>({ x: 0, y: 0 });
  const targetRef = useRef<ParallaxOffset>({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    };

    const animate = () => {
      setOffset((prev) => ({
        x: prev.x + (targetRef.current.x - prev.x) * dampingFactor,
        y: prev.y + (targetRef.current.y - prev.y) * dampingFactor,
      }));
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile, dampingFactor]);

  return isMobile ? { x: 0, y: 0 } : offset;
}
