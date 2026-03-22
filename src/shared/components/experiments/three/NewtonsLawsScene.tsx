"use client";
/* eslint-disable react-hooks/refs, react-hooks/set-state-in-effect, react-hooks/purity, react-hooks/immutability, react-hooks/static-components */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { SceneContainer } from "./SceneContainer";

interface NewtonsLawsSceneProps {
  mass: number;
  force: number;
  friction: number;
  isPlaying: boolean;
  time: number;
  speed: number;
  onTick: (delta: number) => void;
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[40, 10]} />
      <meshStandardMaterial
        color="#0a0a1a"
        transparent
        opacity={0.6}
        metalness={0.9}
        roughness={0.4}
      />
    </mesh>
  );
}

function Block({ mass, positionX }: { mass: number; positionX: number }) {
  const scale = 0.4 + (mass / 100) * 1.6;
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.set(positionX, scale / 2, 0);
    }
  });

  return (
    <group>
      {/* Solid block */}
      <mesh ref={meshRef} position={[positionX, scale / 2, 0]}>
        <boxGeometry args={[scale, scale, scale]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.4}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Wireframe glow overlay */}
      <mesh position={[positionX, scale / 2, 0]}>
        <boxGeometry args={[scale * 1.02, scale * 1.02, scale * 1.02]} />
        <meshBasicMaterial
          color="#00f5ff"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

function Arrow({
  from,
  direction,
  length,
  color,
}: {
  from: [number, number, number];
  direction: [number, number, number];
  length: number;
  color: string;
}) {
  if (length < 0.05) return null;
  const dir = new THREE.Vector3(...direction).normalize();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir
  );

  return (
    <group position={from} quaternion={quaternion}>
      {/* Shaft */}
      <mesh position={[0, length / 2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, length, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
        />
      </mesh>
      {/* Arrowhead */}
      <mesh position={[0, length, 0]}>
        <coneGeometry args={[0.12, 0.25, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
}

function Simulation({
  mass,
  force,
  friction,
  isPlaying,
  speed,
  onTick,
}: Omit<NewtonsLawsSceneProps, "time">) {
  const posRef = useRef(0);
  const velRef = useRef(0);
  const accelRef = useRef(0);
  const textRef = useRef<THREE.Object3D>(null);

  const g = 9.8;
  const frictionForce = friction * mass * g;
  const netForce = Math.max(force - frictionForce, 0);
  const scale = 0.4 + (mass / 100) * 1.6;

  useFrame((_, delta) => {
    if (!isPlaying) return;
    const dt = delta * speed;
    onTick(dt);

    accelRef.current = netForce / mass;
    velRef.current += accelRef.current * dt;
    posRef.current += velRef.current * dt;

    if (posRef.current > 15) {
      posRef.current = -15;
      velRef.current = 0;
    }
  });

  const appliedLen = Math.min(force / 50, 5);
  const frictionLen = Math.min(frictionForce / 50, 5);

  return (
    <>
      <Block mass={mass} positionX={posRef.current} />

      {/* Applied force arrow (right, magenta) */}
      <Arrow
        from={[posRef.current + scale / 2 + 0.1, scale / 2, 0]}
        direction={[1, 0, 0]}
        length={appliedLen}
        color="#ff00ff"
      />

      {/* Friction arrow (left, orange) */}
      {friction > 0 && (
        <Arrow
          from={[posRef.current - scale / 2 - 0.1, scale / 2, 0]}
          direction={[-1, 0, 0]}
          length={frictionLen}
          color="#ff8800"
        />
      )}

      {/* Velocity label */}
      <Text
        position={[posRef.current, scale + 0.8, 0]}
        fontSize={0.3}
        color="#00ff88"
        anchorX="center"
        anchorY="middle"
      >
        {`v = ${velRef.current.toFixed(1)} m/s`}
      </Text>

      {/* Acceleration label */}
      <Text
        position={[posRef.current, scale + 1.3, 0]}
        fontSize={0.25}
        color="#00f5ff"
        anchorX="center"
        anchorY="middle"
      >
        {`a = ${accelRef.current.toFixed(2)} m/s²`}
      </Text>
    </>
  );
}

export function NewtonsLawsScene(props: NewtonsLawsSceneProps) {
  return (
    <SceneContainer cameraPosition={[0, 4, 10]}>
      <Ground />
      <Simulation {...props} />
    </SceneContainer>
  );
}
