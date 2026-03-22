'use client';
/* eslint-disable react-hooks/refs, react-hooks/set-state-in-effect, react-hooks/purity, react-hooks/immutability, react-hooks/static-components */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollProgress } from '@/shared/hooks/useScrollProgress';
import { useQualityTier } from '@/shared/hooks/useQualityTier';

const PARTICLE_COUNT = 120;

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

interface CtaParticleConvergenceProps {
  containerRef: React.RefObject<HTMLElement>;
}

export function CtaParticleConvergence({
  containerRef,
}: CtaParticleConvergenceProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tier = useQualityTier();

  const scattered = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return arr;
  }, []);

  const converged = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      const r = 0.3 + Math.random() * 1.2;
      arr[i * 3] = Math.cos(angle) * r;
      arr[i * 3 + 1] = Math.sin(angle) * r * 0.5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    return arr;
  }, []);

  const { progress } = useScrollProgress(containerRef);

  useFrame(() => {
    if (!meshRef.current || tier === 'static') return;
    const t = easeInOut(progress);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const sx = scattered[i * 3];
      const sy = scattered[i * 3 + 1];
      const sz = scattered[i * 3 + 2];
      const cx = converged[i * 3];
      const cy = converged[i * 3 + 1];
      const cz = converged[i * 3 + 2];

      dummy.position.set(
        sx + (cx - sx) * t,
        sy + (cy - sy) * t,
        sz + (cz - sz) * t
      );
      dummy.scale.setScalar(0.04 + t * 0.04);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (tier === 'static' || tier === 'low') return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, PARTICLE_COUNT]}
    >
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#4a90d9" transparent opacity={0.5} />
    </instancedMesh>
  );
}
