"use client";

import dynamic from "next/dynamic";

const Canvas = dynamic(() => import("@/components/canvas/Canvas"), {
  ssr: false,
});

const HeroScene = dynamic(
  () => import("@/components/canvas/sketches/HeroScene"),
  { ssr: false }
);

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 -top-28 -z-10 h-[80vh]">
      <Canvas className="h-full w-full">
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <HeroScene />
      </Canvas>
    </div>
  );
}
