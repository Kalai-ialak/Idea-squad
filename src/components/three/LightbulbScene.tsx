"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// ── Floating Geometric Crystal Shard ──
function CrystalShard({
  position,
  scale = 0.12,
  speed = 1,
  color = "#FFA500",
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
  color?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    meshRef.current.rotation.x = t * 0.8;
    meshRef.current.rotation.y = t * 1.1;
    meshRef.current.position.y += Math.sin(t * 1.5) * 0.0015;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        roughness={0.1}
        metalness={0.9}
      />
    </mesh>
  );
}

// ── Orbiting Chromatic Fluid Ring ──
function FluidRing() {
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ringRef.current.rotation.x = 1.1 + Math.sin(t * 0.3) * 0.15;
    ringRef.current.rotation.y = t * 0.4;
    ringRef.current.rotation.z = Math.cos(t * 0.25) * 0.2;
  });

  return (
    <mesh ref={ringRef} scale={[1.45, 1.45, 1.45]}>
      <torusGeometry args={[1, 0.04, 32, 100]} />
      <meshStandardMaterial
        color="#7C3AED"
        emissive="#4B0AA8"
        emissiveIntensity={0.8}
        roughness={0.08}
        metalness={0.95}
      />
    </mesh>
  );
}

// ── Second Counter-Orbiting Golden Accent Ring ──
function AccentRing() {
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ringRef.current.rotation.x = -0.8 + Math.cos(t * 0.35) * 0.12;
    ringRef.current.rotation.y = -t * 0.3;
    ringRef.current.rotation.z = Math.sin(t * 0.2) * 0.25;
  });

  return (
    <mesh ref={ringRef} scale={[1.7, 1.7, 1.7]}>
      <torusGeometry args={[1, 0.02, 24, 80]} />
      <meshStandardMaterial
        color="#FFA500"
        emissive="#FF8C00"
        emissiveIntensity={0.9}
        roughness={0.15}
        metalness={0.9}
      />
    </mesh>
  );
}

// ── Main Chromatic Liquid Organic Core ──
function LiquidSculpture({ isHovered }: { isHovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const innerRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Smooth idle spin
    meshRef.current.rotation.y = t * 0.25;
    meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.15;

    // Pulsing inner nucleus
    const pulse = 1 + Math.sin(t * 2.5) * 0.12;
    innerRef.current.scale.setScalar(pulse);
  });

  return (
    <group>
      {/* ── Inner Pulsing Energy Nucleus ("Ideas in Action") ── */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial
          color="#FFA500"
          emissive="#FF8C00"
          emissiveIntensity={2.2}
          roughness={0.1}
          metalness={0.5}
        />
      </mesh>

      {/* ── Outer High-Gloss Chromatic Liquid Metal Shell ── */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.92, 128, 128]} />
        <MeshDistortMaterial
          color="#22063d"
          emissive="#120124"
          emissiveIntensity={0.3}
          distort={isHovered ? 0.62 : 0.48}
          speed={isHovered ? 3.2 : 2.2}
          roughness={0.06}
          metalness={0.96}
          reflectivity={1.0}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
        />
      </mesh>
    </group>
  );
}

// ── Complete 3D Scene with Parallax Response ──
function Scene({
  pointer,
  isHovered,
}: {
  pointer: { x: number; y: number };
  isHovered: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame(() => {
    // Smooth mouse tilt & parallax
    targetRotation.current.x += (pointer.y * 0.45 - targetRotation.current.x) * 0.05;
    targetRotation.current.y += (pointer.x * 0.65 - targetRotation.current.y) * 0.05;

    groupRef.current.rotation.x = targetRotation.current.x;
    groupRef.current.rotation.y = targetRotation.current.y;
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.4}>
        <LiquidSculpture isHovered={isHovered} />
        <FluidRing />
        <AccentRing />

        {/* Orbiting Crystal Shards */}
        <CrystalShard position={[1.4, 0.4, 0.2]} scale={0.11} speed={1.2} color="#FFA500" />
        <CrystalShard position={[-1.3, -0.5, 0.3]} scale={0.09} speed={0.9} color="#9D5CF5" />
        <CrystalShard position={[0.7, 1.2, -0.4]} scale={0.13} speed={1.4} color="#7C3AED" />
        <CrystalShard position={[-0.8, 1.0, 0.4]} scale={0.08} speed={1.1} color="#FFA500" />
        <CrystalShard position={[0.2, -1.3, -0.3]} scale={0.1} speed={0.8} color="#C084FC" />
      </Float>

      {/* Gold & Purple Stardust Sparkles */}
      <Sparkles
        count={50}
        scale={4}
        size={2.5}
        speed={0.5}
        opacity={0.7}
        color="#FFA500"
      />
      <Sparkles
        count={60}
        scale={4.5}
        size={3}
        speed={0.4}
        opacity={0.8}
        color="#A855F7"
      />
    </group>
  );
}

// ── Static Fallback for No WebGL or Mobile ──
function StaticFallback() {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      aria-hidden="true"
    >
      <div className="relative w-64 h-64 flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-60"
          style={{
            background:
              "radial-gradient(circle, #7C3AED 0%, #FFA500 50%, transparent 75%)",
            animation: "pulse 3s ease-in-out infinite",
          }}
        />
        <div
          className="w-48 h-48 rounded-full border border-purple-500/40 shadow-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(75,10,168,0.8), rgba(255,165,0,0.3))",
          }}
        />
      </div>
    </div>
  );
}

// ── Main Export ──
export default function LightbulbScene() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      if (!gl) setWebglAvailable(false);
    } catch {
      setWebglAvailable(false);
    }
    setIsMobile(window.innerWidth < 640);
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
      className="w-full h-full cursor-grab active:cursor-grabbing"
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => {
        setPointer({ x: 0, y: 0 });
        setIsHovered(false);
      }}
      aria-hidden="true"
      role="img"
      aria-label="Interactive 3D Dark Futuristic Liquid Metal Art"
    >
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        {/* ── Dramatic Studio 3D Lighting Setup ── */}
        <ambientLight intensity={0.5} />

        {/* Primary Key Light: Electric Violet / Purple */}
        <directionalLight position={[4, 5, 3]} intensity={3.5} color="#8B5CF6" />

        {/* Dramatic Rim Light: Hot Neon Amber / Orange */}
        <directionalLight position={[-4, -3, -2]} intensity={4.0} color="#FFA500" />

        {/* Top Rim Specular: Crisp Magenta-Violet */}
        <pointLight position={[0, 4, 1]} intensity={2.5} color="#D946EF" />

        {/* Cyan Iridescent Accent Light */}
        <pointLight position={[-3, 2, 2]} intensity={1.8} color="#06B6D4" />

        {/* Center Nucleus Light */}
        <pointLight position={[0, 0, 0]} intensity={2.0} color="#FFA500" distance={3} />

        <Suspense fallback={null}>
          <Scene pointer={pointer} isHovered={isHovered} />
        </Suspense>
      </Canvas>
    </div>
  );
}
