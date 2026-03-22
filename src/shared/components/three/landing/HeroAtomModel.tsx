'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { createAcademicBlueMaterial, createElectronMaterial } from '../academic/materials';
import { useQualityTier } from '@/shared/hooks/useQualityTier';

const ORBIT_CONFIGS = [
  { radius: 1.4, tilt: 0, speed: 1.0 },
  { radius: 1.4, tilt: Math.PI / 3, speed: 0.8 },
  { radius: 1.4, tilt: -Math.PI / 3, speed: 1.2 },
];

function OrbitLine({ radius, tilt }: { radius: number; tilt: number }) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      pts.push([Math.cos(a) * radius, 0, Math.sin(a) * radius]);
    }
    return pts;
  }, [radius]);

  return (
    <group rotation={[tilt, 0, 0]}>
      <Line
        points={points}
        color="#93C5FD"
        lineWidth={1.5}
        transparent
        opacity={0.7}
      />
    </group>
  );
}

function Electron({
  orbitRadius,
  tilt,
  speed,
  timeOffset,
}: {
  orbitRadius: number;
  tilt: number;
  speed: number;
  timeOffset: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useMemo(() => createElectronMaterial(), []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed + timeOffset;
    const x = Math.cos(t) * orbitRadius;
    const z = Math.sin(t) * orbitRadius;
    const y = Math.sin(tilt) * z;
    ref.current.position.set(x, y, Math.cos(tilt) * z);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.07, 8, 8]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

export function HeroAtomModel() {
  const tier = useQualityTier();
  const nucleusMat = useMemo(() => createAcademicBlueMaterial(), []);

  if (tier === 'static') {
    return (
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <primitive object={nucleusMat} attach="material" />
      </mesh>
    );
  }

  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <primitive object={nucleusMat} attach="material" />
      </mesh>

      {ORBIT_CONFIGS.map((cfg, i) => (
        <OrbitLine key={i} radius={cfg.radius} tilt={cfg.tilt} />
      ))}

      {ORBIT_CONFIGS.map((cfg, i) => (
        <Electron
          key={i}
          orbitRadius={cfg.radius}
          tilt={cfg.tilt}
          speed={cfg.speed}
          timeOffset={(i * Math.PI * 2) / 3}
        />
      ))}
    </group>
  );
}
