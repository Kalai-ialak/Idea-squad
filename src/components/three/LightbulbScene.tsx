"use client";

import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

// ── Helper: Generate High-Detail Procedural Earth Texture ──
function useEarthTextures() {
  return useMemo(() => {
    // 1. Earth Surface Texture (Continents, Oceans & Coastal Rims)
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d")!;

    // Deep space-ocean background
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGrad.addColorStop(0, "#060814");
    oceanGrad.addColorStop(0.5, "#0b112c");
    oceanGrad.addColorStop(1, "#050713");
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Oceanic bathymetric glow & continental shelf
    ctx.fillStyle = "rgba(124, 58, 237, 0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw recognizable stylized continental masses
    const continents = [
      // North America
      { x: 340, y: 310, rx: 140, ry: 95, rot: -0.2 },
      { x: 420, y: 220, rx: 90, ry: 60, rot: 0.1 },
      // South America
      { x: 520, y: 640, rx: 90, ry: 160, rot: 0.25 },
      // Europe
      { x: 1020, y: 260, rx: 95, ry: 65, rot: 0.0 },
      // Africa
      { x: 1040, y: 530, rx: 130, ry: 150, rot: 0.1 },
      // Asia
      { x: 1380, y: 300, rx: 220, ry: 130, rot: -0.1 },
      { x: 1540, y: 400, rx: 140, ry: 90, rot: 0.2 },
      // India / South Asia
      { x: 1340, y: 460, rx: 75, ry: 85, rot: 0.1 },
      // Australia
      { x: 1660, y: 700, rx: 110, ry: 80, rot: -0.05 },
    ];

    // Landmass fill with dark futuristic palette (deep slate + purple-gold accents)
    continents.forEach(({ x, y, rx, ry, rot }) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);

      // Organic continental outline
      ctx.beginPath();
      const points = 16;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        // Pseudo-random coastline roughness
        const wobble = 1 + Math.sin(angle * 4 + x) * 0.18 + Math.cos(angle * 7) * 0.12;
        const px = Math.cos(angle) * rx * wobble;
        const py = Math.sin(angle) * ry * wobble;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      // Land fill
      const landGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, Math.max(rx, ry));
      landGrad.addColorStop(0, "#19223c");
      landGrad.addColorStop(0.7, "#11182c");
      landGrad.addColorStop(1, "#0d1322");
      ctx.fillStyle = landGrad;
      ctx.fill();

      // Glowing coastline
      ctx.strokeStyle = "rgba(124, 58, 237, 0.4)";
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.restore();
    });

    // ── Glowing Golden/Amber City Night Lights ──
    ctx.fillStyle = "#FFA500";
    for (let i = 0; i < 450; i++) {
      const parent = continents[i % continents.length];
      const offsetX = (Math.random() - 0.5) * parent.rx * 1.4;
      const offsetY = (Math.random() - 0.5) * parent.ry * 1.4;
      const px = parent.x + offsetX;
      const py = parent.y + offsetY;
      const rad = Math.random() * 2.2 + 0.8;

      ctx.beginPath();
      ctx.arc(px, py, rad, 0, Math.PI * 2);
      ctx.fillStyle = i % 3 === 0 ? "#FFD700" : i % 2 === 0 ? "#FFA500" : "#C084FC";
      ctx.shadowColor = "#FFA500";
      ctx.shadowBlur = 6;
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    const surfaceTex = new THREE.CanvasTexture(canvas);
    surfaceTex.wrapS = THREE.RepeatWrapping;
    surfaceTex.wrapT = THREE.ClampToEdgeWrapping;

    // 2. Translucent Swirling Cloud Texture
    const cloudCanvas = document.createElement("canvas");
    cloudCanvas.width = 1024;
    cloudCanvas.height = 512;
    const cctx = cloudCanvas.getContext("2d")!;
    cctx.clearRect(0, 0, cloudCanvas.width, cloudCanvas.height);

    for (let i = 0; i < 90; i++) {
      const cx = Math.random() * cloudCanvas.width;
      const cy = 60 + Math.random() * (cloudCanvas.height - 120);
      const crx = 60 + Math.random() * 120;
      const cry = 20 + Math.random() * 45;
      const grad = cctx.createRadialGradient(cx, cy, 0, cx, cy, crx);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.35)");
      grad.addColorStop(0.5, "rgba(230, 240, 255, 0.15)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      cctx.fillStyle = grad;
      cctx.beginPath();
      cctx.ellipse(cx, cy, crx, cry, Math.random() * 0.3 - 0.15, 0, Math.PI * 2);
      cctx.fill();
    }

    const cloudTex = new THREE.CanvasTexture(cloudCanvas);
    cloudTex.wrapS = THREE.RepeatWrapping;
    cloudTex.wrapT = THREE.ClampToEdgeWrapping;

    return { surfaceTex, cloudTex };
  }, []);
}

// ── Realistic Space Station (ISS-Style Modular Habitat with Solar Wings) ──
function SpaceStation({ orbitRadius = 1.65, orbitSpeed = 0.5 }: { orbitRadius?: number; orbitSpeed?: number }) {
  const stationGroup = useRef<THREE.Group>(null!);
  const beaconRef = useRef<THREE.PointLight>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * orbitSpeed;
    // Circular orbital path inclined at 28 degrees
    const x = Math.cos(t) * orbitRadius;
    const z = Math.sin(t) * orbitRadius;
    const y = Math.sin(t * 1.5) * 0.35;

    stationGroup.current.position.set(x, y, z);

    // Tangential rotation so station faces forward along flight path
    stationGroup.current.rotation.y = -t + Math.PI / 2;
    stationGroup.current.rotation.z = Math.sin(t) * 0.15;

    // Blinking navigation beacon
    if (beaconRef.current) {
      beaconRef.current.intensity = Math.sin(clock.getElapsedTime() * 6) > 0.4 ? 1.5 : 0.1;
    }
  });

  return (
    <group ref={stationGroup}>
      {/* ── Main Pressurized Cylindrical Habitat Core ── */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.22, 16]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.25} metalness={0.9} />
      </mesh>

      {/* Docking Node / Cupola Observation Dome */}
      <mesh position={[0, 0.03, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#38BDF8" emissive="#0284C7" emissiveIntensity={0.6} roughness={0.1} metalness={0.8} />
      </mesh>

      {/* Central Integrated Truss Structure */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.02, 0.52, 0.02]} />
        <meshStandardMaterial color="#94A3B8" roughness={0.4} metalness={0.95} />
      </mesh>

      {/* ── Solar Array Wings (Port & Starboard) ── */}
      {/* Port Solar Panels */}
      <group position={[0, 0, 0.2]}>
        <mesh position={[0, 0, 0.05]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.16, 0.005, 0.12]} />
          <meshStandardMaterial
            color="#0F172A"
            emissive="#1E3A8A"
            emissiveIntensity={0.8}
            roughness={0.1}
            metalness={0.95}
          />
        </mesh>
        <mesh position={[0, 0, 0.19]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.16, 0.005, 0.12]} />
          <meshStandardMaterial
            color="#0F172A"
            emissive="#1E3A8A"
            emissiveIntensity={0.8}
            roughness={0.1}
            metalness={0.95}
          />
        </mesh>
      </group>

      {/* Starboard Solar Panels */}
      <group position={[0, 0, -0.2]}>
        <mesh position={[0, 0, -0.05]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.16, 0.005, 0.12]} />
          <meshStandardMaterial
            color="#0F172A"
            emissive="#1E3A8A"
            emissiveIntensity={0.8}
            roughness={0.1}
            metalness={0.95}
          />
        </mesh>
        <mesh position={[0, 0, -0.19]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.16, 0.005, 0.12]} />
          <meshStandardMaterial
            color="#0F172A"
            emissive="#1E3A8A"
            emissiveIntensity={0.8}
            roughness={0.1}
            metalness={0.95}
          />
        </mesh>
      </group>

      {/* Communication Dish */}
      <mesh position={[0.08, 0, 0]} rotation={[0, 0, -0.6]}>
        <coneGeometry args={[0.035, 0.02, 16, 1, true]} />
        <meshStandardMaterial color="#FFA500" emissive="#FF8C00" emissiveIntensity={0.5} roughness={0.2} metalness={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* Navigation Strobe Beacon */}
      <pointLight ref={beaconRef} color="#38BDF8" distance={0.5} intensity={1} />
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshBasicMaterial color="#38BDF8" />
      </mesh>
    </group>
  );
}

// ── Second Smaller Communications Satellite in Polar Orbit ──
function PolarSatellite() {
  const satRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.75 + 2.5;
    const r = 1.45;
    // Polar inclined orbit
    const x = Math.sin(t) * 0.5;
    const y = Math.cos(t) * r;
    const z = Math.sin(t) * (r * 0.85);

    satRef.current.position.set(x, y, z);
    satRef.current.rotation.x = t;
    satRef.current.rotation.y = t * 1.2;
  });

  return (
    <group ref={satRef}>
      {/* CubeSat Chassis */}
      <mesh>
        <boxGeometry args={[0.045, 0.045, 0.06]} />
        <meshStandardMaterial color="#FFA500" roughness={0.2} metalness={0.95} />
      </mesh>
      {/* Mini solar wings */}
      <mesh position={[0.05, 0, 0]}>
        <boxGeometry args={[0.06, 0.003, 0.04]} />
        <meshStandardMaterial color="#1E3A8A" emissive="#1D4ED8" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.05, 0, 0]}>
        <boxGeometry args={[0.06, 0.003, 0.04]} />
        <meshStandardMaterial color="#1E3A8A" emissive="#1D4ED8" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// ── Glowing Futuristic Orbital Trajectory Ring ──
function OrbitalTrajectory({ radius = 1.65, tilt = 0.45 }: { radius?: number; tilt?: number }) {
  return (
    <group rotation={[tilt, 0, 0.2]}>
      <mesh>
        <torusGeometry args={[radius, 0.004, 16, 120]} />
        <meshBasicMaterial color="#7C3AED" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

// ── Complete 3D Earth Globe with Atmosphere & Cloud Rotation ──
function EarthGlobe() {
  const earthRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);
  const { surfaceTex, cloudTex } = useEarthTextures();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Earth steady axial rotation (23.5 degree tilt)
    earthRef.current.rotation.y = t * 0.08;
    // Clouds rotate slightly faster to create realistic atmospheric movement
    cloudsRef.current.rotation.y = t * 0.11;
  });

  return (
    <group rotation={[0.41, 0, -0.1]}>
      {/* ── Base Earth Sphere with Oceans & City Night Lights ── */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1.0, 64, 64]} />
        <meshStandardMaterial
          map={surfaceTex}
          roughness={0.4}
          metalness={0.3}
          emissive="#7C3AED"
          emissiveIntensity={0.12}
        />
      </mesh>

      {/* ── Dynamic Cloud Layer ── */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.018, 48, 48]} />
        <meshStandardMaterial
          map={cloudTex}
          transparent
          opacity={0.42}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ── Radiant Atmospheric Fresnel Glow (Deep Violet & Azure) ── */}
      <mesh>
        <sphereGeometry args={[1.055, 36, 36]} />
        <meshBasicMaterial
          color="#8B5CF6"
          transparent
          opacity={0.16}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.09, 32, 32]} />
        <meshBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// ── 3D Scene Assembly with Interactive Parallax ──
function Scene({ pointer }: { pointer: { x: number; y: number } }) {
  const sceneGroup = useRef<THREE.Group>(null!);
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame(() => {
    // Parallax mouse tilt
    targetRotation.current.x += (pointer.y * 0.35 - targetRotation.current.x) * 0.05;
    targetRotation.current.y += (pointer.x * 0.5 - targetRotation.current.y) * 0.05;

    sceneGroup.current.rotation.x = targetRotation.current.x;
    sceneGroup.current.rotation.y = targetRotation.current.y;
  });

  return (
    <group ref={sceneGroup}>
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
        {/* Photorealistic Stylized Earth */}
        <EarthGlobe />

        {/* Orbiting Space Station */}
        <SpaceStation orbitRadius={1.65} orbitSpeed={0.5} />

        {/* Polar Tracking Satellite */}
        <PolarSatellite />

        {/* Faint Glowing Orbital Tracks */}
        <OrbitalTrajectory radius={1.65} tilt={0.45} />
        <OrbitalTrajectory radius={1.45} tilt={1.3} />
      </Float>

      {/* Deep Space Cosmic Dust & Stardust */}
      <Sparkles count={70} scale={6} size={2.2} speed={0.3} opacity={0.8} color="#FFFFFF" />
      <Sparkles count={40} scale={5} size={3.0} speed={0.4} opacity={0.7} color="#FFA500" />
      <Sparkles count={50} scale={5.5} size={2.5} speed={0.3} opacity={0.6} color="#A855F7" />
    </group>
  );
}

// ── Static Fallback for Low-End Devices or No WebGL ──
function StaticFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
      <div className="relative w-64 h-64 flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full blur-3xl opacity-50"
          style={{
            background: "radial-gradient(circle, #38BDF8 0%, #7C3AED 50%, transparent 75%)",
            animation: "pulse 3s ease-in-out infinite",
          }}
        />
        <div
          className="w-48 h-48 rounded-full border border-blue-400/40 shadow-2xl flex items-center justify-center"
          style={{
            background: "radial-gradient(circle at 35% 35%, #1E3A8A 0%, #0B132B 70%, #030712 100%)",
          }}
        >
          <span className="text-5xl">🌍</span>
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
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
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
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
      aria-hidden="true"
      role="img"
      aria-label="Interactive 3D Earth Globe with Orbiting Space Station"
    >
      <Canvas
        camera={{ position: [0, 0, 3.4], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        {/* ── Cinematic Space Lighting ── */}
        <ambientLight intensity={0.4} />

        {/* Primary Sun Light (Warm White Sunlight from upper right) */}
        <directionalLight position={[5, 3, 4]} intensity={3.5} color="#FFFBF0" />

        {/* Deep Space Rim Light (Electric Violet from rear-left) */}
        <directionalLight position={[-5, -2, -3]} intensity={2.0} color="#7C3AED" />

        {/* Earth Horizon Specular Accent (Azure Blue) */}
        <pointLight position={[3, 4, 2]} intensity={2.2} color="#38BDF8" />

        {/* Night-side city illumination accent (Amber) */}
        <pointLight position={[-2, -1, 2]} intensity={1.2} color="#FFA500" />

        <Suspense fallback={null}>
          <Scene pointer={pointer} />
        </Suspense>
      </Canvas>
    </div>
  );
}
