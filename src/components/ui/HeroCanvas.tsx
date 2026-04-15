"use client";

import dynamic from "next/dynamic";
import { Canvas as R3FCanvas } from "@react-three/fiber";
import { Suspense } from "react";
import { usePathname } from "next/navigation";

const HeroScene = dynamic(
  () => import("@/components/canvas/sketches/HeroScene"),
  { ssr: false }
);

const HIDDEN_ON = ["/projects/", "/photography/"];

export default function HeroCanvas() {
  const pathname = usePathname();
  const hidden = HIDDEN_ON.some((prefix) => pathname.startsWith(prefix));

  if (hidden) return null;

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
