"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, Text, Trail } from "@react-three/drei";
import * as THREE from "three";
import { SceneContainer } from "./SceneContainer";

interface ProjectileSceneProps {
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
      <planeGeometry args={[60, 10]} />
      <meshStandardMaterial
        color="#0a0a1a"
        transparent
        opacity={0.5}
        metalness={0.9}
        roughness={0.4}
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
    const tFlight = (2 * velocity * Math.sin(rad)) / gravity;
    const pts: [number, number, number][] = [];
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * tFlight;
      const x = velocity * Math.cos(rad) * t * 0.1;
      const y = Math.max(
        (velocity * Math.sin(rad) * t - 0.5 * gravity * t * t) * 0.1,
        0
      );
      pts.push([x, y, 0]);
    }
    return pts;
  }, [velocity, angle, gravity]);

  return (
    <Line
      points={points}
      color="#00ff88"
      lineWidth={1.5}
      transparent
      opacity={0.3}
      dashed
      dashSize={0.3}
      gapSize={0.15}
    />
  );
}

function AngleArc({ angle }: { angle: number }) {
  const points = useMemo(() => {
    const rad = (angle * Math.PI) / 180;
    const pts: [number, number, number][] = [];
    const r = 1.5;
    const steps = 30;
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * rad;
      pts.push([r * Math.cos(a), r * Math.sin(a), 0]);
    }
    return pts;
  }, [angle]);

  return (
    <group position={[0, 0, 0]}>
      <Line points={points} color="#ffff00" lineWidth={1.5} transparent opacity={0.6} />
      <Text
        position={[
          2 * Math.cos(((angle / 2) * Math.PI) / 180),
          2 * Math.sin(((angle / 2) * Math.PI) / 180),
          0,
        ]}
        fontSize={0.25}
        color="#ffff00"
        anchorX="center"
        anchorY="middle"
      >
        {`${angle}°`}
      </Text>
    </group>
  );
}

function LandingMarker({
  velocity,
  angle,
  gravity,
}: {
  velocity: number;
  angle: number;
  gravity: number;
}) {
  const rad = (angle * Math.PI) / 180;
  const range = ((velocity * velocity * Math.sin(2 * rad)) / gravity) * 0.1;

  return (
    <group position={[range, 0, 0]}>
      {/* Landing ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.35, 32]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Range label */}
      <Text
        position={[0, 0.6, 0]}
        fontSize={0.22}
        color="#ff00ff"
        anchorX="center"
        anchorY="middle"
      >
        {`R = ${(range * 10).toFixed(1)} m`}
      </Text>
    </group>
  );
}

function Projectile({
  velocity,
  angle,
  gravity,
  isPlaying,
  speed,
  onTick,
}: Omit<ProjectileSceneProps, "time">) {
  const meshRef = useRef<THREE.Mesh>(null);
  const tRef = useRef(0);

  const rad = (angle * Math.PI) / 180;
  const tFlight = (2 * velocity * Math.sin(rad)) / gravity;
  const maxH = ((velocity * Math.sin(rad)) ** 2 / (2 * gravity)) * 0.1;

  useFrame((_, delta) => {
    if (!isPlaying || !meshRef.current) return;
    const dt = delta * speed;
    onTick(dt);
    tRef.current += dt;

    if (tRef.current > tFlight) {
      tRef.current = 0;
    }

    const t = tRef.current;
    const x = velocity * Math.cos(rad) * t * 0.1;
    const y = Math.max(
      (velocity * Math.sin(rad) * t - 0.5 * gravity * t * t) * 0.1,
      0
    );
    meshRef.current.position.set(x, y, 0);
  });

  return (
    <Trail
      width={0.3}
      length={8}
      color="#ff00ff"
      attenuation={(w) => w * w}
    >
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={0.8}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
    </Trail>
  );
}

function LaunchPlatform() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[0.8, 0.3, 0.8]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.3}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      {/* Wireframe glow */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[0.82, 0.32, 0.82]} />
        <meshBasicMaterial color="#00f5ff" wireframe transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

function MaxHeightMarker({
  velocity,
  angle,
  gravity,
}: {
  velocity: number;
  angle: number;
  gravity: number;
}) {
  const rad = (angle * Math.PI) / 180;
  const maxH = ((velocity * Math.sin(rad)) ** 2 / (2 * gravity)) * 0.1;
  const tPeak = (velocity * Math.sin(rad)) / gravity;
  const xPeak = velocity * Math.cos(rad) * tPeak * 0.1;

  return (
    <group position={[xPeak, maxH, 0]}>
      <Line
        points={[
          [0, 0, 0],
          [0, -maxH, 0],
        ]}
        color="#00f5ff"
        lineWidth={1}
        transparent
        opacity={0.3}
        dashed
        dashSize={0.2}
        gapSize={0.1}
      />
      <Text
        position={[0.8, 0, 0]}
        fontSize={0.2}
        color="#00f5ff"
        anchorX="left"
        anchorY="middle"
      >
        {`H = ${(maxH * 10).toFixed(1)} m`}
      </Text>
    </group>
  );
}

export function ProjectileScene(props: ProjectileSceneProps) {
  return (
    <SceneContainer cameraPosition={[5, 4, 14]}>
      <Ground />
      <LaunchPlatform />
      <AngleArc angle={props.angle} />
      <Trajectory
        velocity={props.velocity}
        angle={props.angle}
        gravity={props.gravity}
      />
      <MaxHeightMarker
        velocity={props.velocity}
        angle={props.angle}
        gravity={props.gravity}
      />
      <LandingMarker
        velocity={props.velocity}
        angle={props.angle}
        gravity={props.gravity}
      />
      <Projectile {...props} />
    </SceneContainer>
  );
}
