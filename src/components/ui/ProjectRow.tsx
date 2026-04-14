"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ProjectRowProps = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  index: number;
};

export default function ProjectRow({
  slug,
  title,
  description,
  tags,
  date,
  index,
}: ProjectRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const lineTopRef = useRef<HTMLDivElement>(null);
  const lineBottomRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  const year = date.slice(0, 4);

  // Set initial inline color so GSAP doesn't flicker on first hover
  useEffect(() => {
    if (titleRef.current) {
      gsap.set(titleRef.current, { color: "rgba(255,255,255,0.85)" });
    }
  }, []);

  // Scroll entrance animation
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: row,
        start: "top 90%",
        toggleActions: "play none none none",
      },
    });

    tl.fromTo(tagsRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      0
    );
    tl.fromTo(titleRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      0.1
    );
    tl.fromTo(descRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      0.2
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  const handleEnter = () => {
    const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power3.out" } });
    tl.to(titleRef.current, { x: 16, skewX: -1, color: "#ffffff" }, 0);
    tl.to(bgRef.current, { backgroundColor: "rgb(10,10,10)" }, 0);
    tl.to(lineTopRef.current, { scaleX: 1 }, 0);
    tl.to(lineBottomRef.current, { scaleX: 1 }, 0);
  };

  const handleLeave = () => {
    const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power3.out" } });
    tl.to(titleRef.current, { x: 0, skewX: 0, color: "rgba(255,255,255,0.85)" }, 0);
    tl.to(bgRef.current, { backgroundColor: "rgb(6,6,6)" }, 0);
    tl.to(lineTopRef.current, { scaleX: 0 }, 0);
    tl.to(lineBottomRef.current, { scaleX: 0 }, 0);
  };

  return (
    <Link
      href={`/projects/${slug}`}
      className="block group"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div
        ref={(el) => { bgRef.current = el; rowRef.current = el; }}
        className="relative py-10 md:py-14 px-8 md:px-16 bg-[rgb(6,6,6)]"
      >
        {/* Top border line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.06]">
          <div
            ref={lineTopRef}
            className="absolute inset-0 bg-white/30 origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        {/* Bottom border line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.06]">
          <div
            ref={lineBottomRef}
            className="absolute inset-0 bg-white/30 origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        {/* Tags + year */}
        <div ref={tagsRef} className="flex items-center gap-3 mb-4" style={{ opacity: 0 }}>
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] uppercase tracking-[0.15em] text-white/30"
            >
              {tag}
            </span>
          ))}
          <span className="text-[10px] uppercase tracking-[0.15em] text-white/30 font-display italic">
            {year}
          </span>
        </div>

        {/* Title */}
        <h3
          ref={titleRef}
          className="font-display text-4xl md:text-5xl lg:text-7xl tracking-tighter leading-[0.85] transition-none mb-4"
          style={{ opacity: 0, willChange: "transform" }}
        >
          {title}
        </h3>

        {/* Description */}
        <p ref={descRef} className="text-sm md:text-base text-white/40 max-w-xl leading-relaxed" style={{ opacity: 0 }}>
          {description}
        </p>
      </div>
    </Link>
  );
}
