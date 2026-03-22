'use client';

import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Environment } from '@react-three/drei';
import type { ReactNode } from 'react';
import { AcademicLighting } from './AcademicLighting';
import { useQualityTier } from '@/shared/hooks/useQualityTier';
import { QUALITY_PRESETS } from './quality';

interface AcademicCanvasProps {
  children: ReactNode;
  cameraPosition?: [number, number, number];
  className?: string;
}

function PostProcessing({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return (
    <EffectComposer>
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.4}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
    </EffectComposer>
  );
}

export function AcademicCanvas({
  children,
  cameraPosition = [0, 0, 5],
  className,
}: AcademicCanvasProps) {
  const tier = useQualityTier();
  const preset = QUALITY_PRESETS[tier];
  const enableEffects = tier === 'high' || tier === 'medium';

  return (
    <Canvas
      camera={{ position: cameraPosition, fov: 50 }}
      gl={{
        antialias: preset.antialias,
        alpha: true,
        toneMapping: 3,
      }}
      dpr={preset.pixelRatio}
      style={{ background: 'transparent' }}
      className={className}
      resize={{ scroll: false }}
    >
      <AcademicLighting />
      <Environment preset="studio" environmentIntensity={0.3} />
      {children}
      <PostProcessing enabled={enableEffects} />
    </Canvas>
  );
}
