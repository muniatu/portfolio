"use client";

import { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Photo = {
  src: string;
  alt: string;
};

type PhotoReelProps = {
  photos: Photo[];
  maxPhotos?: number;
};

function sCurve(t: number): { x: number; y: number } {
  const x = t;
  const s = 1 / (1 + Math.exp(-8 * (t - 0.5)));
  const y = 0.15 + s * 0.55;
  return { x, y };
}

export default function PhotoReel({ photos, maxPhotos = 20 }: PhotoReelProps) {
  const containerRef = useRef<HTMLElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  const reelPhotos = photos.slice(0, maxPhotos);
  const photoCount = reelPhotos.length;

  const updatePhotos = useCallback(() => {
    const container = photosRef.current;
    if (!container) return;

    const children = container.children;
    const progress = progressRef.current;

    for (let i = 0; i < children.length; i++) {
      const el = children[i] as HTMLElement;

      // All photos start well off-screen right
      const spread = 2.5;
      const spacing = spread / photoCount;
      const startOffset = 1.5; // far enough off-screen that nothing is visible at progress=0
      const lastPhotoStart = startOffset + (photoCount - 1) * spacing;
      const totalTravel = lastPhotoStart - 0.5;
      let t = startOffset + i * spacing - progress * totalTravel;

      const isVisible = t > -0.5 && t < 3;

      if (!isVisible) {
        el.style.display = "none";
        continue;
      }

      el.style.display = "";

      // Distance from center (0 = center, 0.5+ = edge)
      const centerDist = Math.abs(t - 0.5);

      // Smooth weight: 1 at center, 0 at edges — using smoothstep
      const edge = 0.6;
      const weight = centerDist >= edge ? 0 : Math.pow(1 - centerDist / edge, 2);

      // Scale: 1x at edge → 4x at center
      const scale = 1 + weight * 3;

      // Spacing: photos near center spread apart, edges stay tight
      // weight is high near center, so multiply the offset by weight
      const offset = t - 0.5;
      const adjustedT = t + offset * weight * 0.8;

      const pos = sCurve(adjustedT);

      // Portrait 2:3 — smaller on mobile
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      const baseW = isMobile ? 55 : 100;
      const w = baseW * scale;
      const h = w * 1.5;

      const rotateY = (t - 0.5) * -15;
      const rotateZ = Math.sin(t * Math.PI * 2 + i * 0.7) * 3;
      const rotateX = Math.cos(t * Math.PI + i * 0.3) * 2;
      const z = Math.round(weight * 100);
      const opacity = 1;

      el.style.left = `${pos.x * 100}%`;
      el.style.top = `${pos.y * 100}%`;
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      el.style.transform = `translate(-50%,-50%) perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg)`;
      el.style.zIndex = `${z}`;
      el.style.opacity = `${opacity}`;
    }
  }, [photoCount]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.8,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        updatePhotos();
      },
    });

    updatePhotos();

    // Text entrance — triggers when section pins
    if (textRef.current) {
      const children = textRef.current.children;
      gsap.set(children, { opacity: 0, y: 40 });
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        onEnter: () => {
          gsap.to(children, {
            opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
            stagger: 0.15,
          });
        },
        once: true,
      });
    }

    return () => {
      trigger.kill();
    };
  }, [updatePhotos]);

  return (
    <section
      ref={containerRef}
      className="relative bg-[rgb(6,6,6)]"
      style={{ height: "300vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div ref={textRef} className="absolute bottom-8 md:bottom-16 left-6 md:left-16 z-20 right-6 md:right-auto">
          <h2 className="font-display text-[clamp(2rem,11.5vw,7rem)] tracking-tighter leading-[0.85] mb-4 md:mb-6 w-full" style={{ opacity: 0 }}>
            My life journey<br /><span className="italic">through a lens</span>
          </h2>
          <p className="text-white/30 text-xs md:text-sm leading-relaxed mb-6" style={{ opacity: 0 }}>
            I love photography and never leave the house without a camera. It helps me see the world from a different perspective.
          </p>
          <Link
            href="/photography"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors duration-300"
            style={{ opacity: 0 }}
          >
            View archive
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div ref={photosRef} className="absolute inset-0">
          {reelPhotos.map((photo, i) => (
            <div
              key={`${photo.src}-${i}`}
              className="absolute shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
              style={{ display: "none", willChange: "transform" }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="200px"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
