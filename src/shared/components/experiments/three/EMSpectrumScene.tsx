"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { SceneContainer } from "./SceneContainer";

interface EMSpectrumSceneProps {
  wavelength: number;
  amplitude: number;
  showPhoton: number;
  isPlaying: boolean;
  time: number;
  speed: number;
  onTick: (delta: number) => void;
}

function wavelengthToColor(nm: number): string {
  if (nm < 10) return "#9400d3";
  if (nm < 380) return "#8b00ff";
  if (nm < 450) return "#4400ff";
  if (nm < 490) return "#0044ff";
  if (nm < 520) return "#00ff88";
  if (nm < 565) return "#00ff00";
  if (nm < 590) return "#ffff00";
  if (nm < 625) return "#ff8800";
  if (nm < 780) return "#ff0000";
  if (nm < 1000) return "#ff0044";
  return "#ff00ff";
}

function getBandName(nm: number): string {
  if (nm < 0.01) return "Gamma Ray";
  if (nm < 10) return "X-Ray";
  if (nm < 380) return "Ultraviolet";
  if (nm < 780) return "Visible Light";
  if (nm < 1000) return "Near Infrared";
  if (nm < 5000) return "Infrared";
  return "Microwave / Radio";
}

// Electric field wave (Y-axis oscillation)
function EFieldWave({
  wavelength,
  amplitude,
  isPlaying,
  speed,
  onTick,
}: Omit<EMSpectrumSceneProps, "time" | "showPhoton">) {
  const phaseRef = useRef(0);
  const color = wavelengthToColor(wavelength);
  const visualFreq = Math.max(0.5, Math.min(20, 5000 / wavelength));

  const lineObj = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i <= 200; i++) {
      pts.push((i - 100) * 0.1, 0, 0);
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    const mat = new THREE.LineBasicMaterial({ color, linewidth: 2 });
    return new THREE.Line(geom, mat);
  }, [color]);

  useFrame((_, delta) => {
    const geom = lineObj.geometry;
    if (!geom) return;
    if (isPlaying) {
      const dt = delta * speed;
      onTick(dt);
      phaseRef.current += dt * visualFreq * 2;
    }

    const positions = geom.attributes.position.array as Float32Array;
    for (let i = 0; i <= 200; i++) {
      const x = (i - 100) * 0.1;
      positions[i * 3 + 1] =
        amplitude * Math.sin(visualFreq * x + phaseRef.current);
    }
    geom.attributes.position.needsUpdate = true;
  });

  return <primitive object={lineObj} />;
}

// Magnetic field wave (Z-axis oscillation, orthogonal)
function BFieldWave({
  wavelength,
  amplitude,
  isPlaying,
  speed,
}: {
  wavelength: number;
  amplitude: number;
  isPlaying: boolean;
  speed: number;
}) {
  const phaseRef = useRef(0);
  const visualFreq = Math.max(0.5, Math.min(20, 5000 / wavelength));

  const lineObj = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i <= 200; i++) {
      pts.push((i - 100) * 0.1, 0, 0);
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    const mat = new THREE.LineBasicMaterial({
      color: "#ff00ff",
      linewidth: 2,
      transparent: true,
      opacity: 0.6,
    });
    return new THREE.Line(geom, mat);
  }, []);

  useFrame((_, delta) => {
    const geom = lineObj.geometry;
    if (!geom) return;
    if (isPlaying) {
      phaseRef.current += delta * speed * visualFreq * 2;
    }

    const positions = geom.attributes.position.array as Float32Array;
    for (let i = 0; i <= 200; i++) {
      const x = (i - 100) * 0.1;
      positions[i * 3 + 2] =
        amplitude * Math.sin(visualFreq * x + phaseRef.current);
    }
    geom.attributes.position.needsUpdate = true;
  });

  return <primitive object={lineObj} />;
}

// Propagation direction arrow
function PropagationArrow() {
  return (
    <group position={[8, 0, 0]}>
      <mesh rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.12, 0.4, 8]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}

// Axis labels
function AxisLabels() {
  return (
    <>
      <Text
        position={[-10.5, 1.5, 0]}
        fontSize={0.22}
        color="#00f5ff"
        anchorX="right"
      >
        E (Electric)
      </Text>
      <Text
        position={[-10.5, 0, 1.5]}
        fontSize={0.22}
        color="#ff00ff"
        anchorX="right"
      >
        B (Magnetic)
      </Text>
      <Text
        position={[9, -0.4, 0]}
        fontSize={0.22}
        color="#ffffff"
        anchorX="center"
      >
        Direction
      </Text>
    </>
  );
}

function PhotonParticle({
  wavelength,
  isPlaying,
}: {
  wavelength: number;
  isPlaying: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const color = wavelengthToColor(wavelength);
  const energyScale = Math.min(2, Math.max(0.3, 500 / wavelength));

  useFrame((_, delta) => {
    if (!isPlaying) return;
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 2;
      meshRef.current.rotation.x += delta;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y -= delta * 1.5;
      glowRef.current.rotation.z += delta * 0.8;
    }
  });

  return (
    <group position={[0, 3, 0]}>
      {/* Core */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[energyScale * 0.3, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.0}
          wireframe
        />
      </mesh>
      {/* Outer glow shell */}
      <mesh ref={glowRef}>
        <icosahedronGeometry args={[energyScale * 0.45, 1]} />
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>
      {/* Energy label */}
      <Text
        position={[0, energyScale * 0.5 + 0.4, 0]}
        fontSize={0.2}
        color={color}
        anchorX="center"
      >
        {`E = ${((1240 / wavelength)).toFixed(2)} eV`}
      </Text>
    </group>
  );
}

// Spectrum color band at the bottom
function SpectrumBand({ wavelength }: { wavelength: number }) {
  const bands = useMemo(() => {
    const b: { x: number; color: string; label: string }[] = [
      { x: -8, color: "#9400d3", label: "γ" },
      { x: -6, color: "#8b00ff", label: "X" },
      { x: -4, color: "#4400ff", label: "UV" },
      { x: -2, color: "#0044ff", label: "V" },
      { x: -0.5, color: "#00ff88", label: "G" },
      { x: 1, color: "#ffff00", label: "Y" },
      { x: 2.5, color: "#ff8800", label: "O" },
      { x: 4, color: "#ff0000", label: "R" },
      { x: 6, color: "#ff0044", label: "IR" },
      { x: 8, color: "#ff00ff", label: "MW" },
    ];
    return b;
  }, []);

  return (
    <group position={[0, -2, 0]}>
      {bands.map((b, i) => (
        <mesh key={i} position={[b.x, 0, 0]}>
          <boxGeometry args={[1.4, 0.15, 0.5]} />
          <meshStandardMaterial
            color={b.color}
            emissive={b.color}
            emissiveIntensity={0.4}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
      {/* Current band indicator */}
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.3}
        color={wavelengthToColor(wavelength)}
        anchorX="center"
      >
        {getBandName(wavelength)}
      </Text>
    </group>
  );
}

export function EMSpectrumScene(props: EMSpectrumSceneProps) {
  return (
    <SceneContainer cameraPosition={[0, 3, 10]} bloomIntensity={1.2}>
      <EFieldWave
        wavelength={props.wavelength}
        amplitude={props.amplitude}
        isPlaying={props.isPlaying}
        speed={props.speed}
        onTick={props.onTick}
      />
      <BFieldWave
        wavelength={props.wavelength}
        amplitude={props.amplitude}
        isPlaying={props.isPlaying}
        speed={props.speed}
      />
      <PropagationArrow />
      <AxisLabels />
      <SpectrumBand wavelength={props.wavelength} />
      {props.showPhoton > 0.5 && (
        <PhotonParticle
          wavelength={props.wavelength}
          isPlaying={props.isPlaying}
        />
      )}
    </SceneContainer>
  );
}
