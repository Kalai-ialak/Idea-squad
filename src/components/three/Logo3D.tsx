"use client";

import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────────────────
// LOGO COLOR CONSTANTS (Change logo colors in this single place)
// ─────────────────────────────────────────────────────────────────────────────
export const LOGO_COLORS = {
  chrome: "#F5F5F7",       // Polished chrome / white metal for "IDE", "SQUAD", "AGENCY"
  crimson: "#E11D48",      // Vibrant crimson accent for right brain, top of E, A, right line
  maroon: "#7A1F33",       // Rich maroon accent for left brain, cut on I & D, U, left line
  bulbGlass: "#FFFFFF",    // Transmissive glass outer bulb outline
  rimPurple: "#7C3AED",    // Left rim light accent
  rimCrimson: "#E11D48",   // Right rim light accent
  keyLight: "#FFFFFF",     // Soft key light
};

export interface Logo3DProps {
  size?: "md" | "lg";
  interactive?: boolean;
  className?: string;
}

interface MeshItem {
  id: string;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
}

function Logo3DScene({
  size = "md",
  interactive = true,
}: {
  size: "md" | "lg";
  interactive: boolean;
}) {
  const tiltGroupRef = useRef<THREE.Group>(null);
  const floatGroupRef = useRef<THREE.Group>(null);
  const brainMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);

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

  // Scale and sizing
  const scale = size === "lg" ? 0.0072 : 0.0052;
  const extrudeSettings: THREE.ExtrudeGeometryOptions = useMemo(
    () => ({
      depth: 12,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 1.2,
      bevelThickness: 1.2,
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

    // 1. Polished Chrome / White Metal Material
    const chromeMat = new THREE.MeshPhysicalMaterial({
      color: LOGO_COLORS.chrome,
      metalness: 1.0,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide,
    });

    // 2. Glossy Crimson Material
    const crimsonMat = new THREE.MeshPhysicalMaterial({
      color: LOGO_COLORS.crimson,
      metalness: 0.15,
      roughness: 0.2,
      transmission: 0.3,
      ior: 1.5,
      emissive: LOGO_COLORS.crimson,
      emissiveIntensity: 0.28,
      side: THREE.DoubleSide,
    });

    // 3. Glossy Maroon Material
    const maroonMat = new THREE.MeshPhysicalMaterial({
      color: LOGO_COLORS.maroon,
      metalness: 0.15,
      roughness: 0.2,
      transmission: 0.3,
      ior: 1.5,
      emissive: LOGO_COLORS.crimson,
      emissiveIntensity: 0.18,
      side: THREE.DoubleSide,
    });

    // 4. Transmissive Glass for Bulb Outline
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: LOGO_COLORS.bulbGlass,
      transmission: 0.88,
      roughness: 0.1,
      ior: 1.52,
      thickness: 2.0,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    });

    // 5. Brain Material with soft pulsing crimson glow
    const brainMat = new THREE.MeshPhysicalMaterial({
      color: LOGO_COLORS.crimson,
      metalness: 0.2,
      roughness: 0.2,
      transmission: 0.2,
      ior: 1.5,
      emissive: LOGO_COLORS.crimson,
      emissiveIntensity: 0.65,
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

      if (nodeId.startsWith("bulb-outline")) {
        mat = glassMat;
      } else if (nodeId.startsWith("brain")) {
        mat = brainMat;
      } else if (nodeId === "accents-crimson") {
        mat = crimsonMat;
      } else if (nodeId === "accents-maroon") {
        mat = maroonMat;
      } else {
        mat = chromeMat;
      }

      const shapes = SVGLoader.createShapes(path);
      shapes.forEach((shape, shapeIdx) => {
        const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geometries.push(geom);
        items.push({
          id: `${nodeId || "path"}-${pathIdx}-${shapeIdx}`,
          geometry: geom,
          material: mat,
        });
      });
    });

    return {
      meshItems: items,
      allGeometries: geometries,
      allMaterials: materials,
    };
  }, [svgText, extrudeSettings]);

  // Dispose geometries and materials on unmount
  useEffect(() => {
    return () => {
      allGeometries.forEach((g) => g.dispose());
      allMaterials.forEach((m) => m.dispose());
    };
  }, [allGeometries, allMaterials]);

  // Animation frame loop
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Pulsing crimson emissive glow for brain
    if (brainMaterialRef.current && !reducedMotion) {
      brainMaterialRef.current.emissiveIntensity =
        0.65 + Math.sin(t * 3.0) * 0.35;
    }

    // Slow idle float
    if (floatGroupRef.current && !reducedMotion) {
      floatGroupRef.current.position.y = Math.sin(t * 1.4) * 0.08;
      floatGroupRef.current.rotation.z = Math.sin(t * 0.7) * 0.012;
    }

    // Gentle mouse tilt (max 12 degrees = ~0.21 rad)
    if (tiltGroupRef.current) {
      if (interactive && !reducedMotion) {
        const targetX = -state.pointer.y * 0.209; // max 12 deg
        const targetY = state.pointer.x * 0.209;
        tiltGroupRef.current.rotation.x = THREE.MathUtils.lerp(
          tiltGroupRef.current.rotation.x,
          targetX,
          0.08
        );
        tiltGroupRef.current.rotation.y = THREE.MathUtils.lerp(
          tiltGroupRef.current.rotation.y,
          targetY,
          0.08
        );
      } else {
        tiltGroupRef.current.rotation.x = THREE.MathUtils.lerp(
          tiltGroupRef.current.rotation.x,
          0,
          0.05
        );
        tiltGroupRef.current.rotation.y = THREE.MathUtils.lerp(
          tiltGroupRef.current.rotation.y,
          0,
          0.05
        );
      }
    }
  });

  return (
    <>
      {/* Reflection Environment */}
      <Environment preset="city" />

      {/* Lighting setup */}
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[2, 6, 8]}
        intensity={1.8}
        color={LOGO_COLORS.keyLight}
      />
      {/* Purple rim light from left */}
      <pointLight
        position={[-8, 2, 5]}
        intensity={22}
        color={LOGO_COLORS.rimPurple}
        distance={25}
      />
      {/* Crimson rim light from right */}
      <pointLight
        position={[8, -2, 5]}
        intensity={22}
        color={LOGO_COLORS.rimCrimson}
        distance={25}
      />

      {/* 3D Model Hierarchy */}
      <group ref={tiltGroupRef}>
        <group ref={floatGroupRef}>
          {/* Centering offset: SVG is 914 x 559, center at (457, 279.5), depth 12 centered at z -6 */}
          <group
            position={[-457 * scale, 279.5 * scale, -6 * scale]}
            scale={[scale, -scale, scale]}
          >
            {meshItems.map((item) => (
              <mesh
                key={item.id}
                geometry={item.geometry}
                material={item.material}
                castShadow
                receiveShadow
              />
            ))}
          </group>
        </group>
      </group>
    </>
  );
}

export default function Logo3D({
  size = "md",
  interactive = true,
  className = "",
}: Logo3DProps) {
  const containerHeight =
    size === "lg" ? "h-[260px] sm:h-[320px]" : "h-[160px] sm:h-[200px]";

  return (
    <div
      className={`relative w-full ${containerHeight} flex items-center justify-center select-none ${className}`}
      style={{ touchAction: "none" }}
    >
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <Image
              src="/images/idea-squad-logo.svg"
              alt="Idea Squad Agency Logo"
              width={size === "lg" ? 400 : 260}
              height={size === "lg" ? 245 : 160}
              className="h-full w-auto object-contain opacity-70 animate-pulse"
              priority
            />
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0, 7.5], fov: 45 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          }}
          dpr={[1, 2]}
          className="w-full h-full bg-transparent"
        >
          <Logo3DScene size={size} interactive={interactive} />
        </Canvas>
      </Suspense>
    </div>
  );
}
