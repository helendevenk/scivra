'use client';
/* eslint-disable react-hooks/refs, react-hooks/set-state-in-effect, react-hooks/purity, react-hooks/immutability, react-hooks/static-components */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useQualityTier } from '@/shared/hooks/useQualityTier';
import { QUALITY_PRESETS } from '../academic/quality';

export function HeroParticleField() {
  const tier = useQualityTier();
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const count = QUALITY_PRESETS[tier].particleCount;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, [count]);

  const speeds = useMemo(() => {
    return new Float32Array(count).map(() => Math.random() * 0.3 + 0.1);
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current || tier === 'static') return;
    const t = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      const s = speeds[i];
      dummy.position.set(
        positions[i * 3] + Math.sin(t * s + i) * 0.2,
        positions[i * 3 + 1] + Math.cos(t * s * 0.7 + i) * 0.15,
        positions[i * 3 + 2]
      );
      dummy.scale.setScalar(0.06 + Math.sin(t * s * 2 + i) * 0.03);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (count === 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        color="#93C5FD"
        emissive="#60A5FA"
        emissiveIntensity={2.0}
        transparent
        opacity={0.85}
        roughness={0.2}
        metalness={0.0}
      />
    </instancedMesh>
  );
}
