'use client';

import { useMemo } from 'react';
import { createAcademicBlueMaterial } from '../../academic/materials';

export function TelescopeScene() {
  const bodyMat = useMemo(() => createAcademicBlueMaterial(), []);

  return (
    <group rotation={[0.1, 0.5, 0.15]}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 1.6, 16]} />
        <primitive object={bodyMat} attach="material" />
      </mesh>

      <mesh position={[0, 0.9, 0]}>
        <coneGeometry args={[0.25, 0.4, 16]} />
        <meshStandardMaterial color="#c9a84c" metalness={0.5} roughness={0.4} />
      </mesh>

      <mesh position={[0, -0.95, 0]}>
        <cylinderGeometry args={[0.22, 0.2, 0.2, 16]} />
        <meshStandardMaterial color="#8a9bb0" metalness={0.6} roughness={0.3} />
      </mesh>

      <mesh
        position={[0, -0.6, 0.55]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[0.3, 0.04, 8, 24]} />
        <meshStandardMaterial color="#4a90d9" metalness={0.4} roughness={0.4} />
      </mesh>
    </group>
  );
}
