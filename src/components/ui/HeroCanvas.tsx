"use client";

import dynamic from "next/dynamic";
import { Canvas as R3FCanvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const HeroScene = dynamic(
  () => import("@/components/canvas/sketches/HeroScene"),
  { ssr: false }
);

const HIDDEN_ON = ["/projects/", "/photography/"];

export default function HeroCanvas() {
  const pathname = usePathname();
  const hidden = HIDDEN_ON.some((prefix) => pathname.startsWith(prefix));

  const [isTouch, setIsTouch] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    setIsTouch(
      "ontouchstart" in window || navigator.maxTouchPoints > 0
    );
  }, []);

  // Pause rAF when no [data-canvas-show] section is on screen.
  // Pages without those markers (e.g. /about) keep the canvas always-on.
  useEffect(() => {
    if (hidden) return;
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-canvas-show]")
    );
    if (targets.length === 0) {
      setActive(true);
      return;
    }

    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        setActive(visible.size > 0);
      },
      { threshold: 0 }
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [pathname, hidden]);

  if (hidden) return null;

  return (
    <div className="fixed inset-0 z-0" style={{ pointerEvents: "none" }}>
      <R3FCanvas
        orthographic
        camera={{ zoom: 1, position: [0, 0, 1], near: 0.1, far: 10 }}
        dpr={isTouch ? [1, 1.25] : [1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        frameloop={active ? "always" : "never"}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </R3FCanvas>
    </div>
  );
}
