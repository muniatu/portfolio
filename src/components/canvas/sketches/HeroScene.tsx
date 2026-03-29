"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

export default function HeroScene() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshStandardMaterial
        color="#00ffbf"
        wireframe
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}
