"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useDeviceCapability } from "@/lib/use-device-capability";

function IcosahedronWireframe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();
  const reducedMotion = useReducedMotion();

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2.2, 1);
    return new THREE.EdgesGeometry(geo);
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current || reducedMotion) return;

    // Slow organic rotation
    meshRef.current.rotation.y += delta * 0.08;
    meshRef.current.rotation.x += delta * 0.04;

    // Smooth mouse follow (tilt 2-3 degrees)
    const targetX = (mouseRef.current.y * Math.PI) / 60;
    const targetZ = (-mouseRef.current.x * Math.PI) / 60;
    meshRef.current.rotation.x +=
      (targetX - meshRef.current.rotation.x) * 0.02;
    meshRef.current.rotation.z +=
      (targetZ - meshRef.current.rotation.z) * 0.02;
  });

  // Track mouse position normalized to viewport
  useFrame(({ pointer }) => {
    mouseRef.current.x = pointer.x * (viewport.width / 2);
    mouseRef.current.y = pointer.y * (viewport.height / 2);
  });

  return (
    <lineSegments ref={meshRef as React.RefObject<THREE.Mesh>} geometry={geometry}>
      <lineBasicMaterial
        color="#5DCAA5"
        transparent
        opacity={0.18}
        linewidth={1}
      />
    </lineSegments>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <IcosahedronWireframe />
    </>
  );
}

// CSS fallback for low-end devices
function CSSFallback() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(93, 202, 165, 0.08) 0%, transparent 70%)",
      }}
    />
  );
}

export default function HeroMesh() {
  const capability = useDeviceCapability();

  if (capability === "low") {
    return <CSSFallback />;
  }

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
