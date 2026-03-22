'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { createAcademicBlueMaterial, createGoldEdgeMaterial } from '../../academic/materials';

const ATOMS = [
  { pos: [0, 0, 0] as [number, number, number], type: 'O' },
  { pos: [-0.9, -0.6, 0] as [number, number, number], type: 'H' },
  { pos: [0.9, -0.6, 0] as [number, number, number], type: 'H' },
];

const BONDS: [number, number][] = [
  [0, 1],
  [0, 2],
];

export function MoleculeScene() {
  const groupRef = useRef<THREE.Group>(null);
  const oxygenMat = useMemo(() => createAcademicBlueMaterial(), []);
  const hydrogenMat = useMemo(() => createGoldEdgeMaterial(), []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.2, 0.4, 0]}>
      {ATOMS.map((atom, i) => (
        <mesh key={i} position={atom.pos}>
          <sphereGeometry args={[atom.type === 'O' ? 0.35 : 0.22, 16, 16]} />
          <primitive
            object={atom.type === 'O' ? oxygenMat : hydrogenMat}
            attach="material"
          />
        </mesh>
      ))}
      {BONDS.map(([a, b], i) => (
        <Line
          key={i}
          points={[ATOMS[a].pos, ATOMS[b].pos]}
          color="#60A5FA"
          lineWidth={2}
          transparent
          opacity={0.7}
        />
      ))}
    </group>
  );
}
