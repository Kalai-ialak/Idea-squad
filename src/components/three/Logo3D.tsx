"use client";

import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURABLE 3D LOGO CONSTANTS (Tweak all logo styles and physics here)
// ─────────────────────────────────────────────────────────────────────────────
export const LOGO_COLORS = {
  chrome: "#F5F5F7",       // Polished chrome metal for "IDE" & "SQUAD"
  crimson: "#E11D48",      // Vibrant crimson for right brain lobe & accents
  maroon: "#7A1F33",       // Deep maroon for left brain lobe & diagonal cuts
  bulbGlass: "#FFFFFF",    // Transmissive glass for bulb contour
  rimPurple: "#7C3AED",    // Left rim light accent
  rimCrimson: "#E11D48",   // Right rim light accent
  keyLight: "#FFFFFF",     // Soft front key light
  backLight: "#FFA500",    // Warm backlight for edge definition
  shadowColor: "#4A0E17",  // Contact shadow color tint
};

export const LOGO_SETTINGS = {
  // Extrusion Depths
  mainDepth: 14,           // Depth for "IDE", "SQUAD", bulb & brain
  agencyDepth: 4,          // Flatter depth for "AGENCY" & side rules (keeps it crisp)
  bevelThickness: 2,       // Bevel depth
  bevelSize: 1.4,          // Bevel spread
  bevelSegments: 6,        // Smoothness of bevel
  curveSegments: 24,       // Curvature curve fidelity

  // Z-Layering Separation (depth layering for 3D realism)
  zBulbOffset: 4.0,        // Outer bulb glass forward
  zBrainOffset: 2.0,       // Glowing brain middle
  zAccentsOffset: 0.6,     // Crimson/maroon accent cuts slightly forward to prevent z-fighting
  zMainTextOffset: 0.0,    // IDE & SQUAD base
  zAgencyOffset: 0.0,      // AGENCY and rule lines

  // Physics & Animation
  maxTiltDeg: 14,          // Maximum pointer follow tilt in degrees
  maxSwayDeg: 15,          // Maximum idle sway rotation in degrees
  floatSpeed: 1.2,         // Speed of floating bob
  floatHeight: 0.12,       // Height of floating bob
  swaySpeed: 0.75,         // Speed of gentle idle sway
  hoverScale: 1.04,        // Scale-up multiplier on hover

  // Brain Glow Intensity Pulse
  brainGlowMin: 0.6,       // Minimum emissive glow intensity
  brainGlowMax: 1.4,       // Maximum emissive glow intensity
  brainPulseSpeed: 2.5,    // Pulsing rhythm speed
};

export interface Logo3DProps {
  size?: "md" | "lg" | "hero";
  interactive?: boolean;
  className?: string;
}

interface MeshItem {
  id: string;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  zOffset: number;
}

function Logo3DScene({
  size = "hero",
  interactive = true,
  isHovered = false,
}: {
  size: "md" | "lg" | "hero";
  interactive: boolean;
  isHovered: boolean;
}) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const tiltGroupRef = useRef<THREE.Group>(null);
  const floatGroupRef = useRef<THREE.Group>(null);
  const brainMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const sweepLightRef = useRef<THREE.PointLight>(null);

  const [svgText, setSvgText] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // Fetch SVG text once
  useEffect(() => {
    let active = true;
    fetch("/images/idea-squad-logo.svg")
      .then((res) => res.text())
      .then((text) => {
        if (active) setSvgText(text);
      })
      .catch((err) => console.error("Error loading logo SVG:", err));
    return () => {
      active = false;
    };
  }, []);

  // Responsive scale in 3D scene (comfortable margins, no clipping at any aspect ratio)
  const baseScale =
    size === "hero" ? 0.0058 : size === "lg" ? 0.0055 : 0.0045;

  const mainExtrudeSettings: THREE.ExtrudeGeometryOptions = useMemo(
    () => ({
      depth: LOGO_SETTINGS.mainDepth,
      bevelEnabled: true,
      bevelSegments: LOGO_SETTINGS.bevelSegments,
      bevelSize: LOGO_SETTINGS.bevelSize,
      bevelThickness: LOGO_SETTINGS.bevelThickness,
      curveSegments: LOGO_SETTINGS.curveSegments,
    }),
    []
  );

  const agencyExtrudeSettings: THREE.ExtrudeGeometryOptions = useMemo(
    () => ({
      depth: LOGO_SETTINGS.agencyDepth,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.5,
      bevelThickness: 0.8,
      curveSegments: LOGO_SETTINGS.curveSegments,
    }),
    []
  );

  // Create geometries and materials from parsed SVG
  const { meshItems, allGeometries, allMaterials } = useMemo(() => {
    if (!svgText) {
      return { meshItems: [], allGeometries: [], allMaterials: [] };
    }

    const loader = new SVGLoader();
    const data = loader.parse(svgText);

    // 1. Polished Chrome / White Metal Material for "IDE" & "SQUAD"
    const chromeMat = new THREE.MeshPhysicalMaterial({
      color: LOGO_COLORS.chrome,
      metalness: 1.0,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.4,
      side: THREE.DoubleSide,
    });

    // 2. Glossy Glass-like Crimson Material
    const crimsonMat = new THREE.MeshPhysicalMaterial({
      color: LOGO_COLORS.crimson,
      metalness: 0.1,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transmission: 0.25,
      ior: 1.5,
      emissive: LOGO_COLORS.crimson,
      emissiveIntensity: 0.25,
      side: THREE.DoubleSide,
    });

    // 3. Glossy Glass-like Maroon Material
    const maroonMat = new THREE.MeshPhysicalMaterial({
      color: LOGO_COLORS.maroon,
      metalness: 0.1,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transmission: 0.25,
      ior: 1.5,
      emissive: LOGO_COLORS.crimson,
      emissiveIntensity: 0.15,
      side: THREE.DoubleSide,
    });

    // 4. Transmissive Glass for Outer Bulb Outline
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: LOGO_COLORS.bulbGlass,
      transmission: 1.0,
      roughness: 0.08,
      ior: 1.45,
      thickness: 3.0,
      transparent: true,
      opacity: 0.95,
      iridescence: 0.3,
      iridescenceIOR: 1.3,
      side: THREE.DoubleSide,
    });

    // 5. Brain Material with soft pulsing crimson glow
    const brainMat = new THREE.MeshPhysicalMaterial({
      color: LOGO_COLORS.crimson,
      metalness: 0.1,
      roughness: 0.15,
      clearcoat: 1.0,
      emissive: LOGO_COLORS.crimson,
      emissiveIntensity: LOGO_SETTINGS.brainGlowMin,
      side: THREE.DoubleSide,
    });
    brainMaterialRef.current = brainMat;

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [
      chromeMat,
      crimsonMat,
      maroonMat,
      glassMat,
      brainMat,
    ];
    const items: MeshItem[] = [];

    data.paths.forEach((path, pathIdx) => {
      const userData = path.userData as { node?: SVGElement } | undefined;
      const nodeId = userData?.node?.id || userData?.node?.getAttribute?.("id") || "";

      let mat: THREE.Material = chromeMat;
      let defaultZ = LOGO_SETTINGS.zMainTextOffset;

      if (nodeId.startsWith("bulb-outline")) {
        mat = glassMat;
        defaultZ = LOGO_SETTINGS.zBulbOffset;
      } else if (nodeId.startsWith("brain")) {
        mat = brainMat;
        defaultZ = LOGO_SETTINGS.zBrainOffset;
      } else if (nodeId === "accents-crimson") {
        mat = crimsonMat;
        defaultZ = LOGO_SETTINGS.zAccentsOffset;
      } else if (nodeId === "accents-maroon") {
        mat = maroonMat;
        defaultZ = LOGO_SETTINGS.zAccentsOffset;
      } else {
        mat = chromeMat;
        defaultZ = LOGO_SETTINGS.zMainTextOffset;
      }

      const shapes = SVGLoader.createShapes(path);
      shapes.forEach((shape, shapeIdx) => {
        // Inspect shape bounding box to distinguish AGENCY & side lines (Y > 500)
        const pts = shape.getPoints();
        const minY = pts.length > 0 ? Math.min(...pts.map((p) => p.y)) : 0;
        const isAgencyLine = minY > 500;

        const extrudeConfig = isAgencyLine ? agencyExtrudeSettings : mainExtrudeSettings;
        const geom = new THREE.ExtrudeGeometry(shape, extrudeConfig);
        geometries.push(geom);

        items.push({
          id: `${nodeId || "path"}-${pathIdx}-${shapeIdx}`,
          geometry: geom,
          material: mat,
          zOffset: isAgencyLine ? LOGO_SETTINGS.zAgencyOffset : defaultZ,
        });
      });
    });

    return {
      meshItems: items,
      allGeometries: geometries,
      allMaterials: materials,
    };
  }, [svgText, mainExtrudeSettings, agencyExtrudeSettings]);

  // Dispose geometries and materials on unmount
  useEffect(() => {
    return () => {
      allGeometries.forEach((g) => g.dispose());
      allMaterials.forEach((m) => m.dispose());
    };
  }, [allGeometries, allMaterials]);

  // Animation frame loop
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // 1. Intro Animation (0 to 1.2s: scale 0.85 -> 1.0, light sweep across logo)
    const introProgress = Math.min(1, t / 1.2);
    const easeOutCubic = 1 - Math.pow(1 - introProgress, 3);
    const introScale = reducedMotion ? 1 : 0.85 + 0.15 * easeOutCubic;

    // Hover scale multiplier (smooth dampening)
    const targetHoverScale = isHovered && interactive ? LOGO_SETTINGS.hoverScale : 1.0;

    if (rootGroupRef.current) {
      const currentScale = rootGroupRef.current.scale.x;
      const desiredScale = baseScale * introScale * targetHoverScale;
      rootGroupRef.current.scale.setScalar(
        THREE.MathUtils.damp(currentScale, desiredScale, 6, delta)
      );
    }

    // Intro Light Sweep
    if (sweepLightRef.current && !reducedMotion) {
      if (t < 2.0) {
        sweepLightRef.current.position.x = -8 + (t / 2.0) * 16;
        sweepLightRef.current.intensity = Math.sin((t / 2.0) * Math.PI) * 20;
      } else {
        sweepLightRef.current.intensity = 0;
      }
    }

    // 2. Pulsing crimson emissive glow for brain
    if (brainMaterialRef.current && !reducedMotion) {
      const pulseRange = LOGO_SETTINGS.brainGlowMax - LOGO_SETTINGS.brainGlowMin;
      const pulse = Math.sin(t * LOGO_SETTINGS.brainPulseSpeed) * 0.5 + 0.5;
      brainMaterialRef.current.emissiveIntensity =
        LOGO_SETTINGS.brainGlowMin + pulse * pulseRange;
    }

    // 3. Slow idle float and gentle rotation sway (max 15 deg)
    if (floatGroupRef.current && !reducedMotion) {
      floatGroupRef.current.position.y =
        Math.sin(t * LOGO_SETTINGS.floatSpeed) * LOGO_SETTINGS.floatHeight;
      floatGroupRef.current.rotation.y =
        Math.sin(t * LOGO_SETTINGS.swaySpeed) *
        THREE.MathUtils.degToRad(LOGO_SETTINGS.maxSwayDeg);
    }

    // 4. Gentle mouse tilt (max 14 degrees) damped with MathUtils.damp
    if (tiltGroupRef.current) {
      if (interactive && !reducedMotion) {
        const maxTiltRad = THREE.MathUtils.degToRad(LOGO_SETTINGS.maxTiltDeg);
        const targetX = -state.pointer.y * maxTiltRad;
        const targetY = state.pointer.x * maxTiltRad;
        tiltGroupRef.current.rotation.x = THREE.MathUtils.damp(
          tiltGroupRef.current.rotation.x,
          targetX,
          4,
          delta
        );
        tiltGroupRef.current.rotation.y = THREE.MathUtils.damp(
          tiltGroupRef.current.rotation.y,
          targetY,
          4,
          delta
        );
      } else {
        tiltGroupRef.current.rotation.x = THREE.MathUtils.damp(
          tiltGroupRef.current.rotation.x,
          0,
          4,
          delta
        );
        tiltGroupRef.current.rotation.y = THREE.MathUtils.damp(
          tiltGroupRef.current.rotation.y,
          0,
          4,
          delta
        );
      }
    }
  });

  return (
    <>
      {/* Studio / City Reflection Environment for Chrome & Glass */}
      <Environment preset="city" />

      {/* Lighting setup */}
      <ambientLight intensity={0.7} />

      {/* Soft key light */}
      <directionalLight
        position={[3, 6, 7]}
        intensity={1.8}
        color={LOGO_COLORS.keyLight}
      />

      {/* Warm backlight for edge definition */}
      <directionalLight
        position={[0, -3, -6]}
        intensity={1.4}
        color={LOGO_COLORS.backLight}
      />

      {/* Purple rim light from left */}
      <pointLight
        position={[-8, 2, 4]}
        intensity={24}
        color={LOGO_COLORS.rimPurple}
        distance={25}
      />

      {/* Crimson rim light from right */}
      <pointLight
        position={[8, -2, 4]}
        intensity={24}
        color={LOGO_COLORS.rimCrimson}
        distance={25}
      />

      {/* Intro Light Sweep across chrome */}
      <pointLight
        ref={sweepLightRef}
        position={[-8, 1, 3]}
        intensity={0}
        color="#FFFFFF"
        distance={15}
      />

      {/* 3D Model Hierarchy */}
      <group ref={tiltGroupRef}>
        <group ref={floatGroupRef}>
          {/* Centering offset: SVG is 914 x 559, center at (457, 279.5), depth 14 centered at z -7 */}
          <group ref={rootGroupRef} scale={[baseScale, baseScale, baseScale]}>
            <group position={[-457, 279.5, -7]} scale={[1, -1, 1]}>
              {meshItems.map((item) => (
                <mesh
                  key={item.id}
                  position={[0, 0, item.zOffset]}
                  geometry={item.geometry}
                  material={item.material}
                  castShadow
                  receiveShadow
                />
              ))}
            </group>
          </group>

          {/* Soft contact shadow underneath logo */}
          <ContactShadows
            position={[0, -1.9, 0]}
            opacity={0.45}
            scale={7.5}
            blur={2.4}
            far={4}
            color={LOGO_COLORS.shadowColor}
          />
        </group>
      </group>

      {/* Subtle floating particles (max 60 total, very subtle) */}
      <Sparkles
        count={35}
        scale={6.5}
        size={2.2}
        speed={0.25}
        opacity={0.65}
        color={LOGO_COLORS.rimCrimson}
      />
      <Sparkles
        count={25}
        scale={6.5}
        size={2.0}
        speed={0.2}
        opacity={0.55}
        color={LOGO_COLORS.rimPurple}
      />
    </>
  );
}

export default function Logo3D({
  size = "hero",
  interactive = true,
  className = "",
}: Logo3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Pause rendering when hero is not in view (saving CPU / GPU)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { rootMargin: "150px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const containerHeight =
    size === "hero"
      ? "h-[380px] sm:h-[440px] lg:h-[500px]"
      : size === "lg"
      ? "h-[280px] sm:h-[340px]"
      : "h-[160px] sm:h-[200px]";

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full ${containerHeight} flex items-center justify-center select-none ${className}`}
      style={{ touchAction: "none" }}
    >
      {/* Soft radial crimson/purple glow behind canvas */}
      <div
        className="absolute inset-0 rounded-full opacity-40 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(225,29,72,0.18) 0%, rgba(124,58,237,0.14) 45%, transparent 70%)",
          transform: "scale(0.85)",
        }}
        aria-hidden="true"
      />

      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <Image
              src="/images/idea-squad-logo.svg"
              alt="Idea Squad Agency Logo"
              width={420}
              height={260}
              className="h-full w-auto object-contain opacity-70 animate-pulse"
              priority
            />
          </div>
        }
      >
        <Canvas
          frameloop={inView ? "always" : "never"}
          camera={{ position: [0, 0, 8.2], fov: 40 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          }}
          dpr={[1, 2]}
          className="w-full h-full bg-transparent"
        >
          <Logo3DScene
            size={size}
            interactive={interactive}
            isHovered={isHovered}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
