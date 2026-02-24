"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, Text, Trail } from "@react-three/drei";
import * as THREE from "three";
import { SceneContainer } from "./SceneContainer";

interface RollerCoasterSceneProps {
  initialHeight: number;
  mass: number;
  friction: number;
  isPlaying: boolean;
  time: number;
  speed: number;
  onTick: (delta: number) => void;
}

function getTrackHeight(x: number): number {
  return (
    3 * Math.sin(x * 0.3) * Math.exp(-0.02 * x) +
    2 * Math.sin(x * 0.6 + 1) * Math.exp(-0.03 * x) +
    1.5 * Math.cos(x * 0.15)
  );
}

function Track() {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 300; i++) {
      const x = (i - 50) * 0.2;
      const y = Math.max(getTrackHeight(x), 0);
      pts.push([x, y, 0]);
    }
    return pts;
  }, []);

  return (
    <>
      {/* Main rail */}
      <Line points={points} color="#00f5ff" lineWidth={2.5} />
      {/* Ghost rail for glow */}
      <Line points={points} color="#00f5ff" lineWidth={5} transparent opacity={0.15} />
    </>
  );
}

function TrackSupports() {
  const supports = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= 60; i += 3) {
      const x = (i - 10) * 0.5;
      const y = Math.max(getTrackHeight(x), 0);
      if (y > 0.3) pts.push({ x, y });
    }
    return pts;
  }, []);

  return (
    <>
      {supports.map((s, i) => (
        <Line
          key={i}
          points={[
            [s.x, 0, 0],
            [s.x, s.y, 0],
          ]}
          color="#00f5ff"
          lineWidth={1}
          transparent
          opacity={0.2}
        />
      ))}
    </>
  );
}

function Cart({
  initialHeight,
  mass,
  friction,
  isPlaying,
  speed,
  onTick,
}: Omit<RollerCoasterSceneProps, "time">) {
  const meshRef = useRef<THREE.Mesh>(null);
  const xRef = useRef(-10);
  const velRef = useRef(0);
  const energyLostRef = useRef(0);
  const keRef = useRef(0);
  const peRef = useRef(0);

  const g = 9.8;
  const h0 = initialHeight * 0.1;

  useFrame((_, delta) => {
    if (!isPlaying || !meshRef.current) return;
    const dt = delta * speed;
    onTick(dt);

    const currentH = Math.max(getTrackHeight(xRef.current), 0);
    const totalE = mass * g * h0 - energyLostRef.current;
    const pe = mass * g * currentH;
    const ke = Math.max(totalE - pe, 0);
    const v = Math.sqrt((2 * ke) / mass);

    keRef.current = ke;
    peRef.current = pe;

    velRef.current = v;
    xRef.current += velRef.current * dt;

    energyLostRef.current +=
      friction * mass * g * Math.abs(velRef.current) * dt;

    if (xRef.current > 50) {
      xRef.current = -10;
      energyLostRef.current = 0;
    }

    const y = Math.max(getTrackHeight(xRef.current), 0);
    meshRef.current.position.set(xRef.current, y + 0.25, 0);
  });

  return (
    <Trail width={0.25} length={6} color="#ff00ff" attenuation={(w) => w * w}>
      <mesh
        ref={meshRef}
        position={[-10, Math.max(getTrackHeight(-10), 0) + 0.25, 0]}
      >
        <boxGeometry args={[0.6, 0.3, 0.4]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={0.6}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
    </Trail>
  );
}

function EnergyBars({
  initialHeight,
  mass,
  friction,
  isPlaying,
}: {
  initialHeight: number;
  mass: number;
  friction: number;
  isPlaying: boolean;
}) {
  const keBarRef = useRef<THREE.Mesh>(null);
  const peBarRef = useRef<THREE.Mesh>(null);
  const lostBarRef = useRef<THREE.Mesh>(null);
  const keLabelRef = useRef<THREE.Object3D>(null);
  const peLabelRef = useRef<THREE.Object3D>(null);

  const xRef = useRef(-10);
  const energyLostRef = useRef(0);

  const g = 9.8;
  const h0 = initialHeight * 0.1;
  const totalE = mass * g * h0;
  const maxBarH = 5;
  const scale = totalE > 0 ? maxBarH / totalE : 1;

  useFrame((_, delta) => {
    if (!isPlaying) return;

    const currentH = Math.max(getTrackHeight(xRef.current), 0);
    const remaining = totalE - energyLostRef.current;
    const pe = Math.min(mass * g * currentH, remaining);
    const ke = Math.max(remaining - pe, 0);
    const lost = energyLostRef.current;

    const keH = Math.max(ke * scale, 0.01);
    const peH = Math.max(pe * scale, 0.01);
    const lostH = Math.max(lost * scale, 0.01);

    if (keBarRef.current) {
      keBarRef.current.scale.set(1, keH, 1);
      keBarRef.current.position.set(-12, keH / 2, 2);
    }
    if (peBarRef.current) {
      peBarRef.current.scale.set(1, peH, 1);
      peBarRef.current.position.set(-11, peH / 2, 2);
    }
    if (lostBarRef.current && friction > 0) {
      lostBarRef.current.scale.set(1, lostH, 1);
      lostBarRef.current.position.set(-10, lostH / 2, 2);
    }

    // Track cart position for energy calc
    const v = Math.sqrt((2 * ke) / mass);
    xRef.current += v * delta;
    energyLostRef.current +=
      friction * mass * g * Math.abs(v) * delta;
    if (xRef.current > 50) {
      xRef.current = -10;
      energyLostRef.current = 0;
    }
  });

  return (
    <group>
      {/* KE bar (green) */}
      <mesh ref={keBarRef} position={[-12, 0.5, 2]}>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      <Text position={[-12, -0.4, 2]} fontSize={0.2} color="#00ff88" anchorX="center">
        KE
      </Text>

      {/* PE bar (cyan) */}
      <mesh ref={peBarRef} position={[-11, 0.5, 2]}>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      <Text position={[-11, -0.4, 2]} fontSize={0.2} color="#00f5ff" anchorX="center">
        PE
      </Text>

      {/* Energy lost bar (orange, only with friction) */}
      {friction > 0 && (
        <>
          <mesh ref={lostBarRef} position={[-10, 0.01, 2]}>
            <boxGeometry args={[0.4, 1, 0.4]} />
            <meshStandardMaterial
              color="#ff8800"
              emissive="#ff8800"
              emissiveIntensity={0.4}
              transparent
              opacity={0.7}
            />
          </mesh>
          <Text
            position={[-10, -0.4, 2]}
            fontSize={0.2}
            color="#ff8800"
            anchorX="center"
          >
            Loss
          </Text>
        </>
      )}

      {/* Total energy reference line */}
      <Line
        points={[
          [-12.5, maxBarH, 2],
          [-9.5, maxBarH, 2],
        ]}
        color="#ffffff"
        lineWidth={1}
        transparent
        opacity={0.3}
        dashed
        dashSize={0.15}
        gapSize={0.1}
      />
      <Text
        position={[-9, maxBarH, 2]}
        fontSize={0.18}
        color="#ffffff"
        anchorX="left"
      >
        E total
      </Text>
    </group>
  );
}

export function RollerCoasterScene(props: RollerCoasterSceneProps) {
  return (
    <SceneContainer cameraPosition={[5, 6, 15]} bloomIntensity={1.0}>
      <Track />
      <TrackSupports />
      <Cart {...props} />
      <EnergyBars
        initialHeight={props.initialHeight}
        mass={props.mass}
        friction={props.friction}
        isPlaying={props.isPlaying}
      />
    </SceneContainer>
  );
}
