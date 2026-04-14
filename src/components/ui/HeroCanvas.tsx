"use client";

import dynamic from "next/dynamic";
import { Canvas as R3FCanvas } from "@react-three/fiber";
import { Suspense } from "react";

const HeroScene = dynamic(
  () => import("@/components/canvas/sketches/HeroScene"),
  { ssr: false }
);

export default function HeroCanvas() {
  return (
    <div className="fixed inset-0 z-0" style={{ pointerEvents: "none" }}>
      <R3FCanvas
        orthographic
        camera={{ zoom: 1, position: [0, 0, 1], near: 0.1, far: 10 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </R3FCanvas>
    </div>
  );
}
