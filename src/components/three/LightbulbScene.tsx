"use client";

import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

// ── Indian Flag & BAS Emblem Decal Texture Generator ──
function useBasDecal() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;

    // Clean white hull background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ── Indian Tricolor Flag (Tiranga) ──
    const flagX = 50;
    const flagY = 60;
    const flagW = 160;
    const flagH = 100;
    const bandH = flagH / 3;

    // Saffron band
    ctx.fillStyle = "#FF9933";
    ctx.fillRect(flagX, flagY, flagW, bandH);

    // White band
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(flagX, flagY + bandH, flagW, bandH);

    // Green band
    ctx.fillStyle = "#138808";
    ctx.fillRect(flagX, flagY + bandH * 2, flagW, bandH);

    // Ashoka Chakra (Navy Blue)
    const cx = flagX + flagW / 2;
    const cy = flagY + bandH * 1.5;
    const r = bandH * 0.42;

    ctx.strokeStyle = "#000080";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < 24; i++) {
      const angle = (i * Math.PI) / 12;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
      ctx.stroke();
    }

    // Flag border
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.lineWidth = 1;
    ctx.strokeRect(flagX, flagY, flagW, flagH);

    // ── Text: "भारत" & "ISRO / BAS" ──
    ctx.fillStyle = "#1E293B";
    ctx.font = "bold 44px sans-serif";
    ctx.fillText("भारत", 260, 115);

    ctx.fillStyle = "#FF9933";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("BAS · ISRO", 262, 155);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);
}

// ── Solar Panel Grid Texture Generator ──
function useSolarPanelTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    // Deep space navy photovoltaic cell base
    ctx.fillStyle = "#0A192F";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines for solar cells
    ctx.strokeStyle = "#38BDF8";
    ctx.lineWidth = 1.5;

    const rows = 16;
    const cols = 6;
    const cellW = canvas.width / cols;
    const cellH = canvas.height / rows;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        // Individual photovoltaic cell highlight
        ctx.fillStyle = j % 2 === 0 ? "#0F274A" : "#0A1D3B";
        ctx.fillRect(i * cellW + 1.5, j * cellH + 1.5, cellW - 3, cellH - 3);

        // Grid border
        ctx.strokeRect(i * cellW, j * cellH, cellW, cellH);
      }
    }

    // Gold bus-bars down the middle
    ctx.fillStyle = "#F59E0B";
    ctx.fillRect(canvas.width / 2 - 2, 0, 4, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);
}

// ── Realistic BAS (Bharatiya Antariksh Station) Model Matching User Reference Image 2 ──
function BharatiyaSpaceStation({
  orbitRadius = 2.05,
  orbitSpeed = 0.38,
}: {
  orbitRadius?: number;
  orbitSpeed?: number;
}) {
  const stationRef = useRef<THREE.Group>(null!);
  const beaconRef = useRef<THREE.PointLight>(null!);
  const decalTex = useBasDecal();
  const solarTex = useSolarPanelTexture();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * orbitSpeed;

    // Smooth inclined orbit around Earth
    const x = Math.cos(t) * orbitRadius;
    const z = Math.sin(t) * orbitRadius;
    const y = Math.sin(t * 1.2) * 0.65;

    stationRef.current.position.set(x, y, z);

    // Station points along flight trajectory with subtle roll
    stationRef.current.rotation.y = -t + Math.PI / 2;
    stationRef.current.rotation.x = Math.sin(t * 0.7) * 0.25;

    // Beacon blink
    if (beaconRef.current) {
      beaconRef.current.intensity = Math.sin(clock.getElapsedTime() * 8) > 0.3 ? 2.5 : 0.2;
    }
  });

  // Reusable Single Solar Wing Pair (One top, one bottom)
  const SolarWingPair = ({ xPos }: { xPos: number }) => (
    <group position={[xPos, 0, 0]}>
      {/* Upper Mounting Boom / Mast */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.24, 8]} />
        <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.9} />
      </mesh>

      {/* Top Solar Wing */}
      <mesh position={[0, 0.52, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.006, 0.42, 0.16]} />
        <meshStandardMaterial
          map={solarTex}
          roughness={0.2}
          metalness={0.85}
          emissive="#1E3A8A"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Lower Mounting Boom / Mast */}
      <mesh position={[0, -0.28, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.24, 8]} />
        <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.9} />
      </mesh>

      {/* Bottom Solar Wing */}
      <mesh position={[0, -0.52, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.006, 0.42, 0.16]} />
        <meshStandardMaterial
          map={solarTex}
          roughness={0.2}
          metalness={0.85}
          emissive="#1E3A8A"
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );

  return (
    <group ref={stationRef} scale={[1.4, 1.4, 1.4]}>
      {/* ── 3 Main White Pressurized Modules (Tandem Configuration as in Image 2) ── */}

      {/* Module 1: Forward Habitation Module with Hatch */}
      <group position={[-0.38, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.26, 32]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.4} />
        </mesh>
        {/* Module nose cone / forward docking port */}
        <mesh position={[-0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.09, 0.06, 32]} />
          <meshStandardMaterial color="#F1F5F9" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Forward circular docking ring */}
        <mesh position={[-0.19, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.045, 0.012, 16, 24]} />
          <meshStandardMaterial color="#0284C7" emissive="#0369A1" emissiveIntensity={0.5} roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Indian Flag & BAS Decal */}
        <mesh position={[0, 0, 0.092]}>
          <planeGeometry args={[0.2, 0.1]} />
          <meshBasicMaterial map={decalTex} transparent />
        </mesh>
      </group>

      {/* Inter-Module Collar 1 */}
      <mesh position={[-0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.045, 0.045, 0.08, 24]} />
        <meshStandardMaterial color="#94A3B8" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Module 2: Core Laboratory & Command Module */}
      <group position={[0, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.092, 0.092, 0.28, 32]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.4} />
        </mesh>
        {/* Indian Flag & BAS Decal */}
        <mesh position={[0, 0, 0.094]}>
          <planeGeometry args={[0.2, 0.1]} />
          <meshBasicMaterial map={decalTex} transparent />
        </mesh>
        {/* Observation Cupola Dome */}
        <mesh position={[0, 0.095, 0]}>
          <sphereGeometry args={[0.035, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#38BDF8" emissive="#0284C7" emissiveIntensity={0.8} roughness={0.1} metalness={0.9} />
        </mesh>
      </group>

      {/* Inter-Module Collar 2 */}
      <mesh position={[0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.045, 0.045, 0.08, 24]} />
        <meshStandardMaterial color="#94A3B8" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Module 3: Aft Service / Utility Module */}
      <group position={[0.38, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.26, 32]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.4} />
        </mesh>
        {/* Indian Flag & BAS Decal */}
        <mesh position={[0, 0, 0.092]}>
          <planeGeometry args={[0.2, 0.1]} />
          <meshBasicMaterial map={decalTex} transparent />
        </mesh>
      </group>

      {/* ── Aft Propulsion & Thruster Section (Gold Thermal Kapton Foil) ── */}
      <group position={[0.56, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.075, 0.085, 0.12, 24]} />
          <meshStandardMaterial
            color="#D97706"
            emissive="#B45309"
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.95}
          />
        </mesh>
        {/* Main Rocket Nozzle */}
        <mesh position={[0.08, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.045, 0.05, 16, 1, true]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.95} side={THREE.DoubleSide} />
        </mesh>
        {/* 4 Small Cross-Vane Radiators */}
        {[0, 90, 180, 270].map((deg) => (
          <group key={deg} rotation={[(deg * Math.PI) / 180, 0, 0]}>
            <mesh position={[0.04, 0.1, 0]}>
              <boxGeometry args={[0.06, 0.06, 0.005]} />
              <meshStandardMaterial color="#78350F" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── 3 Pairs of Tall Vertical Solar Array Wings (Matching Image 2) ── */}
      <SolarWingPair xPos={-0.38} />
      <SolarWingPair xPos={0} />
      <SolarWingPair xPos={0.38} />

      {/* Navigation Strobe Beacon */}
      <pointLight ref={beaconRef} color="#38BDF8" distance={1.2} intensity={2.5} />
      <mesh position={[0, 0.14, 0]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshBasicMaterial color="#38BDF8" />
      </mesh>

      {/* Red & Green Wingtip Beacons */}
      <mesh position={[0, 0.74, 0]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshBasicMaterial color="#10B981" />
      </mesh>
      <mesh position={[0, -0.74, 0]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>
    </group>
  );
}

// ── Realistic The Moon (Matching Lower-Right of User Reference Image 1) ──
function EarthMoon({ texture }: { texture: THREE.Texture }) {
  const moonRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    // Gentle lunar orbit and tidal lock
    const t = clock.getElapsedTime() * 0.12;
    moonRef.current.position.set(
      2.5 + Math.cos(t) * 0.2,
      -1.15 + Math.sin(t * 0.8) * 0.15,
      -0.6 + Math.sin(t) * 0.3
    );
    moonRef.current.rotation.y = t;
  });

  return (
    <mesh ref={moonRef} scale={[0.22, 0.22, 0.22]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.85}
        metalness={0.05}
      />
    </mesh>
  );
}

// ── Photorealistic Blue Marble Earth Globe (Matching User Reference Image 1) ──
function PhotorealisticEarth({
  earthMap,
  cloudsMap,
}: {
  earthMap: THREE.Texture;
  cloudsMap: THREE.Texture;
}) {
  const earthRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Real Earth axial rotation
    earthRef.current.rotation.y = t * 0.08;
    // Atmosphere and cloud rotation
    cloudsRef.current.rotation.y = t * 0.105;
  });

  return (
    <group rotation={[0.41, 0, -0.06]}>
      {/* ── 1. The Blue Marble Solid Planet Surface ── */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1.25, 64, 64]} />
        <meshStandardMaterial
          map={earthMap}
          roughness={0.45}
          metalness={0.12}
        />
      </mesh>

      {/* ── 2. Swirling Atmospheric Cloud Layer ── */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.272, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.52}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ── 3. Rayleigh Scattering Horizon Atmosphere Halo (Brilliant Sky Blue) ── */}
      <mesh>
        <sphereGeometry args={[1.315, 48, 48]} />
        <meshBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.24}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.365, 36, 36]} />
        <meshBasicMaterial
          color="#60A5FA"
          transparent
          opacity={0.14}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// ── Complete Interactive Space Scene ──
function Scene({ pointer }: { pointer: { x: number; y: number } }) {
  const sceneRef = useRef<THREE.Group>(null!);
  const targetRotation = useRef({ x: 0, y: 0 });

  // Load Authentic 2K NASA Blue Marble Earth Textures from public folder
  const [earthMap, cloudsMap, moonMap] = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const e = loader.load("/images/earth_atmos_2048.jpg");
    const c = loader.load("/images/earth_clouds_1024.png");
    const m = loader.load("/images/moon_1024.jpg");
    return [e, c, m];
  }, []);

  useFrame(() => {
    // Parallax mouse tilt
    targetRotation.current.x += (pointer.y * 0.3 - targetRotation.current.x) * 0.05;
    targetRotation.current.y += (pointer.x * 0.45 - targetRotation.current.y) * 0.05;

    sceneRef.current.rotation.x = targetRotation.current.x;
    sceneRef.current.rotation.y = targetRotation.current.y;
  });

  return (
    <group ref={sceneRef}>
      <Float speed={0.9} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* Photorealistic Blue Marble Earth */}
        <PhotorealisticEarth earthMap={earthMap} cloudsMap={cloudsMap} />

        {/* The Moon (lower-right as in Reference Image 1) */}
        <EarthMoon texture={moonMap} />

        {/* Orbiting Bharatiya Antariksh Station (ISRO Space Station as in Reference Image 2) */}
        <BharatiyaSpaceStation orbitRadius={2.05} orbitSpeed={0.38} />

        {/* Faint Glowing Orbital Track */}
        <group rotation={[0.45, 0, 0.2]}>
          <mesh>
            <torusGeometry args={[2.05, 0.005, 16, 120]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.25} />
          </mesh>
        </group>
      </Float>

      {/* Cosmic Deep Space Stars & Sparkles */}
      <Sparkles count={90} scale={7} size={2.5} speed={0.2} opacity={0.85} color="#FFFFFF" />
      <Sparkles count={40} scale={6} size={3.0} speed={0.3} opacity={0.65} color="#38BDF8" />
    </group>
  );
}

// ── Static Fallback for Low-End Devices or No WebGL ──
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
      aria-label="Photorealistic 3D Earth Globe with Orbiting Bharatiya Space Station"
    >
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        {/* ── Space Sunlight & Atmospheric Illumination ── */}
        <ambientLight intensity={0.6} />

        {/* Primary Sun Light (Direct White Sunlight from upper right) */}
        <directionalLight position={[5, 4, 4.5]} intensity={4.5} color="#FFFDF5" />

        {/* Earth Horizon Specular Glint */}
        <pointLight position={[3, 3.5, 3]} intensity={2.8} color="#E0F2FE" />

        {/* Deep Space Blue Rim Backlight */}
        <directionalLight position={[-5, -2, -3]} intensity={1.5} color="#0284C7" />

        <Suspense fallback={null}>
          <Scene pointer={pointer} />
        </Suspense>
      </Canvas>
    </div>
  );
}
