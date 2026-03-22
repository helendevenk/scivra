'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AcademicCanvas } from '../academic/AcademicCanvas';
import { HeroAtomModel } from './HeroAtomModel';
import { HeroParticleField } from './HeroParticleField';
import { HeroFormulaFragments } from './HeroFormulaFragments';
import { useMouseParallax } from '@/shared/hooks/useMouseParallax';

function HeroScene() {
  const groupRef = useRef<THREE.Group>(null);
  const parallax = useMouseParallax(0.05);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y +=
      (parallax.x * 0.3 - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x +=
      (parallax.y * 0.15 - groupRef.current.rotation.x) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <group position={[3, 0.5, -1]} scale={1.5}>
        <HeroAtomModel />
      </group>
      <HeroParticleField />
      <HeroFormulaFragments />
    </group>
  );
}

function HeroBackgroundInner() {
  return (
    <AcademicCanvas cameraPosition={[0, 0, 8]}>
      <HeroScene />
    </AcademicCanvas>
  );
}

export const HeroBackground = dynamic(
  () => Promise.resolve(HeroBackgroundInner),
  { ssr: false }
);
