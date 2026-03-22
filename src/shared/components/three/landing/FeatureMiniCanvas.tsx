'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { AcademicLighting } from '../academic/AcademicLighting';
import { MoleculeScene } from './feature-scenes/MoleculeScene';
import { WaveScene } from './feature-scenes/WaveScene';
import { CircuitScene } from './feature-scenes/CircuitScene';
import { TelescopeScene } from './feature-scenes/TelescopeScene';
import { useScrollProgress } from '@/shared/hooks/useScrollProgress';
import { useQualityTier } from '@/shared/hooks/useQualityTier';

export type FeatureSceneType = 'molecule' | 'wave' | 'circuit' | 'telescope';

const SCENE_MAP: Record<FeatureSceneType, React.ComponentType> = {
  molecule: MoleculeScene,
  wave: WaveScene,
  circuit: CircuitScene,
  telescope: TelescopeScene,
};

interface FeatureMiniCanvasProps {
  sceneType: FeatureSceneType;
  className?: string;
}

function FeatureMiniCanvasInner({
  sceneType,
  className,
}: FeatureMiniCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isVisible } = useScrollProgress(
    containerRef as React.RefObject<HTMLElement>
  );
  const tier = useQualityTier();
  const SceneComponent = SCENE_MAP[sceneType];

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      {isVisible && tier !== 'low' && tier !== 'static' && (
        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          gl={{ antialias: false, alpha: true }}
          dpr={1}
          style={{ background: 'transparent' }}
        >
          <AcademicLighting />
          <SceneComponent />
        </Canvas>
      )}
    </div>
  );
}

export const FeatureMiniCanvas = dynamic(
  () => Promise.resolve(FeatureMiniCanvasInner),
  { ssr: false }
);
