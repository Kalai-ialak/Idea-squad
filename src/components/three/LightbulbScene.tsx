"use client";

import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

// ── Creative Node — a glowing sphere at a network connection point ──
function CreativeNode({
  position,
  color,
  size = 0.06,
}: {
  position: [number, number, number];
  color: string;
  size?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    meshRef.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 2 + position[0]) * 0.2);
  });
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
    </mesh>
  );
}

// ── Connection Line between two nodes ──
function ConnectionLine({
  start,
  end,
  color,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}) {
  const lineObject = useMemo(() => {
    const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.35 });
    return new THREE.Line(geometry, material);
  }, [start, end, color]);

  return <primitive object={lineObject} />;
}

// ── Brain / Node Network ──
const nodes: Array<{ pos: [number, number, number]; color: string }> = [
  { pos: [0, 0.3, 0], color: "#7C3AED" },
  { pos: [-0.25, 0.1, 0.1], color: "#9d5cf5" },
  { pos: [0.25, 0.1, 0.1], color: "#FFA500" },
  { pos: [-0.15, -0.15, 0.05], color: "#7C3AED" },
  { pos: [0.15, -0.1, 0.05], color: "#FFA500" },
  { pos: [0, -0.2, 0.2], color: "#9d5cf5" },
  { pos: [-0.3, 0, -0.1], color: "#FFA500" },
  { pos: [0.3, 0.05, -0.1], color: "#7C3AED" },
];

const connections: Array<[number, number]> = [
  [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5], [1, 6], [2, 7], [6, 3], [7, 4], [0, 7], [0, 6],
];

function BrainNetwork() {
  return (
    <group>
      {nodes.map((n, i) => (
        <CreativeNode key={i} position={n.pos} color={n.color} />
      ))}
      {connections.map(([a, b], i) => (
        <ConnectionLine key={i} start={nodes[a].pos} end={nodes[b].pos} color="#7C3AED" />
      ))}
    </group>
  );
}

// ── Lightbulb Shell ──
function LightbulbShell() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.1;
  });

  return (
    <group ref={meshRef}>
      {/* Outer bulb — distorted sphere suggesting a bulb silhouette */}
      <Sphere args={[0.55, 48, 48]} position={[0, 0.08, 0]}>
        <MeshDistortMaterial
          color="#1a0533"
          emissive="#4B0AA8"
          emissiveIntensity={0.4}
          distort={0.15}
          speed={1.5}
          roughness={0.05}
          metalness={0.3}
          transparent
          opacity={0.55}
          side={THREE.FrontSide}
        />
      </Sphere>

      {/* Inner glow sphere */}
      <Sphere args={[0.38, 32, 32]} position={[0, 0.08, 0]}>
        <meshStandardMaterial
          color="#7C3AED"
          emissive="#7C3AED"
          emissiveIntensity={0.6}
          transparent
          opacity={0.18}
        />
      </Sphere>

      {/* Filament / base ring */}
      <mesh position={[0, -0.52, 0]}>
        <cylinderGeometry args={[0.14, 0.18, 0.12, 24]} />
        <meshStandardMaterial color="#1a0533" roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh position={[0, -0.62, 0]}>
        <cylinderGeometry args={[0.08, 0.14, 0.08, 24]} />
        <meshStandardMaterial color="#0d0020" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Ray lines */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const angle = (deg * Math.PI) / 180;
        const len = i % 2 === 0 ? 0.22 : 0.14;
        return (
          <mesh
            key={deg}
            position={[
              Math.cos(angle) * (0.6 + len / 2),
              0.08 + Math.sin(angle) * (0.6 + len / 2) * 0.7,
              0,
            ]}
            rotation={[0, 0, angle]}
          >
            <boxGeometry args={[len, 0.012, 0.012]} />
            <meshStandardMaterial
              color="#FFA500"
              emissive="#FFA500"
              emissiveIntensity={1.5}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ── Floating particles ──
function Particles({ count = 60 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 4;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
  }
  useFrame(({ clock }) => {
    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.04;
    pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.02) * 0.1;
  });
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#7C3AED" size={0.022} transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

// ── Scene — responds to pointer ──
function Scene({ pointer }: { pointer: { x: number; y: number } }) {
  const groupRef = useRef<THREE.Group>(null!);
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame(() => {
    targetRotation.current.x += (pointer.y * 0.3 - targetRotation.current.x) * 0.05;
    targetRotation.current.y += (pointer.x * 0.5 - targetRotation.current.y) * 0.05;
    groupRef.current.rotation.x = targetRotation.current.x;
    groupRef.current.rotation.y = targetRotation.current.y;
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
        <LightbulbShell />
        <group position={[0, 0.08, 0]}>
          <BrainNetwork />
        </group>
      </Float>
      <Particles />
    </group>
  );
}

// ── Static Fallback (no WebGL / mobile) ──
function StaticFallback() {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      aria-hidden="true"
    >
      <div className="relative w-48 h-48">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(124,58,237,0.4) 0%, rgba(75,10,168,0.1) 60%, transparent 80%)",
            animation: "pulse 3s ease-in-out infinite",
          }}
        />
        <div
          className="absolute inset-6 rounded-full border border-[#7C3AED]/30"
          style={{ animation: "spin 8s linear infinite" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl">💡</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Export ──
export default function LightbulbScene() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [webglAvailable, setWebglAvailable] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check WebGL
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setWebglAvailable(false);
    } catch {
      setWebglAvailable(false);
    }
    setIsMobile(window.innerWidth < 768);
  }, []);

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPointer({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: -((e.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  };

  if (!webglAvailable || isMobile) {
    return <StaticFallback />;
  }

  return (
    <div
      className="w-full h-full"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
      aria-hidden="true"
      role="img"
      aria-label="3D animated lightbulb with creative network"
    >
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[2, 3, 2]} intensity={2} color="#7C3AED" />
        <pointLight position={[-2, -1, -1]} intensity={1.2} color="#FFA500" />
        <pointLight position={[0, 0, 2]} intensity={0.8} color="#ffffff" />
        <Stars radius={8} depth={3} count={300} factor={1} saturation={0} fade speed={0.5} />
        <Suspense fallback={null}>
          <Scene pointer={pointer} />
        </Suspense>
      </Canvas>
    </div>
  );
}
