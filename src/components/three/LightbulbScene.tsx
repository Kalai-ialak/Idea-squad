"use client";

import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

// ── Realistic High-Resolution Procedural Earth Textures ──
function useEarthTextures() {
  return useMemo(() => {
    // ── 1. Detailed Earth Surface (Oceans, Coastlines, Continents, Ice, City Lights) ──
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d")!;

    // Deep vibrant sapphire & royal blue oceans
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGrad.addColorStop(0, "#082046");
    oceanGrad.addColorStop(0.2, "#0d3570");
    oceanGrad.addColorStop(0.5, "#14488f");
    oceanGrad.addColorStop(0.8, "#0d3570");
    oceanGrad.addColorStop(1, "#082046");
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Continental landmass specifications (coordinates, bounds, terrain type)
    const continents = [
      // North America
      {
        name: "North America",
        x: 380,
        y: 280,
        rx: 160,
        ry: 110,
        rot: -0.15,
        terrain: "mixed",
        cityCount: 65,
      },
      // Central America
      {
        name: "Central America",
        x: 440,
        y: 430,
        rx: 40,
        ry: 70,
        rot: 0.35,
        terrain: "lush",
        cityCount: 15,
      },
      // South America
      {
        name: "South America",
        x: 550,
        y: 630,
        rx: 100,
        ry: 170,
        rot: 0.2,
        terrain: "amazon",
        cityCount: 50,
      },
      // Europe
      {
        name: "Europe",
        x: 1050,
        y: 240,
        rx: 110,
        ry: 75,
        rot: -0.05,
        terrain: "lush",
        cityCount: 75,
      },
      // Africa
      {
        name: "Africa",
        x: 1070,
        y: 530,
        rx: 140,
        ry: 165,
        rot: 0.08,
        terrain: "africa",
        cityCount: 60,
      },
      // Asia
      {
        name: "Asia",
        x: 1420,
        y: 290,
        rx: 240,
        ry: 140,
        rot: -0.08,
        terrain: "mixed",
        cityCount: 110,
      },
      // India / South Asia
      {
        name: "India",
        x: 1370,
        y: 450,
        rx: 85,
        ry: 95,
        rot: 0.12,
        terrain: "lush",
        cityCount: 60,
      },
      // Southeast Asia / Islands
      {
        name: "SE Asia",
        x: 1560,
        y: 480,
        rx: 90,
        ry: 80,
        rot: 0.25,
        terrain: "lush",
        cityCount: 40,
      },
      // Australia
      {
        name: "Australia",
        x: 1680,
        y: 700,
        rx: 125,
        ry: 90,
        rot: -0.05,
        terrain: "desert",
        cityCount: 35,
      },
      // Greenland
      {
        name: "Greenland",
        x: 740,
        y: 130,
        rx: 80,
        ry: 55,
        rot: -0.2,
        terrain: "ice",
        cityCount: 5,
      },
    ];

    // Draw continents with coastal turquoise shelves, terrain gradients & borders
    continents.forEach(({ x, y, rx, ry, rot, terrain, cityCount }) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);

      // ── Step A: Vibrant Turquoise / Cyan Coastal Water Shelf ──
      ctx.beginPath();
      const numPts = 24;
      for (let i = 0; i <= numPts; i++) {
        const angle = (i / numPts) * Math.PI * 2;
        const wobble = 1 + Math.sin(angle * 5 + x * 0.1) * 0.14 + Math.cos(angle * 8) * 0.1;
        const px = Math.cos(angle) * (rx + 22) * wobble;
        const py = Math.sin(angle) * (ry + 22) * wobble;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      const coastGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, Math.max(rx, ry) + 24);
      coastGrad.addColorStop(0, "rgba(6, 182, 212, 0.45)");
      coastGrad.addColorStop(0.6, "rgba(2, 132, 199, 0.35)");
      coastGrad.addColorStop(1, "rgba(20, 72, 143, 0)");
      ctx.fillStyle = coastGrad;
      ctx.fill();

      // ── Step B: Organic Continental Landmass ──
      ctx.beginPath();
      for (let i = 0; i <= numPts; i++) {
        const angle = (i / numPts) * Math.PI * 2;
        const wobble = 1 + Math.sin(angle * 4 + x * 0.1) * 0.15 + Math.cos(angle * 9) * 0.08;
        const px = Math.cos(angle) * rx * wobble;
        const py = Math.sin(angle) * ry * wobble;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      // Rich terrain palettes according to geographic biome
      const landGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, Math.max(rx, ry));
      if (terrain === "ice") {
        landGrad.addColorStop(0, "#f8fafc");
        landGrad.addColorStop(0.7, "#e2e8f0");
        landGrad.addColorStop(1, "#94a3b8");
      } else if (terrain === "desert") {
        landGrad.addColorStop(0, "#c2782e"); // Australian red desert
        landGrad.addColorStop(0.5, "#d98e32");
        landGrad.addColorStop(0.85, "#a66c24");
        landGrad.addColorStop(1, "#365314"); // coastal scrub
      } else if (terrain === "africa") {
        landGrad.addColorStop(0, "#ca8a04"); // Sahara gold
        landGrad.addColorStop(0.4, "#b45309");
        landGrad.addColorStop(0.75, "#15803d"); // Congo jungle
        landGrad.addColorStop(1, "#166534");
      } else if (terrain === "amazon") {
        landGrad.addColorStop(0, "#15803d");
        landGrad.addColorStop(0.6, "#166534");
        landGrad.addColorStop(0.85, "#14532d");
        landGrad.addColorStop(1, "#713f12"); // Andes mountains
      } else {
        // Mixed temperate / forest
        landGrad.addColorStop(0, "#166534"); // lush forest
        landGrad.addColorStop(0.45, "#15803d");
        landGrad.addColorStop(0.75, "#65a30d"); // plains
        landGrad.addColorStop(1, "#854d0e"); // mountain ridges
      }

      ctx.fillStyle = landGrad;
      ctx.fill();

      // Sharp shoreline definition
      ctx.strokeStyle = terrain === "ice" ? "rgba(255,255,255,0.7)" : "rgba(180, 240, 200, 0.45)";
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // ── Step C: Golden / Amber Night-City Lights ──
      for (let c = 0; c < cityCount; c++) {
        const u = (Math.random() - 0.5) * 1.5;
        const v = (Math.random() - 0.5) * 1.5;
        if (u * u + v * v > 0.8) continue;

        const cx = u * rx;
        const cy = v * ry;
        const size = Math.random() * 2.8 + 0.8;

        ctx.beginPath();
        ctx.arc(cx, cy, size, 0, Math.PI * 2);
        ctx.fillStyle = c % 4 === 0 ? "#FFFBEB" : c % 2 === 0 ? "#FBBF24" : "#F59E0B";
        ctx.shadowColor = "#F59E0B";
        ctx.shadowBlur = 5;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      ctx.restore();
    });

    // Polar ice caps (North & South Poles)
    // Arctic
    ctx.fillStyle = "rgba(248, 250, 252, 0.95)";
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, 25, canvas.width / 2, 55, 0, 0, Math.PI * 2);
    ctx.fill();

    // Antarctica
    ctx.fillStyle = "rgba(241, 245, 249, 0.98)";
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, canvas.height - 30, canvas.width / 2, 75, 0, 0, Math.PI * 2);
    ctx.fill();

    const surfaceTex = new THREE.CanvasTexture(canvas);
    surfaceTex.wrapS = THREE.RepeatWrapping;
    surfaceTex.wrapT = THREE.ClampToEdgeWrapping;

    // ── 2. Realistic Swirling Cloud Texture ──
    const cloudCanvas = document.createElement("canvas");
    cloudCanvas.width = 2048;
    cloudCanvas.height = 1024;
    const cctx = cloudCanvas.getContext("2d")!;
    cctx.clearRect(0, 0, cloudCanvas.width, cloudCanvas.height);

    // Weather bands & cyclones
    for (let b = 0; b < 120; b++) {
      const cx = Math.random() * cloudCanvas.width;
      const cy = 80 + Math.random() * (cloudCanvas.height - 160);
      const crx = 80 + Math.random() * 160;
      const cry = 20 + Math.random() * 55;
      const angle = (Math.random() - 0.5) * 0.4;

      const grad = cctx.createRadialGradient(cx, cy, 0, cx, cy, crx);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.65)");
      grad.addColorStop(0.4, "rgba(255, 255, 255, 0.35)");
      grad.addColorStop(0.8, "rgba(240, 248, 255, 0.12)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");

      cctx.fillStyle = grad;
      cctx.beginPath();
      cctx.ellipse(cx, cy, crx, cry, angle, 0, Math.PI * 2);
      cctx.fill();
    }

    const cloudTex = new THREE.CanvasTexture(cloudCanvas);
    cloudTex.wrapS = THREE.RepeatWrapping;
    cloudTex.wrapT = THREE.ClampToEdgeWrapping;

    return { surfaceTex, cloudTex };
  }, []);
}

// ── Prominent, High-Detail Space Station (ISS Modular Style) ──
function SpaceStation({
  orbitRadius = 1.85,
  orbitSpeed = 0.45,
}: {
  orbitRadius?: number;
  orbitSpeed?: number;
}) {
  const stationRef = useRef<THREE.Group>(null!);
  const beaconRef = useRef<THREE.PointLight>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * orbitSpeed;
    // Circular inclined orbital flight path around Earth
    const x = Math.cos(t) * orbitRadius;
    const z = Math.sin(t) * orbitRadius;
    const y = Math.sin(t * 1.3) * 0.55;

    stationRef.current.position.set(x, y, z);

    // Tangential forward rotation
    stationRef.current.rotation.y = -t + Math.PI / 2;
    stationRef.current.rotation.x = Math.sin(t * 0.8) * 0.2;

    // Strobe beacon flash
    if (beaconRef.current) {
      beaconRef.current.intensity = Math.sin(clock.getElapsedTime() * 7) > 0.3 ? 2.5 : 0.2;
    }
  });

  return (
    <group ref={stationRef} scale={[1.8, 1.8, 1.8]}>
      {/* ── Central Metallic Living Modules (Habitats) ── */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.045, 0.045, 0.28, 16]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.2} metalness={0.92} />
      </mesh>

      {/* Cross-docking laboratory module */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.038, 0.038, 0.18, 16]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.88} />
      </mesh>

      {/* Observation Cupola Dome (Glass window glow) */}
      <mesh position={[0, 0.042, 0]}>
        <sphereGeometry args={[0.042, 16, 16]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#0284C7"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Long Structural Integrated Truss (Extending to solar wings) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.024, 0.65, 0.024]} />
        <meshStandardMaterial color="#94A3B8" roughness={0.4} metalness={0.95} />
      </mesh>

      {/* ── Giant Solar Array Wings (Bright Blue / Gold Cells) ── */}
      {/* Port Solar Wings */}
      <group position={[0, 0, 0.24]}>
        <mesh position={[0, 0, 0.055]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.22, 0.006, 0.15]} />
          <meshStandardMaterial
            color="#0A192F"
            emissive="#1E40AF"
            emissiveIntensity={1.2}
            roughness={0.12}
            metalness={0.95}
          />
        </mesh>
        <mesh position={[0, 0, 0.21]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.22, 0.006, 0.15]} />
          <meshStandardMaterial
            color="#0A192F"
            emissive="#1E40AF"
            emissiveIntensity={1.2}
            roughness={0.12}
            metalness={0.95}
          />
        </mesh>
      </group>

      {/* Starboard Solar Wings */}
      <group position={[0, 0, -0.24]}>
        <mesh position={[0, 0, -0.055]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.22, 0.006, 0.15]} />
          <meshStandardMaterial
            color="#0A192F"
            emissive="#1E40AF"
            emissiveIntensity={1.2}
            roughness={0.12}
            metalness={0.95}
          />
        </mesh>
        <mesh position={[0, 0, -0.21]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.22, 0.006, 0.15]} />
          <meshStandardMaterial
            color="#0A192F"
            emissive="#1E40AF"
            emissiveIntensity={1.2}
            roughness={0.12}
            metalness={0.95}
          />
        </mesh>
      </group>

      {/* Gold Communication Parabolic Dish */}
      <mesh position={[0.11, 0, 0]} rotation={[0, 0, -0.7]}>
        <coneGeometry args={[0.045, 0.025, 16, 1, true]} />
        <meshStandardMaterial
          color="#FFA500"
          emissive="#F59E0B"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.95}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Blinking Cyan Navigation Strobe */}
      <pointLight ref={beaconRef} color="#38BDF8" distance={0.8} intensity={2} />
      <mesh position={[0, 0.065, 0]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshBasicMaterial color="#38BDF8" />
      </mesh>

      {/* Red Wingtip Beacon */}
      <mesh position={[0, 0.01, 0.42]}>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>
      {/* Green Wingtip Beacon */}
      <mesh position={[0, 0.01, -0.42]}>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshBasicMaterial color="#10B981" />
      </mesh>
    </group>
  );
}

// ── Second Smaller Communications Relay Satellite ──
function RelaySatellite() {
  const satRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.6 + 3.2;
    const r = 1.55;
    const x = Math.sin(t) * (r * 0.6);
    const y = Math.cos(t) * r;
    const z = Math.sin(t) * r;

    satRef.current.position.set(x, y, z);
    satRef.current.rotation.x = t * 0.7;
    satRef.current.rotation.y = t * 1.2;
  });

  return (
    <group ref={satRef} scale={[1.4, 1.4, 1.4]}>
      {/* Gold foil chassis */}
      <mesh>
        <boxGeometry args={[0.05, 0.05, 0.07]} />
        <meshStandardMaterial
          color="#FFA500"
          emissive="#F59E0B"
          emissiveIntensity={0.5}
          roughness={0.15}
          metalness={0.95}
        />
      </mesh>
      {/* Solar wings */}
      <mesh position={[0.07, 0, 0]}>
        <boxGeometry args={[0.08, 0.003, 0.05]} />
        <meshStandardMaterial color="#1E3A8A" emissive="#2563EB" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-0.07, 0, 0]}>
        <boxGeometry args={[0.08, 0.003, 0.05]} />
        <meshStandardMaterial color="#1E3A8A" emissive="#2563EB" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

// ── Glowing Space Trajectory Rings ──
function OrbitalPath({ radius = 1.85, tilt = 0.55 }: { radius?: number; tilt?: number }) {
  return (
    <group rotation={[tilt, 0, 0.25]}>
      <mesh>
        <torusGeometry args={[radius, 0.005, 16, 120]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// ── Photorealistic 3D Earth Planet Model ──
function PlanetEarth() {
  const earthRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);
  const { surfaceTex, cloudTex } = useEarthTextures();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Earth's natural axial rotation
    earthRef.current.rotation.y = t * 0.09;
    // Cloud layer travels slightly faster
    cloudsRef.current.rotation.y = t * 0.12;
  });

  return (
    <group rotation={[0.41, 0, -0.08]}>
      {/* ── Main Vibrant Earth Sphere (Oceans + Continents + Night Lights) ── */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1.18, 64, 64]} />
        <meshStandardMaterial
          map={surfaceTex}
          roughness={0.4}
          metalness={0.15}
        />
      </mesh>

      {/* ── Dynamic Cloud Layer ── */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.205, 48, 48]} />
        <meshStandardMaterial
          map={cloudTex}
          transparent
          opacity={0.48}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ── Atmospheric Rayleigh Haze & Horizon Glow (Azure Blue & Cyan) ── */}
      <mesh>
        <sphereGeometry args={[1.245, 36, 36]} />
        <meshBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.22}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.29, 32, 32]} />
        <meshBasicMaterial
          color="#60A5FA"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// ── Interactive 3D Scene Parallax ──
function Scene({ pointer }: { pointer: { x: number; y: number } }) {
  const sceneRef = useRef<THREE.Group>(null!);
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame(() => {
    // Parallax mouse tilt
    targetRotation.current.x += (pointer.y * 0.35 - targetRotation.current.x) * 0.05;
    targetRotation.current.y += (pointer.x * 0.5 - targetRotation.current.y) * 0.05;

    sceneRef.current.rotation.x = targetRotation.current.x;
    sceneRef.current.rotation.y = targetRotation.current.y;
  });

  return (
    <group ref={sceneRef}>
      <Float speed={1.0} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* The Radiant Planet Earth */}
        <PlanetEarth />

        {/* Detailed International Space Station */}
        <SpaceStation orbitRadius={1.85} orbitSpeed={0.45} />

        {/* Communication Relay Satellite */}
        <RelaySatellite />

        {/* Orbital Navigation Lines */}
        <OrbitalPath radius={1.85} tilt={0.55} />
        <OrbitalPath radius={1.55} tilt={1.15} />
      </Float>

      {/* Cosmic Deep-Space Starfield */}
      <Sparkles count={80} scale={6.5} size={2.5} speed={0.2} opacity={0.85} color="#FFFFFF" />
      <Sparkles count={50} scale={5.5} size={3.0} speed={0.3} opacity={0.7} color="#FBBF24" />
      <Sparkles count={45} scale={6.0} size={2.5} speed={0.25} opacity={0.65} color="#60A5FA" />
    </group>
  );
}

// ── Fallback for Non-WebGL Devices ──
function StaticFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
      <div className="relative w-64 h-64 flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full blur-3xl opacity-60"
          style={{
            background: "radial-gradient(circle, #38BDF8 0%, #1D4ED8 60%, transparent 75%)",
            animation: "pulse 3s ease-in-out infinite",
          }}
        />
        <div
          className="w-52 h-52 rounded-full border border-blue-400/50 shadow-2xl flex items-center justify-center"
          style={{
            background: "radial-gradient(circle at 35% 35%, #2563EB 0%, #0F172A 75%)",
          }}
        >
          <span className="text-6xl">🌍</span>
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
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        {/* ── Space Sunlight & Atmospheric Illumination ── */}
        <ambientLight intensity={0.65} />

        {/* Primary Radiant Sunlight (Bright white from upper right) */}
        <directionalLight position={[5, 3.5, 4.5]} intensity={4.2} color="#FFFDF5" />

        {/* Ocean Specular Highlight Light */}
        <pointLight position={[3, 4, 3]} intensity={2.8} color="#E0F2FE" />

        {/* Horizon Azure Atmosphere Backlight */}
        <directionalLight position={[-4, -2, -3]} intensity={1.8} color="#0284C7" />

        {/* Night-side City Light Enhancer (Warm Amber) */}
        <pointLight position={[-3, -1, 2]} intensity={1.5} color="#F59E0B" />

        <Suspense fallback={null}>
          <Scene pointer={pointer} />
        </Suspense>
      </Canvas>
    </div>
  );
}
