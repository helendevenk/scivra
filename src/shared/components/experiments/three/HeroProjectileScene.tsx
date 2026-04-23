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

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[60, 12]} />
      <meshStandardMaterial
        color="oklch(0.18 0.03 250)"
        transparent
        opacity={0.35}
        metalness={0.6}
        roughness={0.45}
      />
    </mesh>
  );
}

function LaunchPlatform() {
  return (
    <mesh position={[0, 0.2, 0]}>
      <boxGeometry args={[0.8, 0.4, 0.8]} />
      <meshStandardMaterial
        color="oklch(0.45 0.12 192)"
        metalness={0.7}
        roughness={0.3}
        emissive="oklch(0.45 0.12 192)"
        emissiveIntensity={0.25}
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
      color="oklch(0.75 0.15 75)"
      lineWidth={2.2}
      transparent
      opacity={0.8}
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
      <sphereGeometry args={[0.35, 28, 28]} />
      <meshStandardMaterial
        color="oklch(0.78 0.18 192)"
        emissive="oklch(0.78 0.18 192)"
        emissiveIntensity={0.6}
        metalness={0.5}
        roughness={0.25}
      />
    </mesh>
  );
}

export function HeroProjectileScene(props: HeroProjectileSceneProps) {
  return (
    <HeroSceneContainer cameraPosition={[6, 4, 14]}>
      <Ground />
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
