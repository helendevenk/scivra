'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { CtaParticleConvergence } from './CtaParticleConvergence';
import { AcademicLighting } from '../academic/AcademicLighting';
import { useScrollProgress } from '@/shared/hooks/useScrollProgress';

interface CtaBackgroundProps {
  containerRef: React.RefObject<HTMLElement>;
}

function CtaBackgroundInner({ containerRef }: CtaBackgroundProps) {
  const { isVisible } = useScrollProgress(containerRef);

  if (!isVisible) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ antialias: false, alpha: true }}
      dpr={1}
      style={{ background: 'transparent' }}
      aria-hidden="true"
    >
      <AcademicLighting />
      <CtaParticleConvergence containerRef={containerRef} />
    </Canvas>
  );
}

export const CtaBackground = dynamic(
  () => Promise.resolve(CtaBackgroundInner),
  { ssr: false }
);
