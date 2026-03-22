'use client';

import { useMemo } from 'react';
import { Line } from '@react-three/drei';

const TRACES: [number, number, number][][] = [
  [[-1.2, -0.5, 0], [-0.5, -0.5, 0], [-0.5, 0.3, 0], [0.5, 0.3, 0]],
  [[0.5, 0.3, 0], [0.5, -0.5, 0], [1.2, -0.5, 0]],
  [[-1.2, 0.5, 0], [-0.8, 0.5, 0], [-0.8, -0.2, 0], [0.2, -0.2, 0]],
  [[0.2, -0.2, 0], [0.2, 0.6, 0], [1.2, 0.6, 0]],
];

const NODES: [number, number, number][] = [
  [-0.5, 0.3, 0],
  [0.5, 0.3, 0],
  [-0.8, -0.2, 0],
  [0.2, -0.2, 0],
];

export function CircuitScene() {
  return (
    <group rotation={[0.1, 0.2, 0]}>
      <mesh rotation={[0, 0, 0]} position={[0, 0, -0.05]}>
        <planeGeometry args={[3, 2.4]} />
        <meshStandardMaterial color="#1a2a1a" transparent opacity={0.6} />
      </mesh>

      {TRACES.map((pts, i) => (
        <Line
          key={i}
          points={pts}
          color="#00d084"
          lineWidth={1.5}
          transparent
          opacity={0.8}
        />
      ))}

      {NODES.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial
            color="#00d084"
            emissive="#00d084"
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}
