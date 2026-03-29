"use client";

import { Suspense } from "react";
import { Canvas as R3FCanvas } from "@react-three/fiber";

type CanvasProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Canvas({ children, className }: CanvasProps) {
  return (
    <div className={className}>
      <R3FCanvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </R3FCanvas>
    </div>
  );
}
