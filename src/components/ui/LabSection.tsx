"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Tool } from "@/lib/tools";

gsap.registerPlugin(ScrollTrigger);

type LabSectionProps = {
  tools: Tool[];
  totalCount: number;
};

export default function LabSection({ tools, totalCount }: LabSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 70%" },
      });

      if (eyebrowRef.current) {
        tl.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          0,
        );
      }
      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          0.1,
        );
      }
      if (descRef.current) {
        tl.fromTo(
          descRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          0.2,
        );
      }
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        tl.fromTo(
          el,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          0.35 + i * 0.1,
        );
      });
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          0.55,
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  if (tools.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative bg-[var(--color-background)] px-8 md:px-16 py-24 md:py-32"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 md:mb-16">
          <span
            ref={eyebrowRef}
            className="inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] bg-white/5 border border-white/10 text-white/50"
            style={{ opacity: 0 }}
          >
            Lab
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-20">
          <h2
            ref={titleRef}
            className="font-display text-[clamp(2rem,9vw,7rem)] tracking-tighter leading-[0.85] max-w-3xl"
            style={{ opacity: 0 }}
          >
            Tools &amp; <span className="italic text-white/50">experiments</span>
          </h2>
          <p
            ref={descRef}
            className="text-base md:text-lg text-white/60 leading-relaxed max-w-md md:text-right"
            style={{ opacity: 0 }}
          >
            Small browser utilities I build to scratch my own design itch.
            Client-side, free, no signup. A growing collection.
          </p>
        </div>

        <div className="border-t border-white/[0.08]">
          {tools.map((tool, i) => (
            <a
              key={tool.slug}
              href={tool.href}
              target={tool.external ? "_blank" : undefined}
              rel={tool.external ? "noopener noreferrer" : undefined}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="group block border-b border-white/[0.08] py-8 md:py-12 transition-colors duration-300 hover:bg-white/[0.02]"
              style={{ opacity: 0 }}
            >
              <div className="grid grid-cols-[auto_1fr_auto] gap-4 md:gap-10 items-baseline">
                <span className="font-display italic text-white/30 text-sm md:text-base tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="flex items-center gap-3 mb-2 md:mb-3 text-[10px] uppercase tracking-[0.2em] text-white/40">
                    <span>{tool.category}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="font-display italic">{tool.year}</span>
                  </div>
                  <h3 className="font-display text-2xl md:text-4xl lg:text-5xl tracking-tighter leading-[0.95] text-white/90 group-hover:text-[var(--color-accent)] transition-colors duration-300">
                    {tool.name}
                  </h3>
                  <p className="text-sm md:text-base text-white/50 leading-relaxed mt-3 md:mt-4 max-w-2xl">
                    {tool.blurb}
                  </p>
                </div>
                <span
                  aria-hidden
                  className="text-white/30 text-2xl md:text-3xl translate-x-0 group-hover:translate-x-2 group-hover:text-[var(--color-accent)] transition-all duration-300"
                >
                  &rarr;
                </span>
              </div>
            </a>
          ))}
        </div>

        <div
          ref={ctaRef}
          className="mt-10 md:mt-14 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          style={{ opacity: 0 }}
        >
          <p className="text-sm text-white/40">
            {totalCount > tools.length
              ? `Showing ${tools.length} of ${totalCount} tools.`
              : "More on the way."}
          </p>
          <Link
            href="/lab"
            className="group inline-flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors duration-300"
          >
            <span className="uppercase tracking-[0.2em]">Visit the Lab</span>
            <span
              aria-hidden
              className="inline-block translate-x-0 group-hover:translate-x-1 transition-transform duration-300"
            >
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
