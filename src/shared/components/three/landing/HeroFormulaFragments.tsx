'use client';
/* eslint-disable react-hooks/refs, react-hooks/set-state-in-effect, react-hooks/purity, react-hooks/immutability, react-hooks/static-components */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useQualityTier } from '@/shared/hooks/useQualityTier';

const FORMULAS = [
  'F = ma',
  'E = mc²',
  'ΔE·Δt ≥ ℏ/2',
  '∇·E = ρ/ε₀',
  'λ = h/p',
  'S = kB ln Ω',
];

interface FragmentConfig {
  position: [number, number, number];
  rotation: number;
  speed: number;
  formula: string;
}

export function HeroFormulaFragments() {
  const tier = useQualityTier();
  const groupRef = useRef<THREE.Group>(null);

  const configs = useMemo<FragmentConfig[]>(
    () =>
      FORMULAS.map((formula, i) => ({
        formula,
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 6,
          -2 - Math.random() * 2,
        ],
        rotation: (Math.random() - 0.5) * 0.3,
        speed: 0.05 + Math.random() * 0.05,
      })),
    []
  );

  useFrame(({ clock }) => {
    if (!groupRef.current || tier === 'static') return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const cfg = configs[i];
      if (!cfg) return;
      child.position.y =
        configs[i].position[1] + Math.sin(t * cfg.speed + i) * 0.3;
      child.rotation.z = cfg.rotation + Math.sin(t * cfg.speed * 0.5) * 0.05;
    });
  });

  if (tier === 'static' || tier === 'low') return null;

  return (
    <group ref={groupRef}>
      {configs.map((cfg, i) => (
        <Text
          key={i}
          position={cfg.position}
          rotation={[0, 0, cfg.rotation]}
          fontSize={0.25}
          color="#4a90d9"
          font="/fonts/JetBrainsMono-Regular.woff2"
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.25}
        >
          {cfg.formula}
        </Text>
      ))}
    </group>
  );
}
