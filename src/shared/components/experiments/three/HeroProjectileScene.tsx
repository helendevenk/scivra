"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { HeroSceneContainer } from "./HeroSceneContainer";

interface HeroProjectileSceneProps {
  velocity: number;
  angle: number;
  gravity: number;
  isPlaying: boolean;
  time: number;
  speed: number;
  onTick: (delta: number) => void;
}

// Hex equivalents of the brand OKLCH palette — three.js Color does not
// parse oklch() at runtime, so the source-of-truth tokens are restated
// here in sRGB hex. Keep in sync with theme.css if the brand spec moves.
const C = {
  groundTint: "#7cd3df",        // oklch(0.78 0.12 192) - faint teal wash
  groundGlow: "#5fdbe9",        // oklch(0.78 0.15 192) - center radial glow
  gridLine: "#2c98a3",          // oklch(0.55 0.12 192) - science-paper grid
  platformBody: "#1ea0ad",      // oklch(0.55 0.14 192) - launch platform
  platformGlow: "#1ec6d8",      // oklch(0.65 0.18 192) - platform emissive
  trajectory: "#f5bc4a",        // oklch(0.82 0.17 75)  - gold accent
  ballBody: "#7decf5",          // oklch(0.85 0.16 192) - projectile sphere
  ballGlow: "#4ee5f5",          // oklch(0.82 0.17 192) - sphere emissive
} as const;

function Ground() {
  return (
    <group position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Faint teal wash — mostly transparent so the page gradient bleeds through */}
      <mesh>
        <circleGeometry args={[14, 64]} />
        <meshBasicMaterial color={C.groundTint} transparent opacity={0.08} />
      </mesh>
      {/* Center glow — echoes HeroBackground center radial */}
      <mesh position={[0, 0, -0.001]}>
        <ringGeometry args={[0, 6, 64]} />
        <meshBasicMaterial color={C.groundGlow} transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

function GridLines() {
  // 'science paper' grid — a faint xz-plane lattice that gives the projectile
  // a sense of scale without being visually loud.
  const lines = useMemo(() => {
    const segs: Array<[[number, number, number], [number, number, number]]> = [];
    for (let x = -10; x <= 10; x += 1) {
      segs.push([
        [x, 0, -3],
        [x, 0, 3],
      ]);
    }
    for (let z = -3; z <= 3; z += 1) {
      segs.push([
        [-10, 0, z],
        [10, 0, z],
      ]);
    }
    return segs;
  }, []);

  return (
    <group>
      {lines.map((pts, i) => (
        <Line
          key={i}
          points={pts}
          color={C.gridLine}
          lineWidth={0.6}
          transparent
          opacity={0.18}
        />
      ))}
    </group>
  );
}

function LaunchPlatform() {
  return (
    <mesh position={[0, 0.2, 0]}>
      <boxGeometry args={[0.8, 0.4, 0.8]} />
      <meshStandardMaterial
        color={C.platformBody}
        metalness={0.8}
        roughness={0.25}
        emissive={C.platformGlow}
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}

function Trajectory({
  velocity,
  angle,
  gravity,
}: {
  velocity: number;
  angle: number;
  gravity: number;
}) {
  const points = useMemo(() => {
    const rad = (angle * Math.PI) / 180;
    const vx = velocity * Math.cos(rad);
    const vy = velocity * Math.sin(rad);
    const flight = (2 * vy) / gravity;
    const out: [number, number, number][] = [];
    const n = 48;
    for (let i = 0; i <= n; i++) {
      const t = (i / n) * flight;
      const x = vx * t;
      const y = vy * t - 0.5 * gravity * t * t;
      out.push([x * 0.3, Math.max(y * 0.3, 0) + 0.4, 0]);
    }
    return out;
  }, [velocity, angle, gravity]);

  return (
    <Line
      points={points}
      color={C.trajectory}
      lineWidth={2.6}
      transparent
      opacity={0.95}
      dashed={false}
    />
  );
}

function Projectile({
  velocity,
  angle,
  gravity,
  isPlaying,
  time,
  onTick,
}: Omit<HeroProjectileSceneProps, "speed">) {
  const ref = useRef<THREE.Mesh>(null);
  const rad = (angle * Math.PI) / 180;
  const vx = velocity * Math.cos(rad);
  const vy = velocity * Math.sin(rad);
  const flight = (2 * vy) / gravity;

  useFrame((_, delta) => {
    if (isPlaying) {
      onTick(delta);
    }
    const t = time % (flight + 0.6);
    const tClamp = Math.min(t, flight);
    const x = vx * tClamp;
    const y = vy * tClamp - 0.5 * gravity * tClamp * tClamp;
    if (ref.current) {
      ref.current.position.set(x * 0.3, Math.max(y * 0.3, 0) + 0.4, 0);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.38, 32, 32]} />
      <meshStandardMaterial
        color={C.ballBody}
        emissive={C.ballGlow}
        emissiveIntensity={0.85}
        metalness={0.4}
        roughness={0.2}
      />
    </mesh>
  );
}

export function HeroProjectileScene(props: HeroProjectileSceneProps) {
  return (
    <HeroSceneContainer cameraPosition={[6, 4, 14]}>
      <Ground />
      <GridLines />
      <LaunchPlatform />
      <Trajectory
        velocity={props.velocity}
        angle={props.angle}
        gravity={props.gravity}
      />
      <Projectile
        velocity={props.velocity}
        angle={props.angle}
        gravity={props.gravity}
        isPlaying={props.isPlaying}
        time={props.time}
        onTick={props.onTick}
      />
    </HeroSceneContainer>
  );
}
